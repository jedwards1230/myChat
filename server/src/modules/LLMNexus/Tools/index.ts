import { Browser } from "./browser/browser";
import type { ToolConfig } from "./types";
export * from "./types";

export const Tools = [Browser] as const satisfies ToolConfig[];
export type Tools = typeof Tools;
export type ToolType = keyof Tools;

export type ToolsMap = {
	[K in (typeof Tools)[number]["name"]]: (typeof Tools)[number];
};
export const ToolsMap = Object.fromEntries(Tools.map((t) => [t.name, t])) as ToolsMap;

export const ToolNames = Tools.map((t) => t.name);
export type ToolName = (typeof ToolNames)[number];
