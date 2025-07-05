"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  MapPin,
  CreditCard,
  Mail,
  Phone,
  MapPinIcon,
  IndianRupee,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IOrder, IOrderItem, IWarehouse } from "@/types";
import { Dot, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { CreateShipmentDialog } from "./CreateShipmentDialog";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import TrackShipment from "./TrackShipment";
import SchedulePickup from "./SchedulePickup";
import clsx from "clsx";

interface IShipment {
  platform: string;
  awb: string;
  pickupDate?: string;
  shipmentId: string;
  orderId?: string;
  orderNumber: string;
}

const OrderDetails = ({
  order,
  pickupLocations,
}: {
  order: IOrder;
  pickupLocations: IWarehouse[];
}) => {
  const [shipment, setShipment] = useState<IShipment | null>(null);

  console.log(order);

  useEffect(() => {
    if (!order.shipment) return;
    if (order.shipment.platform === "shiprocket") {
      setShipment({
        platform: order.shipment.platform,
        awb: order.shipment.response.awb_code,
        shipmentId: order.shipment.response.shipment_id,
        orderId: order.shipment.response.order_id,
        orderNumber: order.orderNumber,
        pickupDate: order.shipment.response.pickup_scheduled_date,
      });
    }
  }, []);

  return (
    <div>
      {!order.cancelledAt ? (
        <div className="flex gap-2 items-center justify-end min-h-8">
          {!shipment?.awb ? (
            <CreateShipmentDialog
              order={order}
              pickupLocations={pickupLocations}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <h2 className="font-semibold leading-5">AWB: {shipment.awb}</h2>
                {shipment.pickupDate && (
                  <p className="text-xs">
                    Pickup Date: {shipment.pickupDate.slice(0, 16)}
                  </p>
                )}
              </div>
              {!shipment.pickupDate ? (
                <SchedulePickup
                  shipmentId={shipment.shipmentId}
                  platform={shipment.platform}
                />
              ) : (
                <TrackShipment
                  awb={shipment.awb}
                  platform={shipment.platform}
                />
              )}
            </div>
          )}
          <Dropdown shipment={shipment} />
        </div>
      ) : (
        <Alert variant="destructive" className="rounded">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Order Cancelled</AlertTitle>
          <AlertDescription>
            This order has been cancelled. Cancelled by{" "}
            <b>{order.cancelledBy}</b>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-2 my-5">
        {order.items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </div>

      <MoreDetails order={order} />
    </div>
  );
};

const OrderItem = ({ item }: { item: IOrderItem }) => {
  return (
    <div className="border rounded p-2 flex gap-2">
      <div className="w-[60px] tablet:w-[100px]">
        <AspectRatio ratio={0.8 / 1} className="">
          <Image
            priority
            key={item.product.name}
            src={item.product.images[0].url}
            alt="product"
            className="w-full h-full object-cover rounded"
            width={0}
            height={0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </AspectRatio>
      </div>
      <div className="relative flex-1">
        <p className="text-sm tablet:text-base font-semibold !leading-[15px] line-clamp-2">
          {item.product.name}
        </p>

        <div className="absolute bottom-0">
          <p className="text-xs mobile:text-sm font-normal">
            Size:{" "}
            <span className="font-semibold text-sm mobile:text-base">
              {item.size}
            </span>
          </p>
          <ColorPalette color={item.color} />
        </div>
      </div>
      <div className="flex flex-col justify-between text-right">
        <p className="text-xs mobile:text-sm font-normal">
          Quantity:{" "}
          <span className="font-semibold text-sm mobile:text-base">
            {item.quantity}
          </span>
        </p>
        <div>
          <p className="text-xs mobile:text-sm font-normal">
            P/U: ₹{item.price}
          </p>
          <p className="text-xs mobile:text-sm font-normal">
            Total:{" "}
            <span className="font-semibold text-sm mobile:text-base">
              ₹{item.price * item.quantity}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ColorPalette = ({ color }: { color: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <p className="text-xs mobile:text-sm font-normal">
          Color:{" "}
          <span
            className={`border px-2 rounded-2xl font-bold`}
            style={{ color: color, borderColor: color }}
          >
            {color}
          </span>
        </p>
      </DialogTrigger>
      <DialogContent
        className="h-96 w-96"
        style={{ backgroundColor: color }}
        aria-describedby={undefined}
      >
        <DialogTitle className="hidden">Color</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

const MoreDetails = ({ order }: { order: IOrder }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Separator className="my-4 mt-10" />

      {/* Header */}
      <div className="text-center space-y-2">
        {/* <h1 className="text-3xl font-bold text-slate-900">Order Details</h1> */}
        <p className="text-slate-600">Complete information for your order</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Details Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <User className="h-5 w-5 text-blue-600" />
              User Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Name</p>
                <p className="text-slate-900">{order.user?.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="text-slate-900">{order.user?.email}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </p>
                <p className="text-slate-900">{order.user?.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Details Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm md:col-span-1 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <MapPin className="h-5 w-5 text-green-600" />
              Shipping Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">Name</p>
                <p className="text-slate-900">{order.shippingAddress?.name}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <MapPinIcon className="h-3 w-3" />
                  Address
                </p>
                <p className="text-slate-900 text-sm">
                  {order.shippingAddress?.line1}, {order.shippingAddress?.line2}
                  , {order.shippingAddress?.landmark}
                </p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">City</p>
                  <p className="text-slate-900">
                    {order.shippingAddress?.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">State</p>
                  <p className="text-slate-900">
                    {order.shippingAddress?.state}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-600">Country</p>
                  <p className="text-slate-900">
                    {order.shippingAddress?.country}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Pincode</p>
                  <p className="text-slate-900">
                    {order.shippingAddress?.pincode}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Phone
                </p>
                <p className="text-slate-900">{order.shippingAddress?.phone}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="text-slate-900 break-all">
                  {order.shippingAddress?.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Payment Method
                </p>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {order.payment.mode}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Payment Status
                </p>
                <Badge
                  className={clsx(
                    order.payment.status === "PAID"
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                      : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                  )}
                >
                  {order.payment.status}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Gift Wrap Charge
                </p>
                <p className="text-slate-900">{order.giftWrapCharge}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Delivery Charge
                </p>
                <p className="text-slate-900">{order.deliveryCharge}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Payment Amount
                </p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4 text-slate-700" />
                  <p className="text-2xl font-bold text-slate-900">
                    {order.totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card className="shadow-lg border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Order Summary</h3>
              <p className="text-slate-300">Payment completed successfully</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Total Amount</p>
              <div className="flex items-center gap-1 justify-end">
                <IndianRupee className="h-5 w-5" />
                <p className="text-3xl font-bold">{order.subTotal}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;
