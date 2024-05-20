import type { InferQueryModel } from "./utils";

const MessageFileOpts = {
	fileData: true,
} as const;

export type GetMessageFile = InferQueryModel<
	"MessageFile",
	{
		name: true;
		path: true;
		lastModified: true;
		tokenCount: true;
		messageId: true;
		uploadDate: true;
		size: true;
		mimetype: true;
		extension: true;
		parsedText: true;
	},
	typeof MessageFileOpts
>;
