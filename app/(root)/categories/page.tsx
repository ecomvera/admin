"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category";
import GroupCategory from "@/components/shared/GroupCategory";
import { useGroupCategoryStore } from "@/stores/groupCategory";
// import Attributes from "@/components/shared/Attributes";
// import { useAttributeStore } from "@/stores/attribute";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ListCollections from "@/components/shared/ListCollections";

const Page = () => {
  const { categories, setCategories } = useCategoryStore();
  const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);
  const { groupCategories, setGroupCategories } = useGroupCategoryStore();
  const { mutate: fetchGroupCategories, isLoading: fetchGroupCategoriesLoading } = useSWR(
    "/api/categories/group",
    fetcher,
    fetchOpt
  );
  // const { attributes, setAttributes } = useAttributeStore();
  // const { mutate: fetchAttributes, isLoading: fetchAttriburesLoading } = useSWR("/api/attributes", fetcher, fetchOpt);

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
      if (!groupCategories.length) {
        const res = await fetchGroupCategories();
        setGroupCategories(res?.data || []);
      }
      // if (!attributes.length) {
      //   const res = await fetchAttributes();
      //   setAttributes(res?.data || []);
      // }
    };
    fetch();
  }, []);

  return (
    <div className="flex py-3 flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        {/* <Attributes attributes={attributes || []} /> */}

        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Add Category</h2>
            </AccordionTrigger>
            <AccordionContent>
              <CategoryTabs parentCategories={categories || []} isLoading={fetchCategoriesLoading} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Create a collection</h2>
            </AccordionTrigger>
            <AccordionContent>
              <GroupCategory />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Create an attribute</h2>
            </AccordionTrigger>
            <AccordionContent>
              <GroupCategory />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-full flex flex-col gap-5">
        <ListCatgorires isLoading={fetchCategoriesLoading} allCategories={categories || []} />
        <ListCollections categories={groupCategories || []} />
      </div>
    </div>
  );
};

export default Page;
