import { expect, test } from "bun:test";

import { buildApp } from "./app";

test('requests the "/" route', async () => {
	const app = await buildApp();

	const response = await app.inject({
		method: "GET",
		url: "/",
	});

	expect(response.statusCode).toEqual(200);
});
