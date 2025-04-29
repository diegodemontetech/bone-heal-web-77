
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img src="/logo.png" alt="Bone Heal Logo" className="h-10 mr-2" />
              <span className="text-xl font-bold">Bone Heal</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Soluções avançadas para regeneração óssea e tecidual em odontologia.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/estudos" className="text-gray-400 hover:text-white transition-colors">
                  Estudos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-400 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">Nossos Produtos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Heal Bone
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Bone Heal
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Membranas
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Instrumentais
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-400 hover:text-white transition-colors">
                  Ver Todos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  (11) 4326-4252
                </span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  contato@boneheal.com.br
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">
                  São Paulo - SP, Brasil
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Bone Heal. Todos os direitos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/terms" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
