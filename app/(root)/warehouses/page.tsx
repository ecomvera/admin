import { Warehouse, Building2, Package, Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WarehousesPage from "@/app/(root)/warehouses/_components/WarehousesPage";
import { getData } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await getData("/api/warehouse");

  // Calculate stats
  const totalWarehouses = data?.length || 0;
  const totalProducts = data?.reduce((acc: number, warehouse: any) => acc + (warehouse.products?.length || 0), 0) || 0;
  const activeWarehouses = data?.filter((warehouse: any) => warehouse.products?.length > 0).length || 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Warehouse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Warehouses</h1>
              <p className="text-muted-foreground">Manage your warehouse locations and inventory</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Warehouses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link href="/warehouses/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Warehouse
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warehouses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWarehouses}</div>
            <p className="text-xs text-muted-foreground">Registered locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warehouses</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeWarehouses}</div>
            <p className="text-xs text-muted-foreground">With inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all warehouses</p>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">Failed to load warehouses</p>
            </div>
          ) : (
            <WarehousesPage data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
