"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category";
import GroupCategory from "@/components/shared/GroupCategory";
import { useGroupCategoryStore } from "@/stores/groupCategory";
import Attributes from "@/components/shared/Attributes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ListCollections from "@/components/shared/ListCollections";
import ListAttributes from "@/components/shared/ListAttributes";
import Sizes from "@/components/shared/Sizes";
import Colors from "@/components/shared/Colors";
import { useEnums } from "@/hook/useEnums";

const Page = () => {
  const { sizes, colors, attributes } = useEnums();
  const { categories, setCategories } = useCategoryStore();
  const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);
  const { groupCategories, setGroupCategories } = useGroupCategoryStore();
  const { mutate: fetchGroupCategories, isLoading: fetchGroupCategoriesLoading } = useSWR(
    "/api/categories/group",
    fetcher,
    fetchOpt
  );

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
    };
    fetch();
  }, []);

  return (
    <div className="flex py-3 flex-col gap-5 tablet:flex-row">
      <div className="w-full">
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
              <h2 className="text-lg font-semibold text-dark-3">Add Collection</h2>
            </AccordionTrigger>
            <AccordionContent>
              <GroupCategory />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Add Attribute</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Attributes />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Sizes</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Sizes sizes={sizes} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-full">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Categories</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListCatgorires isLoading={fetchCategoriesLoading} allCategories={categories || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Collections</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListCollections categories={groupCategories || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Attributes</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListAttributes attributes={attributes || []} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Colors</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Colors colors={colors} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
