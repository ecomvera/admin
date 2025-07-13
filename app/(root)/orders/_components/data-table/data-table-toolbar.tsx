"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, RefreshCw } from "lucide-react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { status_options } from "@/constants";
import { Badge } from "@/components/ui/badge";
import * as React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const activeFiltersCount = React.useMemo(() => {
    return table.getState().columnFilters.length;
  }, [table.getState().columnFilters]);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("orderNumber")?.setFilterValue(event.target.value)}
            className="pl-9"
          />
        </div>

        {table.getColumn("status") && (
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={status_options} />
        )}

        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            <Filter className="mr-1 h-3 w-3" />
            {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
          </Badge>
        )}

        {isFiltered && (
          <Button variant="outline" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <DataTableViewOptions table={table} />
    </div>
  );
}
