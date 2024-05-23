import type { Message } from "@/types";
import { View } from "react-native";
import { useMessagePatch } from "@/hooks/fetchers/Message/useMessagePatch";
import { ErrorMessage, parseError } from "@/views/auth/AuthFormWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@mychat/ui/native/Button";
import { Text } from "@mychat/ui/native/Text";
import { Textarea } from "@mychat/ui/native/Textarea";

import { useGroupStore } from "../../GroupStore";

const InputEdit = z.object({
	input: z.string(),
});
type InputEdit = z.infer<typeof InputEdit>;

export function EditableMessage({
	message,
	threadId,
}: {
	message: Message;
	threadId: string;
}) {
	const resetGroupState = useGroupStore((s) => s.reset);
	const { mutateAsync } = useMessagePatch();

	const {
		control,
		handleSubmit,
		watch,
		setError,
		reset,
		formState: { errors },
	} = useForm<InputEdit>({
		resolver: zodResolver(InputEdit),
		defaultValues: { input: message.content ?? "" },
	});

	const toggleEditMode = () => {
		resetGroupState();
		reset();
	};

	const handleEdit = async () => {
		try {
			await mutateAsync({
				threadId,
				messageId: message.id,
				content: watch("input"),
			});
			toggleEditMode();
		} catch (error) {
			await parseError(error, setError);
		}
	};

	return (
		<View className="flex h-full flex-1 pb-2">
			<Controller
				control={control}
				name="input"
				rules={{ required: true }}
				render={({ field: { onChange, onBlur, value } }) => (
					<Textarea
						onBlur={onBlur}
						onChangeText={onChange}
						className="web:focus-visible:!ring-offset-0 web:focus-visible:ring-0 h-full !border-0 !border-transparent bg-transparent px-2 py-0 focus-visible:!border-transparent"
						value={value}
					/>
				)}
			/>
			{errors.input?.message && <ErrorMessage>{errors.input.message}</ErrorMessage>}
			<View className="mt-2 flex flex-row justify-center gap-4">
				<Button onPress={toggleEditMode} size="sm">
					<Text>Cancel</Text>
				</Button>
				<Button onPress={handleSubmit(handleEdit)} size="sm">
					<Text>Save</Text>
				</Button>
			</View>
		</View>
	);
}
