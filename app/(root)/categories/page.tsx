"use client";

import CategoryTabs from "@/app/(root)/categories/_components/CategoryTabs";
import ListCatgorires from "@/app/(root)/categories/_components/ListCatgorires";
// import Attributes from "@/app/(root)/categories/_components/Attributes";
// import ListAttributes from "@/app/(root)/categories/_components/ListAttributes";
import Sizes from "@/app/(root)/categories/_components/Sizes";
import Colors from "@/app/(root)/categories/_components/Colors";
import Types from "@/app/(root)/categories/_components/Types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { sizeCategories } from "@/constants";
import { useCategories } from "@/hook/useCategories";
import { useSizes } from "@/hook/useSizes";
import { useColors } from "@/hook/useColors";
import { useTypes } from "@/hook/useTypes";

const Page = () => {
  const { sizes, fetchingSizes } = useSizes();
  const { colors, fetchingColors } = useColors();
  const { categories, fetchCategoriesLoading } = useCategories();

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

          {/* <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Add Attribute</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Attributes />
            </AccordionContent>
          </AccordionItem> */}
          <AccordionItem value="item-4">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Types</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Types />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
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
        <Accordion type="multiple" defaultValue={[]}>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Categories</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListCatgorires isLoading={fetchCategoriesLoading} allCategories={categories || []} />
            </AccordionContent>
          </AccordionItem>

          {/* <AccordionItem value="item-3">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Attributes</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListAttributes attributes={attributes || []} isLoading={fetchingAttributes} />
            </AccordionContent>
          </AccordionItem> */}
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
