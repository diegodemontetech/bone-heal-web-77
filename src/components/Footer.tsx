import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <img 
              src="https://c5gwmsmjx1.execute-api.us-east-1.amazonaws.com/prod/dados_processo_seletivo/logo_empresa/167858/bone-heal-logo-01.png"
              alt="Bone Heal"
              className="h-12 mb-6 brightness-0 invert"
            />
            <p className="text-neutral-400 mb-6">
              Inovação em regeneração óssea para procedimentos odontológicos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-neutral-400 hover:text-white transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/studies" className="text-neutral-400 hover:text-white transition-colors">
                  Estudos Científicos
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-neutral-400 hover:text-white transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-neutral-400">
                <Phone className="h-5 w-5" />
                <span>(11) 1234-5678</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-400">
                <Mail className="h-5 w-5" />
                <span>contato@boneheal.com.br</span>
              </li>
              <li className="flex items-center space-x-3 text-neutral-400">
                <MapPin className="h-5 w-5" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6">Newsletter</h3>
            <p className="text-neutral-400 mb-4">
              Inscreva-se para receber novidades e atualizações.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark transition-colors text-white font-medium"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © 2024 Bone Heal. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="text-neutral-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;