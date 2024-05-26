import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPencil = (props: SvgProps) => <Svg width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="pencil_svg__feather pencil_svg__feather-edit-2" viewBox="0 0 24 24" {...props}><Path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z" /></Svg>;
export default SvgPencil;