import { useLocalSearchParams } from "expo-router";

import FileModal from "@mychat/ui/views/file/FileModal";

export default function FilePage() {
	const { id, messageId, threadId } = useLocalSearchParams<{
		id: string;
		messageId?: string;
		threadId?: string;
	}>();

	if (!id) throw new Error("File ID is required");
	if (!messageId) throw new Error("Message ID is required");
	if (!threadId) throw new Error("Thread ID is required");

	return <FileModal fileMeta={{ fileId: id, messageId, threadId }} />;
}

export { ErrorBoundary } from "expo-router";
