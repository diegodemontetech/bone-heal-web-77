
import { useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { MessageSquareMore } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppWidget = () => {
  const location = useLocation();
  const session = useSession();
  const [isVisible, setIsVisible] = useState(false);
  
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

  const handleSalesContact = () => {
    window.open(
      `https://wa.me/5511945122884?text=${encodeURIComponent("Olá! Gostaria de informações sobre os produtos BoneHeal.")}`,
      "_blank"
    );
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
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            onClick={handleSalesContact}
            className="flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
          >
            <MessageSquareMore className="w-4 h-4" />
            <span className="text-sm font-medium">Fale com Comercial</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;
