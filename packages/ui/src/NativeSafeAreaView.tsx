import { SafeAreaView } from "react-native";

import { withNativeOnly } from "./withNativeOnly";

const NativeSafeAreaView = withNativeOnly(SafeAreaView);

export default NativeSafeAreaView;
