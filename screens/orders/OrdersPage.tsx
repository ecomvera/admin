import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/columns";

const OrdersPage = ({ data }: { data: any[] }) => {
  return (
    <div className="p-2">
      <div className="flex h-full min-h-screen w-full flex-col ">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
};

export default OrdersPage;
