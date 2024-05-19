import type { RunnableToolFunction } from "openai/lib/RunnableFunction.mjs";

import type { LLMTool } from "../types";

interface Props {
	query: string;
	url: string;
}

async function fetcherTool({ query, url }: Props) {
	return "search query: " + JSON.stringify({ query, url }, null, 2);
}

const runnableFetch: RunnableToolFunction<Props> = {
	type: "function",
	function: {
		name: "fetcher",
		parse: JSON.parse,
		function: fetcherTool,
		description: "Sends a GET request to the specified URL and returns the response",
		parameters: {
			type: "object",
			properties: { query: { type: "string", description: "The search query" } },
		},
	},
};

export const Fetch: LLMTool<Props> = {
	runnable: runnableFetch,
	tool: fetcherTool,
};
