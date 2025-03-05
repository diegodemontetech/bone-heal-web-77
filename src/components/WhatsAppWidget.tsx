
import { useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppWidget = () => {
  const location = useLocation();
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    // Mostrar widget após 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Não mostrar o widget se estiver logado ou na área admin
  if (session || location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Abre WhatsApp com a mensagem predefinida
    window.open(
      `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    
    setMessage("");
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-lg w-80"
            >
              {/* Header */}
              <div className="bg-green-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-white">
                    <img
                      src="/img/maria-profile.jpg"
                      alt="Maria"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/50?text=M";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Maria</p>
                    <p className="text-xs opacity-80">Consultora Bone Heal</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-white hover:bg-green-600 rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-4 bg-gray-50 h-60 overflow-y-auto">
                <div className="bg-green-100 p-3 rounded-lg inline-block max-w-[80%] mb-2">
                  <p className="text-sm">Olá! Sou a Maria da Bone Heal. Como posso te ajudar hoje?</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg inline-block max-w-[80%]">
                  <p className="text-sm">Precisa de informações sobre nossos produtos ou processos de compra?</p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="p-3 border-t flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 bg-green-500 text-white rounded-full p-2 hover:bg-green-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Fale com Maria</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;
