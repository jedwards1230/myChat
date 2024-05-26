import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgInfo = (props: SvgProps) => <Svg viewBox="0 0 192 512" width={24} height={24} {...props}><Path d="M48 80a48 48 0 1 1 96 0 48 48 0 1 1-96 0M0 224c0-17.7 14.3-32 32-32h64c17.7 0 32 14.3 32 32v224h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h32V256H32c-17.7 0-32-14.3-32-32" /></Svg>;
export default SvgInfo;