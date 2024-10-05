import { SafeAreaView } from "react-native";

import { withNativeOnly } from "../lib/withNativeOnly";

const NativeSafeAreaView = withNativeOnly(SafeAreaView);

export default NativeSafeAreaView;
