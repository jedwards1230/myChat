import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream.mjs";

import logger, { streamLogger } from "@/lib/logs/logger";
import type MessageQueue from "@/lib/queue";

import type { Thread } from "@/modules/Thread/ThreadModel";
import type { Message } from "../Message/MessageModel";
import type { ToolCall } from "../Message/ToolCallModel";
import { pgRepo } from "@/lib/pg";

type QueueItem = ChatCompletionMessageParam;
export type AddMessageQueue = MessageQueue<QueueItem>;

export class StreamResponseController {
	static async processResponse(thread: Thread, response: ChatCompletionStream) {
		let newMessage = pgRepo["Message"].create();
		response
			.on("abort", (e) => streamLogger.warn("ABORTED", { e }))
			.on("chunk", async (chunk) => {
				const delta = chunk.choices[0]?.delta;
				if (delta?.role) {
					newMessage = await pgRepo["Message"].save(delta);
					streamLogger.info("added message", { delta, chunk, newMessage });
				}
			})
			.on("content", async (chunk, content) => {
				if (!newMessage.id)
					return streamLogger.warn("No message id", { content, newMessage });
				newMessage.content = content;
				await pgRepo["Message"].update({ id: newMessage.id }, { content });
				streamLogger.info("updateContent", { content, newMessage });
			})
			.on("message", async (message) => {
				streamLogger.info("onMessage", { msg: message, newMessage });
				await this.processThread(thread.id, newMessage);
			})
			.on("error", (error) => {
				if ("code" in error && error.code === "insufficient_quota")
					return logger.error("Stream error: insufficient_quota");
				logger.error("Stream error", { err: error });
				throw error;
			});
	}

	private static async processThread(threadId: string, message: Message) {
		const thread = await pgRepo["Thread"].findOneOrFail({
			where: { id: threadId },
			relations: {
				activeMessage: true,
				messages: true,
			},
		});

		streamLogger.info("processThread", { thread, msg: message });

		let newMsg: Message | undefined;
		if (message.role === "tool") {
			const toolMsg = await this.handleToolMessage(message, thread);
			newMsg = toolMsg;
		} else if (message.role === "assistant") {
			newMsg = await this.handleAssistantMessage(message, thread);
		}
		if (!newMsg) throw new Error("No new message");

		thread.activeMessage = newMsg;
		thread.messages = thread.messages ? [...thread.messages, newMsg] : [newMsg];
		await pgRepo["Thread"].save(thread);
	}

	private static async handleAssistantMessage(message: Message, thread: Thread) {
		if (!thread.activeMessage) throw new Error("No active message in thread");

		const msg = pgRepo["Message"].create({
			role: "assistant",
			parent: thread.activeMessage,
		});

		if (message.content) msg.content = message.content;
		if (message.name) msg.name = message.name;
		if (message.tool_calls) {
			let tool_calls: ToolCall[] | undefined;
			tool_calls = await pgRepo["ToolCall"].find({
				where: message.tool_calls.map((tc) => ({ id: tc.id })),
			});

			if (tool_calls.length !== message.tool_calls.length) {
				tool_calls = await pgRepo["ToolCall"].save(message.tool_calls);
			}

			msg.tool_calls = tool_calls;
		}

		const assistantMsg = await pgRepo["Message"].save(msg);

		return assistantMsg;
	}

	private static async handleToolMessage(message: Message, thread: Thread) {
		if (!thread.activeMessage) throw new Error("No active message in thread");
		if (!message.tool_call_id) throw new Error("No tool call id in message");

		const toolCall = await pgRepo["ToolCall"].findOneByOrFail({
			id: message.tool_call_id.id,
		});
		toolCall.content = message.content;

		const toolMsg = await pgRepo["Message"].save({
			role: "tool",
			content: message.content,
			parent: thread.activeMessage,
			name: toolCall.function?.name || "Tool Name",
			tool_call_id: toolCall,
		});

		return toolMsg;
	}
}
