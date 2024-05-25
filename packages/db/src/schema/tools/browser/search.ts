import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";
import { chromium } from "playwright";

import type { LLMTool } from "../types";

interface SearchProps {
	query: string;
	recency_days: number;
}
interface SearchResult {
	title?: string;
	url: string;
	index: number;
}

const search: LLMTool<SearchProps>["tool"] = async ({ query, recency_days = 0 }) => {
	const browser = await chromium.launch({ headless: true });
	const page = await browser.newPage();

	await page.goto(
		`https://www.google.com/search?q=${encodeURIComponent(
			query,
		)}&tbs=qdr:${recency_days}d`,
	);

	// Assuming the search results are in a div with class 'g'
	const searchResults: SearchResult[] = await page.$$eval(
		".g",
		(nodes) =>
			nodes
				.map((n, index) => {
					const title = n.querySelector("h3")?.innerText;
					const url = n.querySelector("a")?.href;
					if (!url) return null;
					return { title, url, index };
				})
				.filter((result) => result !== null) as SearchResult[],
	);

	await browser.close();
	return JSON.stringify(searchResults);
};

const runnableSearchWeb: RunnableToolFunction<SearchProps> = {
	type: "function",
	function: {
		name: "search",
		description: "Issues a query to a search engine and displays the results",
		parameters: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "The search query",
				},
				recency_days: {
					type: "number",
					description:
						"The number of days in the past to restrict the search to",
					default: 0,
				},
			},
		},
		function: search,
		parse: JSON.parse,
	},
};

const Search: LLMTool<SearchProps> = {
	runnable: runnableSearchWeb,
	tool: search,
};

export type { SearchProps, SearchResult };
export { Search };
