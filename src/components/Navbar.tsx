import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSession } from '@supabase/auth-helpers-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const session = useSession();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Produtos', href: '/products' },
    { name: 'Como Funciona', href: '/how-it-works' },
    { name: 'Estudos Científicos', href: '/studies' },
    { name: 'Notícias', href: '/news' },
    { name: 'Sobre', href: '/about' },
    { name: 'Contato', href: '/contact' },
  ];

  const handleDentistAreaClick = () => {
    if (!session) {
      navigate('/login');
    } else {
      navigate('/products');
    }
    setIsOpen(false);
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed w-full bg-white shadow-md z-50"
    >
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="flex justify-between items-center h-24">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="https://c5gwmsmjx1.execute-api.us-east-1.amazonaws.com/prod/dados_processo_seletivo/logo_empresa/167858/bone-heal-logo-01.png" 
                   alt="Bone Heal" 
                   className="h-[calc(100%-4px)] md:h-[calc(100%-10px)] max-h-20" />
            </Link>
          </div>

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

          <div className="hidden lg:flex items-center">
            <button 
              onClick={handleDentistAreaClick}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Área do Dentista</span>
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-neutral-600 hover:text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute left-0 right-0 bg-white border-b shadow-lg"
          >
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
              <button 
                onClick={handleDentistAreaClick}
                className="flex items-center space-x-2 px-3 py-2.5 text-primary w-full text-left"
              >
                <User className="h-5 w-5" />
                <span className="font-medium">Área do Dentista</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;