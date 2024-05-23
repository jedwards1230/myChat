import type { ColorValue } from "react-native";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import * as Application from "expo-application";
import * as Network from "expo-network";
import * as SystemUI from "expo-system-ui";
import { BASE_HOST } from "@/lib/fetcher";

import { RowItem, Section } from "@mychat/ui/native/Section";
import { Text } from "@mychat/ui/native/Text";

export function DeviceConfig() {
	const [mounted, setMounted] = useState(false);
	const [ip, setIp] = useState<any>();
	const [netState, setNetState] = useState<any>();
	const [backgroundColor, setBackgroundColor] = useState<ColorValue | null>(null);

	const getIps = () => Network.getIpAddressAsync();
	const getNetState = () => Network.getNetworkStateAsync();
	const getBackgroundColor = () => SystemUI.getBackgroundColorAsync();

	useEffect(() => {
		getIps().then((ip) => setIp(ip));
		getNetState().then((state) => setNetState(state));
		getBackgroundColor().then((color) => setBackgroundColor(color));
	}, [mounted]);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<View className="web:gap-4 flex w-full flex-col gap-2">
			{Platform.OS !== "web" && (
				<Section title="App">
					<RowItem>
						<Text>Application Id</Text>
						<Text>{Application.applicationId}</Text>
					</RowItem>
					<RowItem>
						<Text>Application Name</Text>
						<Text>{Application.applicationName}</Text>
					</RowItem>
					<RowItem>
						<Text>Native Application Version</Text>
						<Text>{Application.nativeApplicationVersion}</Text>
					</RowItem>
					<RowItem>
						<Text>Native Build Version</Text>
						<Text>{Application.nativeBuildVersion}</Text>
					</RowItem>
				</Section>
			)}
			<Section title="Network">
				<RowItem>
					<Text>Server Host</Text>
					<Text>{BASE_HOST}</Text>
				</RowItem>
				<RowItem>
					<Text>IP Address</Text>
					<Text>{ip}</Text>
				</RowItem>
				<RowItem>
					<Text>Type</Text>
					<Text>{netState?.type}</Text>
				</RowItem>
				<RowItem>
					<Text>isConnected</Text>
					<Text>{netState?.isConnected}</Text>
				</RowItem>
			</Section>
			<Section title="System UI">
				<RowItem>
					<Text>Background Color</Text>
					<Text>{JSON.stringify(backgroundColor)}</Text>
				</RowItem>
			</Section>
		</View>
	);
}
