"use client";

import { Building2, MapPin, User, Package, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const WarehousesPage = ({ data }: { data: any[] }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
        <p className="text-muted-foreground mb-4">Get started by creating your first warehouse location.</p>
        <Link href="/warehouses/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Warehouse
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((warehouse) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} />
      ))}
    </div>
  );
};

const WarehouseCard = ({ warehouse }: { warehouse: any }) => {
  const productCount = warehouse.products?.length || 0;
  const isActive = productCount > 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <Link href={`/warehouses/${warehouse.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isActive ? "bg-green-100" : "bg-muted"}`}>
                <Building2 className={`h-5 w-5 ${isActive ? "text-green-600" : "text-muted-foreground"}`} />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {warehouse.warehouseName}
                </CardTitle>
                <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                  {isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contact Person */}
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{warehouse.contactPersonName}</span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-muted-foreground line-clamp-2">{warehouse.address}</p>
              <p className="text-xs text-muted-foreground">
                {warehouse.city}, {warehouse.state} {warehouse.pincode}
              </p>
            </div>
          </div>

          {/* Products Count */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Products</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {productCount}
            </Badge>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default WarehousesPage;
