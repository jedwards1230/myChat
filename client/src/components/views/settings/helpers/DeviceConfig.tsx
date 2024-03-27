import * as Network from "expo-network";
import * as SystemUI from "expo-system-ui";
import { useEffect, useState } from "react";
import { ColorValue, View } from "react-native";

import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";

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
		<View className="flex flex-col w-full gap-2 web:gap-4">
			<Section title="IP Address">
				<RowItem>
					<Text>IP Address</Text>
					<Text>{ip}</Text>
				</RowItem>
			</Section>
			<Section title="Network State">
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
