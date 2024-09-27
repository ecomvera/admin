import { fetcher, fetchOpt } from "@/lib/utils";
import { useGroupCategoryStore } from "@/stores/groupCategory";
import { set } from "lodash";
import { useEffect } from "react";
import useSWR from "swr";

export const useGroupCategories = () => {
  const { groupCategories, setGroupCategories } = useGroupCategoryStore();
  const {
    data,
    mutate,
    isLoading: fetchingGroupCategories,
  } = useSWR(groupCategories.length === 0 ? "/api/categories/group" : null, fetcher, fetchOpt);

  useEffect(() => {
    if (data?.data && !groupCategories.length) {
      setGroupCategories(data.data || []);
    }
  }, [data, mutate, setGroupCategories]);
  return { groupCategories, fetchingGroupCategories };
};
