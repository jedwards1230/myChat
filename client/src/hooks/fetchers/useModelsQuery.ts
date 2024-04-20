import { queryOptions, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/lib/fetcher";
import { ModelInformation } from "@/types";

export const modelQueryOptions = queryOptions({
    queryKey: ["models"],
    queryFn: () => fetcher<ModelInformation[]>("/models"),
});

export const useModelsQuery = () => useQuery(modelQueryOptions);
