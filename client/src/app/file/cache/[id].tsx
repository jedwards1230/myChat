import { useLocalSearchParams } from "expo-router";

import FileModal from "@/components/views/file/FileModal";
import { useFileStore } from "@/lib/stores/fileStore";

export default function FilePage() {
	const { id } = useLocalSearchParams();
	const { fileList } = useFileStore();
	const file = fileList.find((file) => file.name === id);

	if (!file) throw new Error("File not found");

	return <FileModal cache={true} file={file} />;
}

export { ErrorBoundary } from "expo-router";
