import { ICourier } from "@/types";
import { getShiprocketToken } from "./token";
import { api } from "./api";
import _ from "lodash";
import { generateCreateOrderBody } from "./generateBody";
import { prisma } from "@/lib/prisma";

export class Shiprocket {
  platform: string;
  private static token: string | null = null;

  constructor() {
    this.platform = "shiprocket";
  }

  private async ensureToken(): Promise<void> {
    if (!Shiprocket.token) {
      Shiprocket.token = await getShiprocketToken();
    }
  }

  // get courier services method
  async getCourierServices(obj: Record<string, string>, retryCount: number = 0): Promise<ICourier[]> {
    if (retryCount > 1) {
      console.error("Maximum retry attempts reached for token refresh.");
      return [];
    }

    await this.ensureToken();

    if (!Shiprocket.token) {
      return [];
    }

    try {
      const res = await fetch(
        `${api.checkCourierServiceability}?pickup_postcode=${obj.p_pin}&delivery_postcode=${obj.d_pin}&weight=${
          parseInt(obj.w) / 1000
        }&cod=${obj.pm === "pre-paid" ? 0 : 1}&length=${obj.bl}&breadth=${obj.bw}&height=${obj.bh}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Shiprocket.token}`,
          },
        }
      ).then((res) => res.json());

      if (res.status_code === 401) {
        console.log("Shiprocket token expired! Reinitializing...");
        await this.ensureToken();
        return this.getCourierServices(obj, retryCount + 1);
      }

      const data = _.map(res.data?.available_courier_companies, (item: any) => ({
        platform: this.platform,
        courier_id: item.courier_company_id,
        courier_name: item.courier_name,
        courier_charge: item.freight_charge,
        is_surface: item.is_surface,
        zone: item.zone,
        deliveryTime: item.estimated_delivery_days,
        deliveryDate: item.etd,
      }));

      return data;
    } catch (error) {
      console.log("Error fetching Shiprocket services:", error);
      return [];
    }
  }

  // create shipment order method
  async createShipment(shipment: any, courier: any, platform: string): Promise<any> {
    try {
      await this.ensureToken();

      if (!Shiprocket.token) {
        console.log("Shiprocket token not found");
        return null;
      }

      // create order
      const orderRes = await fetch(api.createOrder, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Shiprocket.token}`,
        },
        body: JSON.stringify(generateCreateOrderBody(shipment)),
      }).then((res) => res.json());

      if (!orderRes.order_id) {
        console.log(`Order id - ${shipment.orderNumber} - Error creating shipment:`, orderRes);
        return { data: null, error: orderRes.message || "Error creating shipment" };
      }

      // generate AWB number
      const awbRes = await fetch(api.generateAWB, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Shiprocket.token}`,
        },
        body: JSON.stringify({ shipment_id: orderRes.shipment_id, courier_id: courier.courier_id }),
      }).then((res) => res.json());

      if (awbRes.awb_assign_status === 0) {
        console.log(`Order id - ${shipment.orderNumber} - Error generating AWB number:`, awbRes);
        return {
          data: null,
          error: awbRes.message || awbRes.response.data.awb_assign_error || "Error generating AWB number",
        };
      }

      // save shipment courier details
      const shipmentRes = await prisma.shipment.create({
        data: {
          platform,
          response: awbRes.response.data,
          orderNumber: shipment.orderNumber,
        },
      });

      // update order
      await prisma.order.update({
        where: {
          orderNumber: shipment.orderNumber,
        },
        data: {
          shipmentId: shipmentRes.id,
          pickupId: shipment.warehouse.id,
          status: "CONFIRMED",
        },
      });

      return { data: {} };
    } catch (error) {
      console.log("[createShipment] - error -", error);
      return { data: null, error: "something went wrong!" };
    }
  }

  // cancel courier
  async cancelCourier(awb: string, orderNumber: string): Promise<any> {
    try {
      await this.ensureToken();

      if (!Shiprocket.token) {
        console.log("Shiprocket token not found");
        return null;
      }

      const awbRes = await fetch(`${api.cancelAWB}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Shiprocket.token}`,
        },
        body: JSON.stringify({ awbs: [awb] }),
      }).then((res) => res.json());

      // update order
      await prisma.order.update({
        where: {
          orderNumber,
        },
        data: {
          shipmentId: null,
        },
      });

      // delete shipment
      try {
        await prisma.shipment.delete({ where: { orderNumber } });
      } catch (error) {}

      return { data: awbRes };
    } catch (error) {
      console.log("[cancelCourier] - error -", error);
      return { data: null, error: "something went wrong!" };
    }
  }

  // cancel order
  async cancelOrder(courierOrderId: string, orderNumber: string): Promise<any> {
    try {
      await this.ensureToken();

      if (!Shiprocket.token) {
        console.log("Shiprocket token not found");
        return null;
      }

      const orderRes = await fetch(`${api.cancelOrder}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Shiprocket.token}`,
        },
        body: JSON.stringify({ ids: [courierOrderId] }),
      }).then((res) => res.json());

      // update order
      await prisma.order.update({
        where: {
          orderNumber,
        },
        data: {
          status: "CANCELLED",
          shipmentId: null,
          cancelledAt: new Date(),
          cancelledBy: "Silkyester",
        },
      });

      // delete shipment
      try {
        await prisma.shipment.delete({ where: { orderNumber } });
      } catch (error) {}

      // initiate refund from payment gateway (if applicable)

      return { data: orderRes };
    } catch (error) {
      console.log("[cancelOrder] - error -", error);
      return { data: null, error: "something went wrong!" };
    }
  }

  // track shipment
  async trackCourier(awb: string): Promise<any> {
    try {
      await this.ensureToken();

      if (!Shiprocket.token) {
        console.log("Shiprocket token not found");
        return null;
      }

      const awbRes = await fetch(`${api.trackAWB}/${awb}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Shiprocket.token}`,
        },
      }).then((res) => res.json());

      return { data: awbRes };
    } catch (error) {
      console.log("[trackCourier] - error -", error);
      return { data: null, error: "something went wrong!" };
    }
  }
}
