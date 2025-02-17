
import { useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

const WhatsAppWidget = () => {
  const location = useLocation();
  const session = useSession();
  
  // Não mostrar o widget se estiver logado ou na área admin
  if (session || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>Fale com Maria</span>
      </a>
    </div>
  );
};

export default WhatsAppWidget;
