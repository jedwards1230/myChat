import { Text } from "@/components/ui/Text";
import LinkButton from "./LinkButton";
import { Ionicons } from "@/components/ui/Icon";

export function AgentsButton() {
	return (
		<LinkButton
			className="pr-8"
			href={{
				pathname: "/(chat)/agents",
			}}
		>
			<Ionicons
				name="grid-outline"
				size={20}
				className="text-secondary-foreground"
			/>
			<Text className="font-medium" numberOfLines={1} ellipsizeMode="tail">
				Agents
			</Text>
		</LinkButton>
	);
}
