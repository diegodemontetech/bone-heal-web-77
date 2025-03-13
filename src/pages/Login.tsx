
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import LoginTabs from "@/components/auth/LoginTabs";
import { useLoginPage } from "@/hooks/use-login-page";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Login = () => {
  const { 
    isLoading, 
    profile, 
    currentSession, 
    isAuthenticated,
    connectionError 
  } = useLoginPage();

  // Se houver erro de conexão, mostra mensagem e botão para tentar novamente
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não foi possível conectar ao servidor. Verifique sua conexão com a internet.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        </div>
        <Footer />
        <WhatsAppWidget />
      </div>
    );
  }

  // Se estiver carregando, mostra o loader com timeout
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Se o usuário já estiver logado, mostra apenas o loader enquanto redireciona
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p>Redirecionando para a sua área...</p>
        </div>
        <Footer />
        <WhatsAppWidget />
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
