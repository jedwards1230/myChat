import type { FileInformation } from "@mychat/ui/hooks/useFileInformation";
import { ExternalLink } from "@mychat/ui/ExternalLink";

import { RowItem, Section } from "~/native/Section";
import { Text } from "~/native/Text";

export function FileMetadata({ file }: { file: FileInformation }) {
	return (
		<Section
			title="File Information"
			titleComponent={
				file.href ? <ExternalLink href={file.href}>Download</ExternalLink> : null
			}
		>
			<RowItem>
				<Text>Name</Text>
				<Text className="text-sm text-secondary-foreground">{file.name}</Text>
			</RowItem>
			<RowItem>
				<Text>Relative Path</Text>
				<Text className="text-sm text-secondary-foreground">
					{file.relativePath}
				</Text>
			</RowItem>
			<RowItem>
				<Text>Type</Text>
				<Text className="text-sm text-secondary-foreground">{file.type}</Text>
			</RowItem>
			<RowItem>
				<Text>Size</Text>
				<Text className="text-sm text-secondary-foreground">{file.size}</Text>
			</RowItem>
		</Section>
	);
}
