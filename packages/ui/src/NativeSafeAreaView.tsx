import { SafeAreaView } from "react-native";

import { withNativeOnly } from "../../../apps/native/src/lib/withNativeOnly";

const NativeSafeAreaView = withNativeOnly(SafeAreaView);

export default NativeSafeAreaView;
