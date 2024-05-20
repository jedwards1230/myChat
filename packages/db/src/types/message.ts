import type { InferQueryModel } from "./utils";

const MessageOpts = {
	parent: true,
	children: true,
	toolCall: true,
	files: true,
} as const;

export type GetMessage = InferQueryModel<
	"Message",
	{
		id: true;
		name: true;
		content: true;
		role: true;
		createdAt: true;
		tokenCount: true;
	},
	typeof MessageOpts
>;
