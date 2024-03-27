import { cssInterop } from "nativewind";
import {
	FontAwesome,
	FontAwesome6,
	MaterialIcons,
	AntDesign,
	Entypo,
	Octicons,
	Ionicons,
} from "@expo/vector-icons";

cssInterop(FontAwesome, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(FontAwesome6, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(MaterialIcons, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(AntDesign, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(Entypo, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(Octicons, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

cssInterop(Ionicons, {
	className: {
		target: "style",
		nativeStyleToProp: {
			color: true,
		},
	},
});

export {
	FontAwesome,
	FontAwesome6,
	MaterialIcons,
	AntDesign,
	Entypo,
	Octicons,
	Ionicons,
};
