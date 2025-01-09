import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";
import { formatDate } from "@/lib/date";

const OrdersPage = ({ data }: { data: any[] }) => {
  const orders = data.map((task: any) => {
    task.createdAt = formatDate(task.createdAt);
    task.updatedAt = formatDate(task.updatedAt);
    return task;
  });

  return (
    <div className="p-2">
      <div className="flex h-full min-h-screen w-full flex-col ">
        <DataTable data={orders} columns={columns} />
      </div>
    </div>
  );
};

export default OrdersPage;
