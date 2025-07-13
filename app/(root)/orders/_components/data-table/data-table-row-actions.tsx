"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
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
import { Copy, Eye, MoreHorizontal, Trash2, RefreshCw } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { status_options } from "@/constants";
import { updateOrderStatusDB } from "@/lib/actions/order.action";
import { useOrderStore } from "@/stores/orders";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<any>) {
  const router = useRouter();
  const { updateOrderStatus } = useOrderStore();
  const [showCancelDialog, setShowCancelDialog] = React.useState<boolean>(false);
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const order = row.original;

  const handleChangeStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      const res = await updateOrderStatusDB(order.id, status);
      if (res) {
        updateOrderStatus(order.id, status, formatDate(res.updatedAt));
        toast.success(`Order status updated to ${status}`);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied to clipboard");
  };

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

          <DropdownMenuItem onClick={handleCopyOrderNumber} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" />
            Copy Order Number
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push(`/orders/${order.orderNumber}`)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={isUpdating}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? "animate-spin" : ""}`} />
              Update Status
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={order.status}>
                {status_options.map((status) => (
                  <DropdownMenuRadioItem
                    key={status.value}
                    value={status.value}
                    onClick={() => handleChangeStatus(status.label)}
                    disabled={isUpdating || status.value === order.status}
                  >
                    <status.icon className="w-4 h-4 mr-2" style={{ color: status.color }} />
                    {status.label}
                    {status.value === order.status && (
                      <span className="ml-auto text-xs text-muted-foreground">(current)</span>
                    )}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setShowCancelDialog(true)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancel Order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
