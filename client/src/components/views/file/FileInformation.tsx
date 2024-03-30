import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import type { CacheFile } from "@/types";

export function FileInformation({ file }: { file: CacheFile }) {
	return (
		<Section title="File Information">
			<RowItem>
				<Text>Name</Text>
				<Text className="text-sm text-secondary-foreground">{file?.name}</Text>
			</RowItem>
			<RowItem>
				<Text>Relative Path</Text>
				<Text className="text-sm text-secondary-foreground">
					{file?.relativePath}
				</Text>
			</RowItem>
			<RowItem>
				<Text>Type</Text>
				<Text className="text-sm text-secondary-foreground">
					{file?.mimeType}
				</Text>
			</RowItem>
			<RowItem>
				<Text>Size</Text>
				<Text className="text-sm text-secondary-foreground">{file?.size}</Text>
			</RowItem>
		</Section>
	);
}
