import * as Network from "expo-network";
import * as SystemUI from "expo-system-ui";
import * as Application from "expo-application";
import { useEffect, useState } from "react";
import { ColorValue, Platform, View } from "react-native";

import { RowItem, Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { BASE_HOST } from "@/lib/fetcher";

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
