import { ChartBarStacked, House, Package, PackagePlus, PackageSearch, Warehouse } from "lucide-react";

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
