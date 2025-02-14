import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin" },
    { label: "Usuários", path: "/admin/users" },
    { label: "Produtos", path: "/admin/products" },
    { label: "Pedidos", path: "/admin/orders" },
    { label: "Sincronização", path: "/admin/sync" },
    { label: "Notícias", path: "/admin/news" },
    { label: "Artigos", path: "/admin/studies" },
    { label: "Fretes", path: "/admin/shipping-rates" },
    { label: "WhatsApp", path: "/admin/whatsapp" },
    { label: "Leads", path: "/admin/leads" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul>
            {menuItems.map((item) => (
              <li key={item.label} className="p-4">
                <Link
                  to={item.path}
                  className={`block hover:bg-gray-700 rounded ${
                    location.pathname === item.path ? "bg-gray-700" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger className="md:hidden absolute top-4 left-4">
          <Menu />
        </SheetTrigger>
        <SheetContent className="w-64 bg-gray-800 text-white">
          <SheetHeader className="p-4">
            <SheetTitle className="text-2xl font-bold">Admin Panel</SheetTitle>
            <SheetDescription>
              Navegue pelo painel administrativo.
            </SheetDescription>
          </SheetHeader>
          <nav className="flex-1">
            <ul>
              {menuItems.map((item) => (
                <li key={item.label} className="p-4">
                  <Link
                    to={item.path}
                    className={`block hover:bg-gray-700 rounded ${
                      location.pathname === item.path ? "bg-gray-700" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
