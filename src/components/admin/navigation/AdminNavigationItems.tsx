
import { NavItem } from "@/components/admin/navigation/types";
import { dashboardItems } from "./items/dashboardItems";
import { userItems } from "./items/userItems";
import { productItems } from "./items/productItems";
import { orderItems } from "./items/orderItems";
import { marketingItems } from "./items/marketingItems";
import { crmItems } from "./items/crmItems";
import { supportItems } from "./items/supportItems";
import { logisticsItems } from "./items/logisticsItems";
import { settingsItems } from "./items/settingsItems";

// Combine all navigation items
export const adminNavigationItems: NavItem[] = [
  ...dashboardItems,
  ...userItems,
  ...productItems,
  ...orderItems,
  ...marketingItems,
  ...crmItems,
  ...supportItems,
  ...logisticsItems,
  ...settingsItems,
];
