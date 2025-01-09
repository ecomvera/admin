import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/date";
import OrdersPage from "@/screens/orders/OrdersPage";
import { Package } from "lucide-react";

async function getData() {
  const res = await fetch("http://localhost:3001/api/orders", { cache: "no-store" }).then((res) => res.json());
  if (!res.ok) {
    console.log("error -", res.error);
    return null;
  }

  const data = res.data.map((task: any) => {
    task.createdAt = formatDate(task.createdAt);
    task.updatedAt = formatDate(task.updatedAt);
    return task;
  });

  return data;
}

const page = async () => {
  const data = await getData();

  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <Package className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Orders</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">View and manage orders</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!data ? <div>failed to load</div> : <OrdersPage data={data} />}
    </main>
  );
};

export default page;
