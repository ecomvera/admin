"use client";

import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";
import { formatDate } from "@/lib/date";
import { useEffect, useState } from "react";
import { useOrderStore } from "@/stores/orders";

const OrdersPage = ({ data }: { data: any[] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { orders, setOrders } = useOrderStore();

  useEffect(() => {
    const formatedData = data.map((task: any) => {
      task.createdAt = formatDate(task.createdAt);
      task.updatedAt = formatDate(task.updatedAt);
      return task;
    });
    setOrders(formatedData);
    setIsLoading(false);
  }, []);

  return (
    <div className="p-6">
      <DataTable isLoading={isLoading} data={orders} columns={columns} />
    </div>
  );
};

export default OrdersPage;
