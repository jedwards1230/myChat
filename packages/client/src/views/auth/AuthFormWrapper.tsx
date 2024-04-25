import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { FieldValues, UseFormSetError } from "react-hook-form";
import { isFetchError } from "@/lib/fetcher";

export function AuthFormWrapper({ children }: { children: React.ReactNode }) {
	return (
		<AuthViewWrapper>
			<View className="p-8 rounded shadow-sm bg-background">
				<View className="flex gap-4">{children}</View>
			</View>
		</AuthViewWrapper>
	);
}

export function ErrorMessage({ children }: { children: string }) {
	return <Text className="text-center text-red-500">{children}</Text>;
}

export async function parseError<T extends FieldValues>(
	error: any,
	setError: UseFormSetError<T>
) {
	if (isFetchError(error)) {
		const errMsg =
			error.res instanceof Response
				? await error.res.json()
				: error.res instanceof Error
				? { error: error.res.message }
				: error.res.response;
		setError("root", { type: "manual", message: errMsg.error });
	} else {
		console.warn(error);
		setError("root", { type: "manual", message: JSON.stringify(error) });
	}
}
