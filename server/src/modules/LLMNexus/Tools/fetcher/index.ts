import type { ToolConfig } from "../types";
import { Fetch } from "./fetch";

const systemMessage = `## fetcher

You have the tool 'fetcher'. Use 'fetcher' in the following circumstances:
    - The conversation requires you to retrieve information from an API tool
    `;

// clean the quotes and such for a postgres insert with typeorm. getting an error with the quotes
export const cleanedSystemMessage = systemMessage.replace(/'/g, "''");

const tools = [Fetch];

export const Fetcher = {
	name: "Fetcher",
	tools,
	description:
		"Use the browser tool to search the web, retrieve webpages, and open URLs",
	systemMessage: cleanedSystemMessage,
	getTools: () => tools.map((t) => t.runnable),
} as const satisfies ToolConfig<typeof tools>;
