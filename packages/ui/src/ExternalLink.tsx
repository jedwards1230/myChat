import React from "react";
import { TextLink } from "solito/link";

import { Text } from "./native/Text";

export function ExternalLink({
	children,
	...props
}: React.ComponentProps<typeof TextLink>) {
	return (
		<TextLink target="_blank" {...props} href={props.href}>
			<Text>{children}</Text>
		</TextLink>
	);
}
