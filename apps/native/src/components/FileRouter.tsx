import type { FileInformation, MessageQueryOpts } from "@/hooks/useFileInformation";

export interface RouterData {
	files: FileInformation[];
	query?: MessageQueryOpts;
}

export interface LocalFileData {
	file: FileInformation;
	query?: MessageQueryOpts;
}

export type FileData = LocalFileData;

export interface RouterChildrenProps {
	FileButton: React.ComponentType<{ data: FileData }>;
	FolderButton: React.ComponentType<{
		baseDir: string;
		data: RouterData;
		routerComponents: RouterChildrenProps;
	}>;
}

export function FileRouter({
	data,
	parentDir,
	routerComponents,
}: {
	data: RouterData;
	parentDir?: string;
	routerComponents: RouterChildrenProps;
}) {
	// separate folders and files
	const filesInDirectory: FileInformation[] = [];
	const standaloneFiles: FileInformation[] = [];

	const FolderButton = routerComponents.FolderButton;
	const FileButton = routerComponents.FileButton;

	data.files.forEach((file) => {
		if (file.relativePath) {
			if (parentDir) {
				// diff between parent dir and file relative path
				const relativePath = file.relativePath.replace(parentDir + "/", "");
				const pathParts = relativePath.split("/");
				if (pathParts.length === 1) {
					standaloneFiles.push(file);
				} else {
					filesInDirectory.push(file);
				}
			} else {
				filesInDirectory.push(file);
			}
		} else {
			standaloneFiles.push(file);
		}
	});

	const filesByBaseDir: Record<string, FileInformation[]> = filesInDirectory.reduce(
		(acc, file) => {
			if (!file.relativePath) return acc;

			let baseDir: string | undefined;
			if (parentDir) {
				const relativePath = file.relativePath.replace(parentDir + "/", "");
				const filePathParts = relativePath.split("/");
				const basePath = filePathParts.shift();
				baseDir = [parentDir, basePath].join("/");
			} else {
				const filePathParts = file.relativePath.split("/");
				baseDir = filePathParts.shift();
			}

			if (!baseDir) return acc;
			if (!acc[baseDir]) acc[baseDir] = [];

			acc[baseDir]?.push(file);
			return acc;
		},
		{} as Record<string, FileInformation[]>,
	);

	return (
		<>
			{Object.entries(filesByBaseDir).map(([dir, files]) => (
				<FolderButton
					key={dir}
					baseDir={dir}
					data={{ ...data, files }}
					routerComponents={routerComponents}
				/>
			))}
			{standaloneFiles.map((file, index) => (
				<FileButton key={index} data={{ file, query: data.query }} />
			))}
		</>
	);
}
