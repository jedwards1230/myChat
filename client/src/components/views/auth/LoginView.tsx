import { View } from "react-native";
import { useState } from "react";

import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { useUserData } from "@/hooks/stores/useUserData";

export function LoginView() {
	const login = useUserData((state) => state.login);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = async () => {
		setError("");
		if (!email || !password) {
			setError("Email and Password are required");
			return;
		}
		try {
			await login(email, password);
		} catch (error) {
			setError(JSON.stringify(error, null, 2));
		} finally {
			setEmail("");
			setPassword("");
		}
	};
	return (
		<AuthViewWrapper>
			<View className="p-8 border rounded shadow-sm bg-background border-border">
				<View className="flex gap-4">
					<Text className="text-xl font-semibold text-center">Login</Text>
					<View className="flex gap-1">
						<Label nativeID="Username">Username</Label>
						<Input
							value={email}
							onChangeText={setEmail}
							autoComplete="username"
							placeholder="Username"
						/>
					</View>
					<View className="flex gap-1">
						<Label nativeID="Password">Password</Label>
						<Input
							value={password}
							onChangeText={setPassword}
							autoComplete="current-password"
							secureTextEntry={true}
							placeholder="Password"
						/>
					</View>
					<AuthButton onPress={handleLogin}>Login</AuthButton>
					{error ? (
						<Text className="text-center text-red-500">{error}</Text>
					) : null}
				</View>
			</View>
		</AuthViewWrapper>
	);
}
