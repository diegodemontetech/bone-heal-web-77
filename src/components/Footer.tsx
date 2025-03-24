
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, ChevronRight } from "lucide-react";
import { Logo } from "@/components/navbar/Logo";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Coluna 1 - Logo e Sobre */}
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-neutral-400 mb-6">
              A Bone Heal é referência em dispositivos médicos implantáveis de polipropileno para Regeneração Óssea Guiada, com reconhecimento internacional.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/boneheal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
              >
                <Instagram />
              </a>
              <a 
                href="https://www.facebook.com/boneheal/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
              >
                <Facebook />
              </a>
              <a 
                href="https://www.youtube.com/channel/UC6oMsiAHK_Z4S9XpyQ0K5Cw" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-primary transition-colors"
              >
                <Youtube />
              </a>
            </div>
          </div>
          
          {/* Coluna 2 - Links Úteis */}
          <div>
            <h3 className="font-bold text-xl mb-6">Links Úteis</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Nossa História
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/studies" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Artigos Científicos
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Notícias
                </Link>
              </li>
              <li>
                <Link to="/politica-troca" className="text-neutral-400 hover:text-white transition-colors flex items-center">
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Política de Troca e Cancelamento
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Coluna 3 - Contato */}
          <div>
            <h3 className="font-bold text-xl mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary mt-1" />
                <span className="text-neutral-400">Rua Anália Franco, 336 - Vila Reg. Feijó, São Paulo - SP, 03344-040</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary" />
                <span className="text-neutral-400">(11) 94512-2884</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary" />
                <span className="text-neutral-400">vendas@boneheal.com.br</span>
              </li>
            </ul>
          </div>
          
          {/* Coluna 4 - Horário de Funcionamento */}
          <div>
            <h3 className="font-bold text-xl mb-6">Horário de Funcionamento</h3>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex justify-between">
                <span>Segunda à Quinta:</span>
                <span>8h às 17h50</span>
              </li>
              <li className="flex justify-between">
                <span>Sexta:</span>
                <span>8h às 16h50</span>
              </li>
              <li className="flex justify-between">
                <span>Sábado e Domingo:</span>
                <span>Fechado</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-6 pb-8 text-center text-neutral-500">
          <p>© {new Date().getFullYear()} Bone Heal. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
