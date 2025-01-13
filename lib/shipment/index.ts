import { Bigship } from "./bigship";
import { Delhivery } from "./delhivery";
import { Shiprocket } from "./shiprocket";

export const courierClasses = {
  delhivery: Delhivery,
  shiprocket: Shiprocket,
  bigship: Bigship,
};

export const fetchActiveCouriersFromDB = async () => {
  return ["shiprocket", "bigship", "delhivery"];
};
