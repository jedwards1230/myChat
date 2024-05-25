import { useState } from "react";

export function useHoverHelper() {
	const [isHover, setIsHover] = useState(false);
	return {
		isHover,
		onHoverIn: () => setIsHover(true),
		onHoverOut: () => setIsHover(false),
		onPressIn: () => setIsHover(true),
		onPressOut: () => setIsHover(false),
	};
}
