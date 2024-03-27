import { Platform } from "react-native";
import colors from "tailwindcss/colors";

// this is converted to a stylesheet internally at run time with StyleSheet.create(
const lightStyles = {
	// The main container
	body: { fontSize: 14 },

	// Headings
	heading1: {
		flexDirection: "row",
		fontSize: 32,
	},
	heading2: {
		flexDirection: "row",
		fontSize: 28,
	},
	heading3: {
		flexDirection: "row",
		fontSize: 24,
	},
	heading4: {
		flexDirection: "row",
		fontSize: 20,
	},
	heading5: {
		flexDirection: "row",
		fontSize: 18,
	},
	heading6: {
		flexDirection: "row",
		fontSize: 16,
	},

	// Horizontal Rule
	hr: {
		backgroundColor: colors.gray[950],
		height: 1,
	},

	// Emphasis
	strong: {
		fontWeight: "bold",
	},
	em: {
		fontStyle: "italic",
	},
	s: {
		textDecorationLine: "line-through",
	},

	// Blockquotes
	blockquote: {
		backgroundColor: colors.gray[50],
		borderColor: colors.gray[300],
		borderLeftWidth: 4,
		marginLeft: 5,
		paddingHorizontal: 5,
	},

	// Lists
	bullet_list: {},
	ordered_list: {},
	list_item: {
		flexDirection: "row",
		justifyContent: "flex-start",
	},
	// @pseudo class, does not have a unique render rule
	bullet_list_icon: {
		marginLeft: 10,
		marginRight: 10,
	},
	// @pseudo class, does not have a unique render rule
	bullet_list_content: {
		flex: 1,
	},
	// @pseudo class, does not have a unique render rule
	ordered_list_icon: {
		marginLeft: 10,
		marginRight: 10,
	},
	// @pseudo class, does not have a unique render rule
	ordered_list_content: {
		flex: 1,
	},

	// Code
	code_inline: {
		borderWidth: 1,
		borderColor: colors.gray[300],
		backgroundColor: colors.gray[50],
		padding: 10,
		borderRadius: 4,
		...Platform.select({
			["ios"]: {
				fontFamily: "Courier",
			},
			["android"]: {
				fontFamily: "monospace",
			},
		}),
	},
	code_block: {
		borderWidth: 1,
		borderColor: colors.gray[300],
		backgroundColor: colors.gray[50],
		padding: 10,
		borderRadius: 4,
		...Platform.select({
			["ios"]: {
				fontFamily: "Courier",
			},
			["android"]: {
				fontFamily: "monospace",
			},
		}),
	},
	fence: {
		borderWidth: 1,
		borderColor: colors.gray[300],
		backgroundColor: colors.gray[50],
		padding: 10,
		borderRadius: 4,
		...Platform.select({
			["ios"]: {
				fontFamily: "Courier",
			},
			["android"]: {
				fontFamily: "monospace",
			},
		}),
	},

	// Tables
	table: {
		borderWidth: 1,
		borderColor: colors.black,
		borderRadius: 3,
	},
	thead: {},
	tbody: {},
	th: {
		flex: 1,
		padding: 5,
	},
	tr: {
		borderBottomWidth: 1,
		borderColor: colors.black,
		flexDirection: "row",
	},
	td: {
		flex: 1,
		padding: 5,
	},

	// Links
	link: {
		textDecorationLine: "underline",
	},
	blocklink: {
		flex: 1,
		borderColor: colors.gray[300],
		borderBottomWidth: 1,
	},

	// Images
	image: {
		flex: 1,
	},

	// Text Output
	text: {
		color: colors.black,
	},
	textgroup: {},
	paragraph: {
		marginTop: 10,
		marginBottom: 10,
		flexWrap: "wrap",
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "flex-start",
		width: "100%",
	},
	hardbreak: {
		width: "100%",
		height: 1,
	},
	softbreak: {},

	// Believe these are never used but retained for completeness
	pre: {},
	inline: {},
	span: {},
} as const;

// dark styles
const darkStyles = {
	...lightStyles,
	text: {
		...lightStyles.text,
		color: colors.gray[300],
	},
	// Code
	code_inline: {
		...lightStyles.code_inline,
		color: colors.gray[300],
		borderColor: colors.gray[700],
		backgroundColor: colors.gray[950],
	},
	code_block: {
		...lightStyles.code_block,
		color: colors.gray[300],
		borderColor: colors.gray[700],
		backgroundColor: colors.gray[950],
	},
	fence: {
		...lightStyles.fence,
		color: colors.gray[300],
		borderColor: colors.gray[700],
		backgroundColor: colors.gray[950],
	},
} as const;

export default {
	light: lightStyles,
	dark: darkStyles,
} as const;
