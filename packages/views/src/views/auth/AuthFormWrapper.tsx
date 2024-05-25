import type { FieldValues, UseFormSetError } from "react-hook-form";
import { View } from "react-native";

import { isFetchError } from "@mychat/api/fetcher";

import { Text } from "~/native/Text";
import { AuthViewWrapper } from "./AuthViewWrapper";

export function AuthFormWrapper({ children }: { children: React.ReactNode }) {
	return (
		<AuthViewWrapper>
			<View className="rounded bg-background p-8 shadow-sm">
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
	setError: UseFormSetError<T>,
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
