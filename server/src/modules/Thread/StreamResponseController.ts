import type {
	ChatCompletionAssistantMessageParam,
	ChatCompletionChunk,
	ChatCompletionToolMessageParam,
} from "openai/resources/index";
import type { ChatCompletionStream } from "openai/lib/ChatCompletionStream";

import type { Connection } from "@/lib/ws";
import type { SocketServerMessage } from "@/types/wsResponse";
import logger, { streamLogger } from "@/lib/logs/logger";
import MessageQueue from "@/lib/queue";

import { Thread, ThreadRepo } from "@/modules/Thread/";
import { ToolCall, Message, MessageRepo, ToolCallRepo } from "@/modules/Message/";

export class StreamResponseController {
	static async processResponse(
		thread: Thread,
		response: ChatCompletionStream,
		{ ws, messageQueue }: Connection
	) {
		const send = (data: SocketServerMessage) => ws.send(JSON.stringify(data));
		response.on("message", (message) => {
			messageQueue.enqueue(thread.id, message);
			if (!messageQueue.locked) this.processQueue(thread, messageQueue, send);
		});
		response.on("chunk", (chunk) => this.handleChunk(chunk, send));
		response.on("content", (_, chunk) => this.handleContent(chunk, send));
		response.on("finalMessage", () => send({ type: "finalMessage", data: true }));
	}

	private static async processQueue(
		thread: Thread,
		mq: MessageQueue,
		send: (data: SocketServerMessage) => void
	) {
		while (!mq.isEmpty(thread.id)) {
			const message = mq.dequeue(thread.id);
			if (!message) throw new Error("No message in queue");

			let newMsg: Message | undefined;
			if (message.role === "tool") {
				newMsg = await this.handleToolMessage(message, thread, send);
			} else if (message.role === "assistant") {
				newMsg = await this.handleAssistantMessage(message, thread);
			}

			if (!newMsg) throw new Error("No new message");

			thread.activeMessage = newMsg;
			thread.messages = [...thread.messages, newMsg];

			const newThread = await ThreadRepo.save(thread);
		}
	}

	private static async handleToolMessage(
		message: ChatCompletionToolMessageParam,
		thread: Thread,
		send: (data: SocketServerMessage) => void
	) {
		if (!thread.activeMessage) throw new Error("No active message in thread");

		const toolCall = await ToolCallRepo.findOneByOrFail({
			id: message.tool_call_id,
		});
		toolCall.content = message.content;

		const toolMsg = await MessageRepo.save({
			role: "tool",
			content: message.content,
			parent: thread.activeMessage,
			name: toolCall.function?.name || "Tool Name",
			tool_call_id: toolCall,
		});

		send({
			type: "tool",
			data: toolMsg,
		});

		return toolMsg;
	}

	private static async handleAssistantMessage(
		message: ChatCompletionAssistantMessageParam,
		thread: Thread
	) {
		if (!thread.activeMessage) throw new Error("No active message in thread");

		const msg = MessageRepo.create({
			role: "assistant",
			parent: thread.activeMessage,
		});

		if (message.content) msg.content = message.content;
		if (message.name) msg.name = message.name;
		if (message.tool_calls) {
			let tool_calls: ToolCall[] | undefined;
			tool_calls = await ToolCallRepo.find({
				where: message.tool_calls.map((tc) => ({ id: tc.id })),
			});

			if (tool_calls.length !== message.tool_calls.length) {
				tool_calls = await ToolCallRepo.save(message.tool_calls);
			}

			msg.tool_calls = tool_calls;
		}

		const assistantMsg = await MessageRepo.save(msg);

		return assistantMsg;
	}

	private static async handleChunk(
		chunk: ChatCompletionChunk,
		send: (data: SocketServerMessage) => void
	) {
		try {
			const delta = chunk.choices[0].delta;
			send({ type: "chunk", data: delta });
		} catch (error) {
			logError("Error saving chunk", { error, chunk, functionName: "handleChunk" });
			throw error;
		}
	}

	private static async handleContent(
		chunk: string,
		send: (data: SocketServerMessage) => void
	) {
		streamLogger.info("Handling content", {
			chunk,
		});
		send({ type: "content", data: chunk });
	}
}

function log(message: string, data: any) {
	logger.debug(message, {
		...data,
		functionName: `StreamResponseController.${data.functionName}`,
	});
}

function logError(message: string, data: any) {
	logger.error(message, {
		...data,
		functionName: `StreamResponseController.${data.functionName}`,
	});
}
