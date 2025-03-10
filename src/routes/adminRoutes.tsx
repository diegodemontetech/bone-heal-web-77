
import { RouteObject } from "react-router-dom";

// Importar rotas por categoria
import { dashboardRoutes } from "./admin/dashboardRoutes";
import { userRoutes } from "./admin/userRoutes";
import { productRoutes } from "./admin/productRoutes";
import { orderRoutes } from "./admin/orderRoutes";
import { contentRoutes } from "./admin/contentRoutes";
import { crmRoutes } from "./admin/crmRoutes";
import { configRoutes } from "./admin/configRoutes";
import { supportRoutes } from "./admin/supportRoutes";

// Exporta todas as rotas de admin combinadas
export const adminRoutes = (
  <>
    {dashboardRoutes}
    {userRoutes}
    {productRoutes}
    {orderRoutes}
    {contentRoutes}
    {crmRoutes}
    {configRoutes}
    {supportRoutes}
  </>
);
