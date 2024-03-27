import type { ChatCompletionMessageParam } from "openai/resources/index";

export default class MessageQueue {
	public locked = false;
	private threadMap: Record<string, ChatCompletionMessageParam[]> = {};

	enqueue(threadId: string, message: ChatCompletionMessageParam) {
		const queue = this.threadMap[threadId] || [];
		this.threadMap[threadId] = [...queue, message];
	}

	dequeue(threadId: string): ChatCompletionMessageParam | undefined {
		const queue = this.threadMap[threadId];
		if (!queue) throw new Error(`No queue found for ${threadId}`);
		const item = queue.shift();
		if (item) this.locked = true;
		return item;
	}

	isEmpty(threadId: string): boolean {
		const queue = this.threadMap[threadId];
		if (!queue) throw new Error(`No queue found for ${threadId}`);
		const isEmpty = queue.length === 0;
		if (isEmpty) this.locked = false;
		return isEmpty;
	}
}
