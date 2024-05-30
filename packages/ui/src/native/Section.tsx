import { View } from "react-native";

import { Text } from "../native/Text";

export function Section(props: {
	title: string;
	children: React.ReactNode;
	titleComponent?: React.ReactNode;
}) {
	return (
		<View className="flex w-full flex-col">
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
		<View className="flex w-full items-stretch gap-2 rounded-lg bg-input p-2 web:border web:border-border md:bg-background md:p-4">
			{props.children}
		</View>
	);
}

export function RowItem(props: { children: React.ReactNode }) {
	return (
		<View className="flex h-10 max-h-10 min-h-10 w-full flex-row items-center justify-between px-2">
			{props.children}
		</View>
	);
}
