import type { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { chromium } from "playwright";

import type { LLMTool } from "../types";

type OpenUrlProps = { url: string };
type OpenUrlResult = { url: string; title: string; contentPreview: string };

const openUrl: LLMTool<OpenUrlProps>["tool"] = async ({ url }) => {
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(url);

	// You might want to capture the title and a content preview
	const title = await page.title();
	const contentPreview = await page.evaluate(() => {
		// Get the first paragraph's text content as a simple content preview
		const firstParagraph = document.querySelector("p");
		return firstParagraph
			? firstParagraph.textContent?.trim().substring(0, 100) + "..."
			: "No content preview available.";
	});

	await browser.close();

	const res: OpenUrlResult = { url, title, contentPreview };

	return JSON.stringify(res);
};

const runnableOpenUrl: RunnableToolFunction<OpenUrlProps> = {
	type: "function",
	function: {
		name: "open_url",
		description: "Opens the given URL and displays it",
		parameters: {
			type: "object",
			properties: {
				url: {
					type: "string",
				},
			},
		},
		function: openUrl,
		parse: JSON.parse,
	},
};

export const OpenUrl: LLMTool<OpenUrlProps> = {
	runnable: runnableOpenUrl,
	tool: openUrl,
};
