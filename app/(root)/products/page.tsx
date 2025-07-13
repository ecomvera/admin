import { PackageSearch, Package, TrendingUp, AlertTriangle } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getData } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lazy } from "react";

const ProductsPage = lazy(() => import("@/app/(root)/products/_components/ProductsPage"));

export const dynamic = "force-dynamic";

const Page = async () => {
  const categories = await getData("/api/categories");
  const products = await getData("/api/products?table-data");

  // Calculate stats
  const totalProducts = products?.length || 0;
  const totalValue =
    products?.reduce(
      (acc: number, product: any) =>
        acc + (product.price * product.sizes?.reduce((sizeAcc: number, size: any) => sizeAcc + size.quantity, 0) || 0),
      0
    ) || 0;
  const lowStockProducts =
    products?.filter((product: any) => {
      const totalQuantity = product.sizes?.reduce((acc: number, size: any) => acc + size.quantity, 0) || 0;
      return totalQuantity < 10;
    }).length || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PackageSearch className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">Manage your product inventory and details</p>
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
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                notation: "compact",
              }).format(totalValue)}
            </div>
            <p className="text-xs text-muted-foreground">Total inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Products with {"<"} 10 items</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!products ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Failed to load products</p>
            </div>
          ) : (
            <ProductsPage products={products} categories={categories || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
