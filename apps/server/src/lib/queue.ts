export default class MessageQueue<T = unknown> {
	public locked = false;
	private threadMap: Record<string, T[]> = {};

	/** Add a message to the queue */
	enqueue(threadId: string, message: T) {
		const queue = this.threadMap[threadId] ?? [];
		this.threadMap[threadId] = [...queue, message];
	}

	/** Dequeue the first item and lock the queue */
	dequeue(threadId: string): T | undefined {
		const queue = this.threadMap[threadId];
		if (!queue) throw new Error(`No queue found for ${threadId}`);
		const item = queue.shift();
		if (item) this.locked = true;
		return item;
	}

	/** Check if the queue for an ID is empty */
	isEmpty(threadId: string): boolean {
		const queue = this.threadMap[threadId];
		if (!queue) throw new Error(`No queue found for ${threadId}`);
		const isEmpty = queue.length === 0;
		if (isEmpty) this.locked = false;
		return isEmpty;
	}
}
