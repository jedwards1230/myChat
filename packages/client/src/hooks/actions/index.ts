import * as actionFunctions from "./actions";
export * from "./actions";

const Actions = actionFunctions;

export type ActionMap = typeof Actions;
export type Command = keyof ActionMap;
export type UIAction = ReturnType<ActionMap[keyof ActionMap]>;

export const ActionList: Command[] = Object.keys(Actions) as Command[];

export * from "./useActions";
