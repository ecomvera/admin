"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown, LuMoreHorizontal, LuExternalLink, LuEye, LuPackage } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ICategory, IProduct } from "@/types";
import Link from "next/link";
import { DeleteProduct } from "@/components/dialogs/deleteProduct";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdEditDocument } from "react-icons/md";

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8 px-2">
          Product
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 rounded">
            {/* <AvatarImage src={product.images?.[0].url || "/placeholder.svg"} alt={product.name} className="object-cover" /> */}
            <AvatarFallback>
              <LuPackage className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <Link href={`/p/${product.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
              {product.name}
            </Link>
            <p className="text-sm text-muted-foreground truncate">SKU: {product.sku || "N/A"}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const data: ICategory = row.getValue("category") || {};
      return (
        <div className="space-y-1">
          <Badge variant="outline" className="text-xs">
            {data?.parent?.name || "Uncategorized"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "subCategory",
    header: "Sub Category",
    cell: ({ row }) => {
      const data: { name: string } = row.getValue("category") || {};
      return (
        <Badge variant="secondary" className="text-xs">
          {data?.name || "None"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sizes",
    header: "Stock",
    cell: ({ row }) => {
      const data: { quantity: number }[] = row.getValue("sizes") || [];
      const totalQuantity = data?.reduce((acc, item) => acc + item.quantity, 0) || 0;

      const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
        if (quantity < 10) return { label: "Low Stock", variant: "secondary" as const };
        return { label: "In Stock", variant: "default" as const };
      };

      const status = getStockStatus(totalQuantity);

      return (
        <div className="space-y-1">
          <div className="font-medium">{totalQuantity || 0}</div>
          <Badge variant={status.variant} className="text-xs">
            {status?.label || "N/A"}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 ml-auto"
        >
          Price
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price") || "0");
      const mrp = Number.parseFloat(row.getValue("mrp") || "0");

      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price);

      const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

      return (
        <div className="text-right space-y-1">
          <div className="font-medium">{formatted || "N/A"}</div>
          {discount > 0 && (
            <Badge variant="outline" className="text-xs text-green-600">
              {discount || "0"}% off
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "mrp",
    header: () => <div className="text-right">MRP</div>,
    cell: ({ row }) => {
      const mrp = Number.parseFloat(row.getValue("mrp") || "0");
      const price = Number.parseFloat(row.getValue("price") || "0");

      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(mrp);

      return (
        <div className="text-right">
          <div className={`font-medium ${price < mrp ? "line-through text-muted-foreground text-sm" : ""}`}>
            {formatted || "N/A"}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      console.log({
        DropdownMenu,
        DropdownMenuContent,
        DropdownMenuItem,
        DropdownMenuLabel,
        DropdownMenuSeparator,
        DropdownMenuTrigger,
      });

      console.log({ LuMoreHorizontal });
      console.log({ LuEye });
      console.log({ MdEditDocument });
      console.log({ LuExternalLink });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Link href={`/p/${product.slug}`}>
              <DropdownMenuItem className="cursor-pointer">
                <LuEye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            </Link>

            <Link href={`/e/${product.slug}?path=/products`}>
              <DropdownMenuItem className="cursor-pointer">
                <MdEditDocument className="mr-2 h-4 w-4" />
                Edit Product
              </DropdownMenuItem>
            </Link>

            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.slug || "")} className="cursor-pointer">
              <LuExternalLink className="mr-2 h-4 w-4" />
              Copy Link
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
              Mark as Out of Stock
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DeleteProduct id={product.id || ""} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
