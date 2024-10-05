import { Link } from "expo-router";
import { View } from "react-native";

import { Icon } from "@/components/ui/Icon";
import { useConfigStore } from "@/hooks/stores/configStore";

export default function RightButton() {
    const { threadId } = useConfigStore();
    if (!threadId) return <View />;
    return (
        <Link className="absolute z-10 top-3 right-4" disabled={!threadId} href="/(app)">
            <Icon type="MaterialIcons" name="open-in-new" size={24} />
        </Link>
    );
}
