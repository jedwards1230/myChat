import { Browser } from "./browser";
import { Fetcher } from "./fetcher";
import type { ToolConfig } from "./types";
export * from "./types";

export const Tools = [Browser, Fetcher] as const satisfies ToolConfig[];
export type Tools = typeof Tools;

export type ToolConfigs = {
	[K in (typeof Tools)[number]["name"]]: (typeof Tools)[number];
};

// union of all toolconfigs
export type ToolConfigUnion = ToolConfigs[keyof ToolConfigs];

export type ToolName = Tools[number]["name"];
export const ToolNames = Tools.map((t) => t.name);

export type ToolsMap = {
	[K in (typeof Tools)[number]["name"]]: (typeof Tools)[number];
};
export const ToolsMap = Object.fromEntries(Tools.map((t) => [t.name, t])) as ToolsMap;
