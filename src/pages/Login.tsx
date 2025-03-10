
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LoginTabs from "@/components/auth/LoginTabs";
import { useLoginPage } from "@/hooks/use-login-page";

const Login = () => {
  const { isLoading, sessionLoading, profile, currentSession, isAuthenticated } = useLoginPage();

  // Se estiver carregando, mostra o loader
  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se o usuário já estiver logado, mostra apenas o loader enquanto redireciona
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p>Redirecionando para a sua área...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-8">Área do Dentista</h1>
          <LoginTabs />
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Login;
