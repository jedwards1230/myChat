import { KeyboardAvoidingView, Pressable, View } from "react-native";

import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useState } from "react";

export function LoginView() {
	return (
		<View className="h-full text-base bg-accent text-foreground">
			<View className="flex justify-center h-full px-8 pb-16">
				<KeyboardAvoidingView>
					<LoginCard />
				</KeyboardAvoidingView>
			</View>
		</View>
	);
}

function LoginCard() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleLogin = () => {
		setError("");
		console.log("Login", { username, password });
	};

	return (
		<View className="p-8 border rounded shadow-sm bg-background border-border">
			<View className="flex gap-4">
				<Text className="text-xl font-semibold text-center">Login</Text>
				<View>
					<Label nativeID="Username">Username</Label>
					<Input
						value={username}
						onChangeText={setUsername}
						autoComplete="username"
						placeholder="Username"
					/>
				</View>
				<View>
					<Label nativeID="Password">Password</Label>
					<Input
						value={password}
						onChangeText={setPassword}
						autoComplete="current-password"
						secureTextEntry={true}
						placeholder="Password"
					/>
				</View>
				<Pressable onPress={handleLogin} className="w-full p-4 bg-foreground">
					<Text className="font-bold text-center text-background">Login</Text>
				</Pressable>
				{error && <Text className="text-center text-red-500">{error}</Text>}
			</View>
		</View>
	);
}