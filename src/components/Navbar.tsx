
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Produtos", path: "/produtos" },
    { name: "Como Funciona", path: "/como-funciona" },
    { name: "Estudos", path: "/estudos" },
    { name: "Sobre", path: "/sobre" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Bone Heal Logo"
              className="h-10 mr-2"
            />
            <span className="text-xl font-bold text-primary">Bone Heal</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Contact Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <a 
              href="tel:+551143264252"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-primary"
            >
              <Phone className="h-4 w-4 mr-1" />
              (11) 4326-4252
            </a>
            <WhatsAppButton />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white pb-4">
          <div className="container mx-auto px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-base font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col space-y-3 border-t border-gray-100 mt-3">
              <a 
                href="tel:+551143264252"
                className="flex items-center text-gray-700 hover:text-primary"
              >
                <Phone className="h-5 w-5 mr-2" />
                (11) 4326-4252
              </a>
              <WhatsAppButton className="w-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
