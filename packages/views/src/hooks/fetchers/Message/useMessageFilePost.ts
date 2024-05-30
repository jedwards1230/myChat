import type { FileInformation } from "@mychat/ui/hooks/useFileInformation";
import { api } from "@mychat/api/client/react-query";
import { toMessageFile } from "@mychat/ui/hooks/useFileInformation";

import { useFileStore } from "../../useChat/fileStore";

/** Post a message file to the server */
export const useMessageFilePost = () => {
	const client = api.useUtils();
	const { reset, setFiles, fileList } = useFileStore();

	return api.messageFile.create.useMutation({
		onMutate: async (messageFile) => {
			const cacheMessages = async () => {
				const cached = client.message.all.getData();
				await client.message.all.cancel();

				// Add the files to the message
				const prevMessages = cached ?? [];
				const messages = prevMessages.map((m) =>
					m.id === messageFile.messageId ? { ...m, files: fileList } : m,
				);

				//client.message.all.setData(undefined, messages);

				return messages;
			};

			const cacheFiles = async () => {
				const cached = client.messageFile.all.getData();
				await client.messageFile.all.cancel();

				// Add the optimistic files to cache
				const prevFiles = cached ?? [];
				const files = fileList.map((f) => toMessageFile(f));

				// Merge prevFiles and files, ensuring each object is unique by id
				const mergedFiles = [...files, ...prevFiles].reduce(
					(unique, item) => {
						return unique.find((file) => file.id === item.id)
							? unique
							: [...unique, item];
					},
					[] as typeof files,
				);

				//client.messageFile.all.setData(undefined, mergedFiles);

				return mergedFiles;
			};

			const [prevMessages, mergedFiles] = await Promise.all([
				cacheMessages(),
				cacheFiles(),
			]);

			reset();
			return { prevMessages, fileList, mergedFiles };
		},
		onError: async (error) => {
			console.error(error);
			setFiles(fileList);
			await client.messageFile.all.invalidate();
		},
		onSettled: async () => {
			await Promise.all([
				client.messageFile.all.invalidate(),
				client.message.all.invalidate(),
			]);
		},
	});
};

export const buildFormData = async (fileList: FileInformation[]) => {
	const formData = new FormData();
	fileList.forEach((f, index) => {
		if (!f.file) throw new Error("File not found");
		try {
			// Append file buffer
			formData.append(`file${index}`, f.file, f.name);

			// Clone to avoid mutating original object when deleting file key
			const metadata = { ...f };
			delete metadata.buffer; // Remove the file object

			// Append metadata as a JSON string
			formData.append(`metadata${index}`, JSON.stringify(metadata));
		} catch (error) {
			console.error("Error building form data", error);
		}
	});
	return formData;
};
