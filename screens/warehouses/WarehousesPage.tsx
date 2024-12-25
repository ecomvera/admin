"use client";

import { fetcher, fetchOpt } from "@/lib/utils";
import _ from "lodash";
import { Plus, Warehouse } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const WarehousesPage = () => {
  const warehouses = useSWR("/api/warehouse", fetcher, fetchOpt);

  return (
    <div className="flex gap-2">
      <Link href="/warehouses/create">
        <div className="flex items-center gap-2  w-40 cursor-pointer border rounded p-2 text-sm">
          <Plus className="h-6 w-6" />
          <p>Add Warehouse</p>
        </div>
      </Link>

      {_.map(warehouses?.data?.data, (warehouse) => (
        <Link href={`/warehouses/${warehouse.id}`} key={warehouse.id}>
          <div className="border rounded p-2 w-40 max-h-24 cursor-pointer overflow-hidden">
            <Warehouse className="h-6 w-6" />
            <p className="mt-4 line-clamp-2 text-sm">{warehouse.name}</p>
          </div>
        </Link>
      ))}
      {warehouses?.isLoading && <p>Loading...</p>}
    </div>
  );
};

export default WarehousesPage;
