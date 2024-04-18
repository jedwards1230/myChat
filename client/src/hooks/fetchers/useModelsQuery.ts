import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { ModelInformation } from "@/types";

export const modelQueryOptions = queryOptions({
	queryKey: ["models"],
	queryFn: () => fetcher<ModelInformation[]>("/models"),
	retryOnMount: true,
});

export const useModelsQuery = () => useQuery(modelQueryOptions);
