import { PackageOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import EditProductPage from "@/app/(root)/edit-product/[slug]/_components/EditProductPage";
import { getData } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Page = async ({ params, searchParams }: { params: { slug: string }; searchParams: any }) => {
  const data = await getData(`/api/products/${params.slug}`);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PackageOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
              <p className="text-muted-foreground">Update existing product details</p>
            </div>
          </div>
        </div>

        <Breadcrumb>
          <BreadcrumbList>
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

      <EditProductPage product={data} searchParams={searchParams} />
    </div>
  );
};

export default Page;
