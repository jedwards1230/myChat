import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

import { PlatformProviders } from "./PlatformProviders";
import { ToastProvider } from "./ToastProvider";

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
