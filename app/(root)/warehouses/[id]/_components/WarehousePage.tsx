"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import Settings from "./Settings";
import ProductTable from "./ProductTable";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Package, SettingsIcon } from "lucide-react";

const WarehousePage = ({ id }: { id: string }) => {
  const warehouse = useSWR(`/api/warehouse/${id}`, fetcher, fetchOpt);

  if (warehouse?.isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Loading warehouse details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!warehouse?.data?.data) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Warehouse Not Found</h2>
          <p className="text-muted-foreground text-center">
            The warehouse you're looking for doesn't exist or has been removed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="inventory" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="inventory" className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Inventory Management
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          Warehouse Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inventory" className="space-y-6">
        <ProductTable data={warehouse?.data?.data} refetch={warehouse?.mutate} />
      </TabsContent>

      <TabsContent value="settings" className="space-y-6">
        <Settings data={warehouse?.data?.data} refetch={warehouse?.mutate} />
      </TabsContent>
    </Tabs>
  );
};

export default WarehousePage;
