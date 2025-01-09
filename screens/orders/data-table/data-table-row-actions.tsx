"use client";

import * as React from "react";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Copy, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { status_options } from "@/constants";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<any>) {
  // const [dialogContent, setDialogContent] = React.useState<React.ReactNode | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState<boolean>(false);
  const order = row.original;

  // const handleEditClick = () => {
  //   setDialogContent(<EditDialog task={task} />);
  // };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.orderNumber)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Order Number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild onClick={() => {}}>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem onSelect={() => setShowDeleteDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={order.status}>
                {status_options.map((status) => (
                  <DropdownMenuRadioItem key={status.value} value={status.value}>
                    <status.icon className="w-4 h-4 mr-2" />
                    {status.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* {dialogContent && <DialogContent>{dialogContent}</DialogContent>}
      <DeleteDialog
        task={task}
        isOpen={showDeleteDialog}
        showActionToggle={setShowDeleteDialog}
      /> */}
    </Dialog>
  );
}
