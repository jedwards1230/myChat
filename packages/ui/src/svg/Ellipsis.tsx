import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEllipsis = (props: SvgProps) => <Svg viewBox="0 0 448 512" width={24} height={24} {...props}><Path d="M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" /></Svg>;
export default SvgEllipsis;