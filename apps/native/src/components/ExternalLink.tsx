import React from "react";
import { Platform } from "react-native";
import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { Text } from "./ui/Text";

export function ExternalLink({
	children,
	...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
	return (
		<Link
			asChild
			target="_blank"
			{...props}
			href={props.href}
			onPress={(e) => {
				if (Platform.OS !== "web") {
					// Prevent the default behavior of linking to the default browser on native.
					e.preventDefault();
					// Open the link in an in-app browser.
					void WebBrowser.openBrowserAsync(props.href);
				}
			}}
		>
			<Text>{children}</Text>
		</Link>
	);
}
