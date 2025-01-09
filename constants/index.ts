import {
  ChartBarStacked,
  House,
  Package,
  PackagePlus,
  PackageSearch,
  Warehouse,
  BadgeCheck,
  Ban,
  CheckCheck,
  CircleDashed,
  PackageOpen,
  Ship,
  Timer,
  Truck,
  Undo2,
  XCircle,
  RefreshCcwDot,
  RotateCcw,
} from "lucide-react";

export const sidebarLinks = [
  {
    icon: House,
    route: "/",
    label: "Home",
  },
  {
    icon: PackagePlus,
    route: "/add-product",
    label: "Add Product",
  },
  {
    icon: PackageSearch,
    route: "/products",
    label: "Products",
  },
  {
    icon: ChartBarStacked,
    route: "/categories",
    label: "Categories",
  },
  {
    icon: Package,
    route: "/orders",
    label: "Orders",
  },
  {
    icon: Warehouse,
    route: "/warehouses",
    label: "Warehouses",
  },
];

export const defaultGenders = ["Male", "Female", "Unisex"];
export const sizeCategories = ["standard", "numeric", "footwear"];

export const status_options = [
  {
    value: "PENDING",
    label: "Pending",
    icon: CircleDashed,
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    icon: BadgeCheck,
  },
  {
    value: "PROCESSING",
    label: "Processing",
    icon: Timer,
  },
  {
    value: "PICKED_UP",
    label: "Picked Up",
    icon: CheckCheck,
  },
  {
    value: "SHIPPED",
    label: "Shipped",
    icon: Ship,
  },
  {
    value: "OUT_FOR_DELIVERY",
    label: "Out for delivery",
    icon: Truck,
  },
  {
    value: "DELIVERED",
    label: "Delivered",
    icon: PackageOpen,
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    icon: Ban,
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: XCircle,
  },
  {
    value: "RETURN_REQUESTED",
    label: "Return Requested",
    icon: Undo2,
  },
  {
    value: "RETURNED",
    label: "Returned",
    icon: RotateCcw,
  },
  {
    value: "REFUNDED",
    label: "Refunded",
    icon: RefreshCcwDot,
  },
];
