import { HotkeyProvider } from "@/providers/HotkeyProvider";

export function PlatformProviders(props: { children: React.ReactNode }) {
	return <HotkeyProvider>{props.children}</HotkeyProvider>;
}
