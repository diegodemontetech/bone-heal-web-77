
import { useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Fale com Maria</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;

