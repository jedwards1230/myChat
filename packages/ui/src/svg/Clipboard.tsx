import Svg, { Path, Rect } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClipboard = (props: SvgProps) => <Svg width={24} height={24} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="clipboard_svg__feather clipboard_svg__feather-clipboard" viewBox="0 0 24 24" {...props}><Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><Rect width={8} height={4} x={8} y={2} rx={1} ry={1} /></Svg>;
export default SvgClipboard;