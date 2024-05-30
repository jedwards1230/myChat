import type { Rules } from "@mychat/shared/lib/markdown-display/markdown.web";

export const getMarkdownRules = (colorScheme: "light" | "dark"): Rules => ({
	p: ({ node, ...props }) => {
		console.log({ colorScheme, node });
		return <p {...props} className="text-neutral-700 dark:text-neutral-300" />;
	},
});
