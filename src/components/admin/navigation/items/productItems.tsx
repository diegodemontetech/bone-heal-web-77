
import { Package, ListChecks, Tags } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const productItems: NavItem[] = [
  {
    title: "Produtos",
    icon: Package,
    href: "/admin/products",
    segment: "products",
    permission: "manage_products",
    children: [
      {
        title: "Lista de Produtos",
        href: "/admin/products",
        segment: "products",
        icon: ListChecks,
      },
      {
        title: "Adicionar Produto",
        href: "/admin/products/new",
        segment: "new",
        icon: Package,
      },
      {
        title: "Categorias",
        href: "/admin/products/categories",
        segment: "categories",
        icon: Tags,
      },
    ],
  },
];
