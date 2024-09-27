import { fetcher, fetchOpt } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { useEffect } from "react";
import useSWR from "swr";

export const useAttributes = () => {
  const { attributes: items, setAttributes } = useEnumsStore();
  const {
    data,
    mutate,
    isLoading: fetchingAttributes,
  } = useSWR(items.length === 0 ? "/api/attributes" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !items.length) {
      setAttributes(data.data || []);
    }
  }, [data, mutate, setAttributes]);
  return { attributes: items, fetchingAttributes };
};
