import { View } from "react-native";
import { SolitoImage } from "solito/image";

import { Text } from "@mychat/ui/native/Text";
import { cn } from "@mychat/ui/utils";

import type { ChatMessageGroup } from "./MessageGroup";
import { useUserData } from "../../hooks/useUserData";

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function Avatar({ group }: { group: Pick<ChatMessageGroup, "name" | "role"> }) {
	const { user } = useUserData();
	const { role, name, img } =
		group.role === "user"
			? {
					name: user?.name ?? user?.email ?? "User",
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
				"flex h-6 w-6 items-center justify-center rounded-full bg-primary",
				role === "user" ? "bg-black" : "bg-input",
			)}
		>
			{img ? (
				<SolitoImage
					src={img as any}
					alt={name}
					width={24}
					height={24}
					contentFit="contain"
					resizeMode={"contain"}
					onLayout={() => console.log("onLayout - Avatar")}
					placeholder="blur"
					blurDataURL={blurhash}
				/>
			) : (
				<Text
					className={cn(
						"text-center text-sm",
						role === "user" ? "text-primary" : "text-secondary-foreground",
					)}
				>
					{name[0]?.toUpperCase() ?? "?"}
				</Text>
			)}
		</View>
	);
}
