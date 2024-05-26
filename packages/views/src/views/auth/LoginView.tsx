import { View } from "react-native";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { CreateUser } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { CreateUserSchema } from "@mychat/db/schema";
import { Input } from "@mychat/ui/native/Input";
import { Label } from "@mychat/ui/native/Label";
import { Text } from "@mychat/ui/native/Text";

import { AuthButton } from "./AuthButton";
import { AuthFormWrapper, ErrorMessage, parseError } from "./AuthFormWrapper";

export function LoginView() {
	const {
		control,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm<CreateUser>({
		resolver: zodResolver(CreateUserSchema),
		defaultValues: { email: "", password: "" },
	});
	const { mutateAsync: login } = api.user.login.useMutation();
	const handleLogin = async () => {
		try {
			await login({ email: watch("email"), password: watch("password") });
		} catch (error) {
			parseError(error, setError);
		}
	};

	return (
		<AuthFormWrapper>
			<View className="relative">
				<Link
					asChild
					replace
					className="absolute left-0 z-10"
					href="/(auth)/signup"
				>
					<Text className="text-sm hover:underline">Sign Up</Text>
				</Link>
				<Text className="text-center text-xl font-semibold">Login</Text>
			</View>
			<View className="flex gap-1">
				<Label id="Email">Email</Label>
				<Controller
					control={control}
					name="email"
					rules={{ required: true }}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							placeholder="Email"
							onBlur={onBlur}
							autoComplete="email"
							onChangeText={onChange}
							value={value}
						/>
					)}
				/>
				{errors.email?.message && (
					<ErrorMessage>{errors.email.message}</ErrorMessage>
				)}
			</View>
			<View className="flex gap-1">
				<Label id="Password">Password</Label>
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
				{errors.password?.message && (
					<ErrorMessage>{errors.password.message}</ErrorMessage>
				)}
			</View>
			<AuthButton onPress={handleSubmit(handleLogin)}>Login</AuthButton>
			{errors.root && errors.root.message ? (
				<ErrorMessage>{errors.root.message}</ErrorMessage>
			) : null}
		</AuthFormWrapper>
	);
}
