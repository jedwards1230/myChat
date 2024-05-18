import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import type { ModelApi } from "@mychat/shared/schemas/models";

export const modelQueryOptions = queryOptions({
	queryKey: ["models"],
	queryFn: () => fetcher<ModelApi[]>("/models"),
});

export const useModelsQuery = () => useQuery(modelQueryOptions);
