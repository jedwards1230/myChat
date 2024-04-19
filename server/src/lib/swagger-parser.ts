import OpenAPIParser from "@readme/openapi-parser";

import logger from "@/lib/logs/logger";
import type { OpenAPI, OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

const sample = "https://apitools.dev/swagger-parser/online/sample/swagger.yaml";
const sample1 =
	"https://raw.githubusercontent.com/openai/openai-openapi/master/openapi.yaml";

function isOAI3(
	spec: OpenAPI.Document<{}>
): spec is OpenAPIV3.Document | OpenAPIV3_1.Document {
	return "openapi" in spec;
}

async function validateSpec(url: string) {
	try {
		const res = await OpenAPIParser.dereference(url);
		if (isOAI3(res)) {
			parseOAI3(res);
		} else {
			res;
			parseOAI2(res);
		}
	} catch (e: any) {
		if (e.name === "ResolverError") {
			return logger.debug("failed to parse api", { e });
		}
		logger.error("failed to parse api", { e });
		throw e;
	}
}

function parseOAI3(spec: OpenAPIV3.Document | OpenAPIV3_1.Document) {
	logger.debug("openapi 3", {
		...spec,
		paths: undefined,
		components: undefined,
		"x-oaiMeta": undefined,
		security: undefined,
		tags: undefined,
	});
	const paths = spec.paths!;
	for (const [path, value] of Object.entries(spec.paths!)) {
		const methods = paths[path];
		logger.debug("Found path", {
			path,
			//value,
		});
		/* for (const method of Object.keys(methods)) {
			const data = methods[method];
			logger.debug("parsed", {
				path,
				method,
				data,
			});
		} */
	}
}

function parseOAI2(spec: OpenAPIV2.Document) {
	//logger.debug("openapi 2", spec);
	const paths = parsePaths(spec.paths!);
}

function parsePaths(paths: OpenAPIV2.PathsObject<{}>) {
	const pathMap = {} as Record<string, any>;
	for (const [path, value] of Object.entries(paths)) {
		if (!pathMap[path]) pathMap[path] = [];
		pathMap[path].push(Object.keys(value));
		//const methods = paths[path];

		/* for (const method of Object.keys(methods)) {
			const data = methods[method];
			logger.debug("parsed", {
				path,
				method,
				data,
			});
		} */
	}
	logger.debug("Found paths", pathMap);
}

validateSpec(sample);
