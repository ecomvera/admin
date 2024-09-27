import { fetcher, fetchOpt } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { useEffect } from "react";
import useSWR from "swr";

export const useEnums = () => {
  const { attributes, setAttributes, setsizes, sizes, colors, setColors } = useEnumsStore();
  const { mutate: fetchEnums, isLoading: fetchEnumsLoading } = useSWR("/api/enum", fetcher, fetchOpt);

  console.log(sizes.length, attributes.length, colors.length);

  useEffect(() => {
    const fetch = async () => {
      if (!sizes.length && !colors.length && !attributes.length) {
        console.log("calling enum");
        const res = await fetchEnums();
        setAttributes(res?.data?.attributes || []);
        setsizes(res?.data?.sizes || []);
        setColors(res?.data?.colors || []);
      }
    };
    fetch();
  }, []);
  return { attributes, colors, sizes, fetchEnumsLoading };
};
