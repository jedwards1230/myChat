import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { useUserData } from "@/hooks/stores/useUserData";
import { AuthInput } from "@/types/schemas";

export function LoginView() {
	const {
		control,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm<AuthInput>({
		resolver: zodResolver(AuthInput),
		defaultValues: { email: "", password: "" },
	});

	const login = useUserData((state) => state.login);

	const handleLogin = async () => {
		try {
			await login(watch("email"), watch("password"));
		} catch (error) {
			setError("root", { type: "manual", message: JSON.stringify(error) });
		}
	};
	return (
		<AuthViewWrapper>
			<View className="p-8 border rounded shadow-sm bg-background border-border">
				<View className="flex gap-4">
					<Text className="text-xl font-semibold text-center">Login</Text>
					<View className="flex gap-1">
						<Label nativeID="Email">Email</Label>
						<Controller
							control={control}
							name="email"
							rules={{ required: true }}
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Username"
									onBlur={onBlur}
									autoComplete="username"
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						{errors.email && <ErrorMessage>This is required.</ErrorMessage>}
					</View>
					<View className="flex gap-1">
						<Label nativeID="Password">Password</Label>
						<Controller
							control={control}
							name="password"
							rules={{ required: true }}
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Password"
									onBlur={onBlur}
									autoComplete="current-password"
									secureTextEntry={true}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						{errors.password && (
							<ErrorMessage>
								{errors.password.message || "Unknown error"}
							</ErrorMessage>
						)}
					</View>
					<AuthButton onPress={handleSubmit(handleLogin)}>Login</AuthButton>
					{errors.root ? (
						<ErrorMessage>
							{JSON.stringify(errors.root, null, 2)}
						</ErrorMessage>
					) : null}
				</View>
			</View>
		</AuthViewWrapper>
	);
}

function ErrorMessage({ children }: { children: string }) {
	return <Text className="text-center text-red-500">{children}</Text>;
}
