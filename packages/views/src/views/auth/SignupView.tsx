import { View } from "react-native";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import type { CreateUser } from "@mychat/db/schema";
import { api } from "@mychat/api/client/react-query";
import { CreateUserSchema } from "@mychat/db/schema";

import { Input } from "~/native/Input";
import { Label } from "~/native/Label";
import { Text } from "~/native/Text";
import { AuthButton } from "./AuthButton";
import { AuthFormWrapper, ErrorMessage, parseError } from "./AuthFormWrapper";

export function SignUpView() {
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

	const { mutateAsync: signup } = api.user.create.useMutation();
	const { mutateAsync: login } = api.user.login.useMutation();

	const handleSignup = async () => {
		const opts = { email: watch("email"), password: watch("password") };
		try {
			await signup(opts);
			await login(opts);
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
					href="/(auth)/login"
				>
					<Text className="text-sm hover:underline">Login</Text>
				</Link>
				<Text className="text-center text-xl font-semibold">Sign Up</Text>
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
			<AuthButton onPress={handleSubmit(handleSignup)}>Sign Up</AuthButton>
			{errors.root && errors.root.message ? (
				<ErrorMessage>{errors.root.message}</ErrorMessage>
			) : null}
		</AuthFormWrapper>
	);
}
