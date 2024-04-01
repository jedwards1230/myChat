import type {
	ChatCompletionAssistantMessageParam,
	ChatCompletionChunk,
	ChatCompletionMessageParam,
	ChatCompletionToolMessageParam,
} from "openai/resources/index";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream";

import logger, { streamLogger } from "@/lib/logs/logger";
import MessageQueue from "@/lib/queue";

import { Thread } from "@/modules/Thread/ThreadModel";
import { getThreadRepo } from "@/modules/Thread/ThreadRepo";
import type { Message } from "../Message/MessageModel";
import { getToolCallRepo, getMessageRepo } from "../Message/MessageRepo";
import type { ToolCall } from "../Message/ToolCallModel";

export type AddMessageQueue = MessageQueue<ChatCompletionMessageParam>;

export class StreamResponseController {
	static async processResponse(
		thread: Thread,
		response: ChatCompletionStream,
		messageQueue: AddMessageQueue
	) {
		response.on("message", (message) => {
			messageQueue.enqueue(thread.id, message);
			if (!messageQueue.locked) this.processQueue(thread, messageQueue);
		});
	}

	private static async processQueue(threadRef: Thread, mq: AddMessageQueue) {
		while (!mq.isEmpty(threadRef.id)) {
			const message = mq.dequeue(threadRef.id);
			if (!message) throw new Error("No message in queue");

			const thread = await getThreadRepo().findOneOrFail({
				where: { id: threadRef.id },
				relations: {
					activeMessage: true,
					messages: true,
				},
			});

			try {
				let newMsg: Message | undefined;
				if (message.role === "tool") {
					const toolMsg = await this.handleToolMessage(message, thread);
					newMsg = toolMsg;
				} else if (message.role === "assistant") {
					newMsg = await this.handleAssistantMessage(message, thread);
				}
				if (!newMsg) throw new Error("No new message");

				thread.activeMessage = newMsg;
				thread.messages = thread.messages
					? [...thread.messages, newMsg]
					: [newMsg];

				await getThreadRepo().save(thread);
			} catch (error) {
				logError("Error processing queue", {
					error,
					functionName: "processQueue",
				});
				throw error;
			} finally {
				mq.locked = false;
			}
		}
	}

	private static async handleToolMessage(
		message: ChatCompletionToolMessageParam,
		thread: Thread
	) {
		if (!thread.activeMessage) throw new Error("No active message in thread");

		const toolCall = await getToolCallRepo().findOneByOrFail({
			id: message.tool_call_id,
		});
		toolCall.content = message.content;

		const toolMsg = await getMessageRepo().save({
			role: "tool",
			content: message.content,
			parent: thread.activeMessage,
			name: toolCall.function?.name || "Tool Name",
			tool_call_id: toolCall,
		});

		return toolMsg;
	}

	private static async handleAssistantMessage(
		message: ChatCompletionAssistantMessageParam,
		thread: Thread
	) {
		if (!thread.activeMessage) throw new Error("No active message in thread");

		const msg = getMessageRepo().create({
			role: "assistant",
			parent: thread.activeMessage,
		});

		if (message.content) msg.content = message.content;
		if (message.name) msg.name = message.name;
		if (message.tool_calls) {
			let tool_calls: ToolCall[] | undefined;
			tool_calls = await getToolCallRepo().find({
				where: message.tool_calls.map((tc) => ({ id: tc.id })),
			});

			if (tool_calls.length !== message.tool_calls.length) {
				tool_calls = await getToolCallRepo().save(message.tool_calls);
			}

			msg.tool_calls = tool_calls;
		}

		const assistantMsg = await getMessageRepo().save(msg);

		return assistantMsg;
	}
}

function logError(message: string, data: any) {
	logger.error(message, {
		...data,
		functionName: `StreamResponseController.${data.functionName}`,
	});
}
