import { useWindowDimensions } from "react-native";

const BreakPoints = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
} as const;

export function useBreakpoints() {
	const windowDimensions = useWindowDimensions();
	const breakpoints: Record<string, boolean> = {};

	Object.keys(BreakPoints).forEach((key) => {
		const k = key as keyof typeof BreakPoints;
		breakpoints[key] = windowDimensions.width >= BreakPoints[k];
	});

	return breakpoints;
}
