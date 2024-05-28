import queryClient from "./query-client";
import { QueryKey, QueryFunction } from "@tanstack/react-query";

type PrefetchOptions<TQueryFnData, TData> = {
  queryKey: QueryKey;
  queryFn: QueryFunction<TQueryFnData, QueryKey, never>;
  options?: {
    data?: TData;
  };
};

const UsePrefetchQuery = <TQueryFnData = unknown, TData = TQueryFnData>({
  queryKey,
  queryFn,
  options,
}: PrefetchOptions<TQueryFnData, TData>) => {
  queryClient.ensureQueryData({
    queryKey,
    queryFn,
    ...options,
  });
};

export default UsePrefetchQuery;
