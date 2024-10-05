import * as Haptics from "expo-haptics";

export const emitFeedback = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
