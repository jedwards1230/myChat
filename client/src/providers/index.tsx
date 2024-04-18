import { AppStateProvider } from "@/providers/AppStateProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { PlatformProviders } from "./PlatformProviders";
import { ToastProvider } from "./ToastProvider";

export const Providers = (props: { children: React.ReactNode }) => (
	<ThemeProvider>
		<ToastProvider>
			<QueryClientProvider>
				<PlatformProviders>
					<AppStateProvider>{props.children}</AppStateProvider>
				</PlatformProviders>
			</QueryClientProvider>
		</ToastProvider>
	</ThemeProvider>
);
