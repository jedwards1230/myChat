"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import SuperJSON from "superjson";

import { api } from "@mychat/api/client/react-query";

import env from "../env";

const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				// With SSR, we usually want to set some default staleTime
				// above 0 to avoid refetching immediately on the client
				staleTime: 30 * 1000,
			},
		},
	});

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
	} else {
		// Browser: use singleton pattern to keep the same query client
		return (clientQueryClientSingleton ??= createQueryClient());
	}
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				loggerLink({
					enabled: (op) =>
						env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					transformer: SuperJSON,
					url: getBaseUrl() + "/api/trpc",
					headers() {
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						return headers;
					},
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}

const getBaseUrl = () => {
	if (typeof window !== "undefined") return window.location.origin;
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;

	return `http://localhost:${process.env.PORT ?? 3000}`;
};
