import type { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { chromium } from "playwright";

import type { LLMTool } from "../types";
import type { Message } from "@/modules/Message/MessageModel";

type MClickProps = { ids: string[] };
type MClickResult = { url: string; content: string };

const mclick: LLMTool<MClickProps>["tool"] = async ({ ids }, runner) => {
	// get tool_calls from last asst message
	const asstMsg = runner.messages
		.filter(
			(m) =>
				m.role === "assistant" &&
				m.tool_calls &&
				m.tool_calls.find((tc) => tc.function?.name === "search")
		)
		.pop() as Message;
	if (!asstMsg || !asstMsg.tool_calls) throw new Error("No assistant message found");

	// get the last search tool call
	const toolCalls = asstMsg.tool_calls
		.filter((tc) => tc.function?.name === "search")
		.pop();
	if (!toolCalls) throw new Error("No tool calls found");

	const searchResultsMsg = runner.messages.find(
		(m) => m.role === "tool" && m.tool_call_id === toolCalls.id
	);
	if (
		!searchResultsMsg ||
		!searchResultsMsg.content ||
		typeof searchResultsMsg.content !== "string"
	)
		throw new Error("No search results found");

	const searchResults: SearchResult[] = JSON.parse(searchResultsMsg.content);
	const requestedResults = ids.map((id) => searchResults[parseInt(id)]);

	const browser = await chromium.launch({ headless: true });
	const results: MClickResult[] = await Promise.all(
		requestedResults.map(async ({ url }) => {
			const page = await browser.newPage();
			await page.goto(url);

			// remove scripts, styles, and noscripts
			await page.evaluate(() => {
				const elements = document.querySelectorAll("script, style, noscript");
				elements.forEach((el) => el.remove());
			});

			const content = await page.$eval("body", (body) => body.textContent || "");
			await page.close();
			return {
				url,
				content: content.replace(/\s+/g, " ").replace(/Header:.*?Footer:/s, ""),
			};
		})
	);

	await browser.close();

	return JSON.stringify(results);
};

const runnableMclick: RunnableToolFunction<MClickProps> = {
	type: "function",
	function: {
		name: "mclick",
		description: "Retrieves the contents of the webpages with provided IDs (indices)",
		parameters: {
			type: "object",
			properties: {
				ids: {
					type: "array",
					items: { type: "string" },
				},
			},
		},
		function: mclick,
		parse: JSON.parse,
	},
};

export const Mclick: LLMTool<MClickProps> = {
	runnable: runnableMclick,
	tool: mclick,
};
