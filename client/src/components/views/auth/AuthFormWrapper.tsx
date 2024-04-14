import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { FetchError } from "@/lib/fetcher";
import { UseFormSetError } from "react-hook-form";
import { AuthInput } from "@/types/schemas";

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

export async function parseError(error: any, setError: UseFormSetError<AuthInput>) {
	if (error instanceof FetchError) {
		const errMsg =
			error.res instanceof Response ? await error.res.json() : error.res.response;
		setError("root", { type: "manual", message: errMsg.error });
	} else {
		console.warn(error);
		setError("root", { type: "manual", message: JSON.stringify(error) });
	}
}
