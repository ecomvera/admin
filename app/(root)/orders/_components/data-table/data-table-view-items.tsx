"use client";
import type { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Package } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DataTableViewItemsProps<TData> {
  row: Row<TData>;
}

export function DataTableViewItems<TData>({ row }: DataTableViewItemsProps<any>) {
  const items = row.getValue("items") as any[];

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 px-2 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{items?.length || 0}</span>
            <Badge variant="outline" className="text-xs">
              items
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Order Items ({items?.length || 0})
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items?.length > 0 ? (
            items.map((item, i) => (
              <DropdownMenuItem key={i} className="cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.quantity}x
                  </Badge>
                  <span className="line-clamp-2 flex-1">{item.product.name}</span>
                </div>
                <div className="text-sm font-medium">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(item.price * item.quantity)}
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No items found</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
