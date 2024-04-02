import { View } from "react-native";

import { Text } from "@/components/ui/Text";

export function Section(props: {
	title: string;
	children: React.ReactNode;
	titleComponent?: React.ReactNode;
}) {
	return (
		<View className="w-full">
			<View className="flex flex-row items-center justify-between px-4 pb-2">
				<Text className="text-secondary-foreground">{props.title}</Text>
				{props.titleComponent}
			</View>
			<SectionBlock>{props.children}</SectionBlock>
		</View>
	);
}

export function SectionBlock(props: { children: React.ReactNode }) {
	return (
		<View className="flex w-full gap-2 p-2 overflow-hidden rounded-lg bg-input md:bg-background web:border md:p-4 web:border-border">
			{props.children}
		</View>
	);
}

export function RowItem(props: { children: React.ReactNode }) {
	return (
		<View className="flex flex-row items-center justify-between flex-1 w-full h-10 px-2">
			{props.children}
		</View>
	);
}
