"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import ListCatgorires from "@/components/shared/ListCatgorires";
import Attributes from "@/components/shared/Attributes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ListCollections from "@/components/shared/ListCollections";
import ListAttributes from "@/components/shared/ListAttributes";
import Sizes from "@/components/shared/Sizes";
import Colors from "@/components/shared/Colors";
import { sizeCategories } from "@/constants";
import { useCategories } from "@/hook/useCategories";
import { useAttributes } from "@/hook/useAttributes";
import { useSizes } from "@/hook/useSizes";
import { useColors } from "@/hook/useColors";
import { useCollections } from "@/hook/useCollections";
import Collections from "@/components/shared/Collections";

const Page = () => {
  const { sizes, fetchingSizes } = useSizes();
  const { colors, fetchingColors } = useColors();
  const { attributes, fetchingAttributes } = useAttributes();
  const { categories, fetchCategoriesLoading } = useCategories();
  const { collections, fetchingCollections } = useCollections();

  return (
    <div className="flex py-3 flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <Accordion type="multiple" defaultValue={["item-4"]}>
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
              <Collections />
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
              <Sizes sizes={sizes} sizeCategories={sizeCategories} isLoading={fetchingSizes} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="w-full">
        <Accordion type="multiple" defaultValue={["item-3", "item-4"]}>
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
              <ListCollections collections={collections || []} isLoading={fetchingCollections} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Attributes</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListAttributes attributes={attributes || []} isLoading={fetchingAttributes} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Colors</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Colors colors={colors} isLoading={fetchingColors} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Page;
