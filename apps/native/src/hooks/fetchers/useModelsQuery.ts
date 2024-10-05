import { fetcher } from "@/lib/fetcher";
import { queryOptions, useQuery } from "@tanstack/react-query";

import type { ModelApi } from "@mychat/shared/schemas/models";

export const modelQueryOptions = queryOptions({
	queryKey: ["models"],
	queryFn: () => fetcher<ModelApi[]>("/models"),
});

export const useModelsQuery = () => useQuery(modelQueryOptions);
