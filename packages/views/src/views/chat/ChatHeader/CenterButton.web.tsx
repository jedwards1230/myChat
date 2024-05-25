import { View } from "react-native";

import { Icon } from "~/native/Icon";
import { Text } from "~/native/Text";
import { Dropdown } from "./Dropdown";

export function CenterButton({ threadId }: { threadId: string | null }) {
	return (
		<View className="flex w-full items-center justify-center md:items-start">
			<Dropdown
				threadId={threadId}
				className="mx-auto flex w-auto flex-row items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-foreground/10 md:ml-2"
			>
				<Text
					numberOfLines={1}
					ellipsizeMode="tail"
					className="text-lg font-bold"
				>
					myChat
				</Text>
				<Icon
					type="AntDesign"
					name="down"
					size={12}
					className="text-secondary-foreground"
				/>
			</Dropdown>
		</View>
	);
}
