"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { status_options } from "@/constants";
import { DataTableViewItems } from "./data-table-view-items";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "orderNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order No." />,
    cell: ({ row }) => (
      <Link href={`/orders/${row.getValue("orderNumber")}`}>
        <div className="font-medium text-primary hover:underline">#{row.getValue("orderNumber")}</div>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
    cell: ({ row }) => {
      const user = row.getValue("user") as { name?: string; email?: string } | null;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-medium">{user?.name || "Guest"}</div>
            {user?.email && <div className="text-xs text-muted-foreground">{user.email}</div>}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "items",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Items" />,
    cell: ({ row }) => <DataTableViewItems row={row} />,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = status_options.find((status) => status.label === row.getValue("status"));
      if (!status) {
        return null;
      }
      return (
        <Badge
          variant="secondary"
          className="font-medium"
          style={{
            backgroundColor: `${status.color}20`,
            color: status.color,
            borderColor: `${status.color}40`,
          }}
        >
          {status.icon && <status.icon className="mr-1 h-3 w-3" />}
          {status.label}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Order Date" />,
    cell: ({ row }) => {
      const field = row.getValue("createdAt") as string;
      return <div className="text-sm">{field}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Updated" />,
    cell: ({ row }) => {
      const uField = row.getValue("updatedAt") as string;
      const cField = row.getValue("createdAt") as string;
      if (uField !== cField) {
        return <div className="text-sm text-muted-foreground">{uField}</div>;
      }
      return <div className="text-sm text-muted-foreground">-</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
