import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { ToastProvider } from "@mychat/ui/providers/ToastProvider";

import { PlatformProviders } from "./PlatformProviders";

export const Providers = (props: { children: React.ReactNode }) => (
	<ThemeProvider>
		<ToastProvider>
			<QueryClientProvider>
				<PlatformProviders>
					<AuthProvider>{props.children}</AuthProvider>
				</PlatformProviders>
			</QueryClientProvider>
		</ToastProvider>
	</ThemeProvider>
);
