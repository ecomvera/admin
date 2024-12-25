import { PackageOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditProductPage from "@/screens/edit-product/EditProductPage";

const Page = ({ params, searchParams }: { params: { slug: string }; searchParams: any }) => {
  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <PackageOpen className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Edit Product</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">Edit existing product</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <EditProductPage params={params} searchParams={searchParams} />
    </main>
  );
};

export default Page;
