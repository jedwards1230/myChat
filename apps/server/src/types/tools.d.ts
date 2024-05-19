type Tool = "calculator" | "search" | "web-browser" | "wikipedia-api";

type Command = "/calculator" | "/search" | "/scrape" | "/wiki";

interface CustomTool {
	name: Tool;
	description: string;
	parameters: {
		type: string;
		required: string[];
		properties: Record<
			string,
			{
				description: string;
				type: string;
			}
		>;
	};
}

interface ToolInput {
	name: Tool;
	args: any;
}

type CommandList = Record<Command, ToolInput>;
