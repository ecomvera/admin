import { fetcher, fetchOpt } from "@/lib/utils";
import { useGroupCategoryStore } from "@/stores/groupCategory";
import { useEffect } from "react";
import useSWR from "swr";

export const useGroupCategories = () => {
  const { groupCategories, setGroupCategories } = useGroupCategoryStore();
  const { mutate: fetchGroupCategories } = useSWR("/api/categories/group", fetcher, fetchOpt);

  useEffect(() => {
    const fetch = async () => {
      if (!groupCategories.length) {
        const res = await fetchGroupCategories();
        setGroupCategories(res?.data || []);
      }
    };
    fetch();
  }, []);
  return { groupCategories, fetchGroupCategories };
};
