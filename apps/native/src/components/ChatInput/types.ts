export type ChatInputProps = {
	threadId: string | null;
	input: string;
	setInput: (input: string) => void;
	handleSubmit: () => void;
};
