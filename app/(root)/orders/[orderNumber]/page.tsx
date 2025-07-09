import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getData } from "@/lib/utils";
import OrderDetails from "@/app/(root)/orders/[orderNumber]/_components/OrderDetails";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
export const dynamic = "force-dynamic";

const page = async ({ params }: { params: { orderNumber: string } }) => {
  const data = await getData("/api/orders/" + params.orderNumber);
  const pickupLocations = await getData("/api/warehouse");

  return (
    <main>
      <div className="flex items-center justify-between gap-3 md:py-4 md:px-2">
        <div className="flex flex-col">
          <div className="head-text flex gap-3">
            <Package className="mt-[2px] h-5 w-5 sm:h-6 sm:w-6" />
            <h2>Order #{params.orderNumber}</h2>{" "}
            {data && (
              <Badge
                variant="outline"
                className={clsx(
                  "rounded-2xl px-2 text-xs font-medium",
                  data.status === "completed"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                )}
              >
                {data.status}
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500">View and manage order</p>
        </div>

        <Breadcrumb className="w-fit flex-1 mt-1">
          <BreadcrumbList className="justify-end text-xs sm:text-sm gap-[2px]">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>#{params.orderNumber}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {!data ? <div>failed to load</div> : <OrderDetails order={data} pickupLocations={pickupLocations} />}
    </main>
  );
};

export default page;
