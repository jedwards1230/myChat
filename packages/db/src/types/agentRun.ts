import type { InferQueryModel } from "./utils";

const RunForProcessingMessageOpts = {
	with: {
		//parent: true,
		//children: true,
		documents: true,
		files: true,
		toolCall: true,
	},
} as const;

export const RunForProcessingRelations = {
	agent: true,
	files: true,
	thread: {
		with: {
			activeMessage: RunForProcessingMessageOpts,
			agent: true,
			messages: RunForProcessingMessageOpts,
		},
	},
} as const;
export type RunForProcessing = InferQueryModel<
	"AgentRun",
	{
		model: true;
		status: true;
		type: true;
		stream: true;
		createdAt: true;
	},
	typeof RunForProcessingRelations
>;
