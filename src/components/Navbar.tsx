import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = [
    { name: 'Produtos', href: '/products' },
    { name: 'Como Funciona', href: '/how-it-works' },
    { name: 'Estudos Científicos', href: '/studies' },
    { name: 'Notícias', href: '/news' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-neutral-200/50">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="https://c5gwmsmjx1.execute-api.us-east-1.amazonaws.com/prod/dados_processo_seletivo/logo_empresa/167858/bone-heal-logo-01.png" 
                   alt="Bone Heal" 
                   className="h-12" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-neutral-600 hover:text-primary transition-colors duration-200 font-medium tracking-wide text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <div className="hidden lg:flex items-center">
            <Link 
              to="/login" 
              className="flex items-center space-x-2 bg-primary text-white px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-primary-dark"
            >
              <User className="h-5 w-5" />
              <span className="font-medium text-sm">Área do Dentista</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute left-0 right-0 bg-white border-b">
            <div className="px-4 pt-2 pb-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2.5 text-neutral-600 hover:text-primary transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link 
                to="/login" 
                className="flex items-center space-x-2 px-3 py-2.5 text-primary"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Área do Dentista</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;