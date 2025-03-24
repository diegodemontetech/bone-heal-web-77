
import { BarChart3, BookOpen, Newspaper, Tags, Percent } from "lucide-react";
import { NavItem } from "@/components/admin/navigation/types";

export const marketingItems: NavItem[] = [
  {
    title: "Marketing",
    icon: BarChart3,
    href: "#", // Changed from "/admin/marketing" to "#" to make it not navigable
    segment: "marketing",
    permission: "manage_marketing",
    children: [
      {
        title: "Estudos",
        href: "/admin/studies",
        segment: "studies",
        icon: BookOpen,
      },
      {
        title: "Notícias",
        href: "/admin/news",
        segment: "news",
        icon: Newspaper,
      },
      {
        title: "Cupons",
        href: "/admin/vouchers",
        segment: "vouchers",
        icon: Tags,
      },
      {
        title: "Condições Comerciais",
        href: "/admin/commercial-conditions",
        segment: "commercial-conditions",
        icon: Percent,
      },
    ],
  },
];
