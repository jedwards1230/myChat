import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { useUserData } from "@/hooks/stores/useUserData";
import type { ChatMessageGroup } from "./MessageGroup";
import { Image } from "expo-image";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function Avatar({ group }: { group: Pick<ChatMessageGroup, "name" | "role"> }) {
	const { user } = useUserData();
	const { role, name, img } =
		group.role === "user"
			? {
					name: user?.name || user?.email || "User",
					role: group.role,
					img: user?.profilePicture,
				}
			: {
					name: group.name || group.role,
					role: group.role,
					img: "",
				};

	return (
		<View
			className={cn(
				"flex items-center justify-center w-6 h-6 rounded-full bg-primary",
				role === "user" ? "bg-black" : "bg-input"
			)}
		>
			{img ? (
				<Image source={img} placeholder={blurhash} />
			) : (
				<Text
					className={cn(
						"text-sm text-center",
						role === "user" ? "text-primary" : "text-secondary-foreground"
					)}
				>
					{name[0]?.toUpperCase() || "?"}
				</Text>
			)}
		</View>
	);
}
