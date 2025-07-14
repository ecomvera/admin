import { PackagePlusIcon, PackageSearch } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AddProductPage from "@/app/(root)/add-product/_components/AddProductPage";

const Page = () => {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PackagePlusIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
              <p className="text-muted-foreground">Add new product</p>
            </div>
          </div>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <AddProductPage />
    </main>
  );
};

export default Page;
