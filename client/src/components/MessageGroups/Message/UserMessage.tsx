import { Pressable, View } from "react-native";
import { useEffect, useState } from "react";

import type { Message, MessageFile } from "@/types";
import Markdown from "@/components/Markdown/Markdown";
import { Text } from "@/components/ui/Text";
import { useFileQuery } from "@/lib/queries/useFileQuery";

export const UserMessage = ({ message }: { message: Message }) => {
	return (
		<View className="w-full pl-6">
			{message.files &&
				message.files.map((file, index) => (
					<FileMessage
						key={file.name + index.toString()}
						file={file}
						messageId={message.id}
					/>
				))}
			<Markdown>{message.content}</Markdown>
		</View>
	);
};

export const FileMessage = ({
	file,
	messageId,
}: {
	file: MessageFile;
	messageId: string;
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<View className="self-start flex-grow-0 w-auto mb-4">
			<View>
				<Pressable
					className="p-2 border rounded-md bg-secondary"
					onPress={toggleVisibility}
				>
					<Text>{file.name}</Text>
				</Pressable>
			</View>
			{isVisible && <FileContent file={file} messageId={messageId} />}
		</View>
	);
};

function FileContent({ file, messageId }: { file: MessageFile; messageId: string }) {
	const fileQuery = useFileQuery(messageId, file.id);
	const { data } = fileQuery;
	const [fileString, setFileString] = useState("");

	useEffect(() => {
		console.log("data.fileData", data.fileData); // Check the structure of fileData
		if (data && data.fileData && data.fileData.blob) {
			const data1 = (data.fileData.blob as any).data;
			if (data1 instanceof Blob) {
				console.log("Blob detected");
			} else if (data1 instanceof ArrayBuffer) {
				console.log("ArrayBuffer detected");
			} else if (data1 instanceof Uint8Array) {
				console.log("Uint8Array detected");
			} else {
				console.log("Unknown type detected", typeof data1, data1);
			}

			const buf = new Blob([data1]);
			console.log("Blob", buf);

			const reader = new FileReader();
			reader.onloadend = () => {
				console.log("Read file:", reader.result);
				console.log("Read type", typeof reader.result);
				setFileString(reader.result?.toString() || "");
			};
			reader.onerror = (error) => {
				console.error("FileReader error:", error);
			};
			reader.readAsText(buf);
		}
	}, [data]);

	console.log({ fd: data.fileData, fileString });

	return (
		<View>
			<Markdown>{"```\n" + fileString + "\n```"}</Markdown>
		</View>
	);
}
