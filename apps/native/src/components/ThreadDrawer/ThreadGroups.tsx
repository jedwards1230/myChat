import type { Thread } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";

import { Label } from "../ui/Label";
import { ThreadButton } from "./ThreadButton/ThreadButton";

interface ThreadGroup {
	label: string;
	threads: Thread[];
}

export const ThreadGroup = ({ group: { label, threads } }: { group: ThreadGroup }) => (
	<View>
		<Label
			className="mb-1 mt-2 pl-1 !text-xs text-foreground/75"
			id={"group-label-" + label}
		>
			{label}
		</Label>
		{threads.map((thread) => (
			<ThreadButton key={thread.id} thread={thread} />
		))}
	</View>
);

export function useThreadGroups(threads: Thread[] = []): ThreadGroup[] {
	return useMemo(() => {
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
				(now - new Date(thread.lastModified).getTime()) / (1000 * 60 * 60 * 24),
			);

			for (let i = 0; i < labels.length; i++) {
				if (diffInDays <= (labels[i]?.days ?? 0)) {
					groups[i]?.threads.push(thread);
					break;
				}
			}
		}

		return groups.filter((group) => group.threads.length > 0);
	}, [threads]);
}
