"use client";

import { fetcher, fetchOpt } from "@/lib/utils";
import _ from "lodash";
import { Plus } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const WarehousesPage = () => {
  const warehouses = useSWR("/api/warehouse", fetcher, fetchOpt);

  return (
    <div className="flex">
      <Link href="/warehouses/create">
        <div className="flex items-center gap-2 h-44 w-40 cursor-pointer border">
          <Plus className="h-6 w-6" />
          <p>Create Warehouse</p>
        </div>
      </Link>
      {_.map(warehouses?.data?.data, (warehouse) => (
        <Link href={`/warehouses/${warehouse.id}`} key={warehouse.id}>
          <div className="border rounded p-2 h-44 w-40 cursor-pointer">
            <p>{warehouse.name}</p>
          </div>
        </Link>
      ))}
      {warehouses?.isLoading && <p>Loading...</p>}
    </div>
  );
};

export default WarehousesPage;
