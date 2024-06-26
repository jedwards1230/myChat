import z from "zod";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/Textarea";
import type { Message } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage, parseError } from "@/views/auth/AuthFormWrapper";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { useGroupStore } from "../../GroupStore";
import { useMessagePatch } from "@/hooks/fetchers/Message/useMessagePatch";

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
            parseError(error, setError);
        }
    };

    return (
        <View className="flex flex-1 h-full pb-2">
            <Controller
                control={control}
                name="input"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Textarea
                        onBlur={onBlur}
                        onChangeText={onChange}
                        className="px-2 py-0 h-full !border-0 web:focus-visible:!ring-offset-0 bg-transparent focus-visible:!border-transparent !border-transparent web:focus-visible:ring-0"
                        value={value}
                    />
                )}
            />
            {errors.input && errors.input.message && (
                <ErrorMessage>{errors.input.message}</ErrorMessage>
            )}
            <View className="flex flex-row justify-center gap-4 mt-2">
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
