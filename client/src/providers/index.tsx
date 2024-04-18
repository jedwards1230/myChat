import { AppStateProvider } from "@/providers/AppStateProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClientProvider } from "@/providers/QueryClientProvider";
import { PlatformProviders } from "./PlatformProviders";

export const Providers = (props: { children: React.ReactNode }) => (
	<ThemeProvider>
		<QueryClientProvider>
			<PlatformProviders>
				<AppStateProvider>{props.children}</AppStateProvider>
			</PlatformProviders>
		</QueryClientProvider>
	</ThemeProvider>
);
