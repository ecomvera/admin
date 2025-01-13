import { ICourier } from "@/types";
import { getShiprocketToken } from "./token";
import { api } from "./api";
import _ from "lodash";

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
        }&cod=${obj.pm === "pre-paid" ? 0 : 1}`,
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
}
