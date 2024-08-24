"use client";

import { ColumnDef } from "@tanstack/react-table";
import { LuArrowUpDown, LuMoreHorizontal } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IProduct } from "@/types";
import Link from "next/link";

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <LuArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase ml-2 tablet:ml-4">
        <Link href={`/p/${row.original._id}`}>{row.getValue("name")}</Link>
      </div>
    ),
  },
  {
    accessorKey: "parentCategory",
    header: "Parent Category",
    cell: ({ row }) => <div className="capitalize">{row.getValue("parentCategory")}</div>,
  },
  {
    accessorKey: "subCategory",
    header: "Sub Category",
    cell: ({ row }) => <div className="capitalize">{row.getValue("subCategory")}</div>,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <div className="flex justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Quantity <LuArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => <div className="text-right font-medium">{row.getValue("quantity")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex justify-end" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Amount <LuArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));

      // Format the price as a dollar price
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "mrp",
    header: () => <div className="text-right">MRP</div>,
    cell: ({ row }) => {
      const mrp = parseFloat(row.getValue("mrp"));

      // Format the mrp as a dollar mrp
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(mrp);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <LuMoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/e/${row.original._id}?path=/products`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link href={`/p/${row.original._id}`}>
              <DropdownMenuItem>View product details</DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => {}}>
              Mark as <code className="text-red-600 ml-2">outofstock</code>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => {}}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
