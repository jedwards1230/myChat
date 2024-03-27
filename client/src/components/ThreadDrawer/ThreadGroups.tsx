import { View } from "react-native";

import { ThreadButton } from "./ThreadButton/ThreadButton";
import { Thread } from "@/types";
import { Text } from "@/components/ui/Text";

type ThreadGroup = {
	label: string;
	threads: Thread[];
};

export const ThreadGroup = ({ group: { label, threads } }: { group: ThreadGroup }) => (
	<View>
		<Text>{label}</Text>
		{threads.map((thread) => (
			<ThreadButton key={thread.id} thread={thread} />
		))}
	</View>
);

export function groupThreadsByDate(threads: Thread[] = []): ThreadGroup[] {
	const labels = [
		{ label: "Today", days: 1 },
		{ label: "Yesterday", days: 2 },
		{ label: "Previous 7 days", days: 7 },
		{ label: "Last 1 month", days: 30 },
		{ label: "Last 3 months", days: 90 },
		{ label: "Last 1 year", days: 365 },
	];

	const groups: ThreadGroup[] = labels.map((label) => ({
		label: label.label,
		threads: [],
	}));

	const now = Date.now();
	for (const thread of threads) {
		const diffInDays = Math.floor(
			(now - new Date(thread.lastModified).getTime()) / (1000 * 60 * 60 * 24)
		);

		for (let i = 0; i < labels.length; i++) {
			if (diffInDays <= labels[i].days) {
				groups[i].threads.push(thread);
				break;
			}
		}
	}

	return groups.filter((group) => group.threads.length > 0);
}