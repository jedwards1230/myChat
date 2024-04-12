import { View } from "react-native";
import { useState } from "react";

import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { createUser, loginUser } from "@/lib/Appwrite";
import { useUserData } from "@/hooks/stores/useUserData";

export function SignUpView() {
	const setSession = useUserData((s) => s.setSession);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSignup = async () => {
		setError("");
		if (!email || !password) {
			setError("Email and Password are required");
			return;
		}
		try {
			const res = await createUser(email, password);
			const sessionRes = await loginUser(email, password);
			setSession(sessionRes);
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
					<Text className="text-xl font-semibold text-center">Sign Up</Text>
					<View className="flex gap-1">
						<Label nativeID="Email">Email</Label>
						<Input
							value={email}
							onChangeText={setEmail}
							autoComplete="email"
							placeholder="Email"
							keyboardType="email-address"
						/>
					</View>
					<View className="flex gap-1">
						<Label nativeID="Password">Password</Label>
						<Input
							value={password}
							onChangeText={setPassword}
							autoComplete="new-password"
							secureTextEntry={true}
							placeholder="Password"
						/>
					</View>
					<AuthButton onPress={handleSignup}>Sign Up</AuthButton>
					{error ? (
						<Text className="text-center text-red-500">{error}</Text>
					) : null}
				</View>
			</View>
		</AuthViewWrapper>
	);
}
