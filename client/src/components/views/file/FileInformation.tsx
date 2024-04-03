import { ExternalLink } from "@/components/ExternalLink";
import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

export type FileInformation = {
	name?: string;
	href: string;
	extension?: string;
	relativePath?: string;
	type?: string;
	size: string;
	buffer?: ArrayBufferLike;
	parsed?: string;
};

export function FileInformation({ file }: { file: FileInformation }) {
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
					{file?.relativePath}
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
