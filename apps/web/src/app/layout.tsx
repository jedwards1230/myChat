import "raf/polyfill";
import "setimmediate";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { TRPCReactProvider } from "../trpc/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "myChat",
	description: "Generated by create next app",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<TRPCReactProvider>{children}</TRPCReactProvider>
			</body>
		</html>
	);
}
