import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AuthButton } from "./AuthButton";
import { AuthViewWrapper } from "./AuthViewWrapper";
import { useUserData } from "@/hooks/stores/useUserData";
import { AuthInput } from "@/types/schemas";
import { FetchError } from "@/lib/fetcher";
import { AuthFormWrapper, ErrorMessage } from "./AuthFormWrapper";
import { Link } from "expo-router";

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
			if (error instanceof FetchError) {
				const message =
					error.res instanceof Response
						? await error.res.text()
						: error.res.response;
				setError("root", { type: "manual", message });
			} else {
				console.warn(error);
				setError("root", { type: "manual", message: JSON.stringify(error) });
			}
		}
	};

	return (
		<AuthViewWrapper>
			<AuthFormWrapper>
				<View className="relative">
					<Link className="absolute left-0 z-10" href="/(auth)/signup">
						<Text className="text-sm hover:underline">Sign Up</Text>
					</Link>
					<Text className="text-xl font-semibold text-center">Login</Text>
				</View>
				<View className="flex gap-1">
					<Label nativeID="Email">Email</Label>
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
					{errors.email && errors.email.message && (
						<ErrorMessage>{errors.email.message}</ErrorMessage>
					)}
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
					{errors.password && errors.password.message && (
						<ErrorMessage>{errors.password.message}</ErrorMessage>
					)}
				</View>
				<AuthButton onPress={handleSubmit(handleLogin)}>Login</AuthButton>
				{errors.root ? (
					<ErrorMessage>{JSON.stringify(errors.root, null, 2)}</ErrorMessage>
				) : null}
			</AuthFormWrapper>
		</AuthViewWrapper>
	);
}
