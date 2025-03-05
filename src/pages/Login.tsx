
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegistrationForm from "@/components/auth/RegistrationForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client"; 

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading, profile, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<any>(null);

  const from = location.state?.from?.pathname || location.state?.from || "/profile";

  // Verificar a sessão atual usando diretamente o cliente Supabase
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!error && data.session) {
          console.log("Sessão ativa encontrada:", data.session);
          setCurrentSession(data.session);
        } else {
          console.log("Nenhuma sessão ativa encontrada");
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setSessionLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Verificar se o usuário está autenticado e redirecionar apropriadamente
  useEffect(() => {
    // Esperar até que tanto o profile quanto a sessão tenham sido verificados
    if (isLoading || sessionLoading) return;
    
    // Se temos um profile OU uma sessão válida, o usuário está autenticado
    const isAuthenticated = profile?.id || currentSession?.user?.id;
    
    if (isAuthenticated) {
      console.log("Usuário autenticado:", profile || currentSession?.user, "isAdmin:", isAdmin);
      
      // Verificar o tipo de usuário e redirecionar
      if (isAdmin) {
        console.log("Redirecionando admin para /admin/dashboard");
        navigate("/admin/dashboard");
      } else {
        // Para usuários normais, redirecionar para a página específica ou para profile
        console.log("Redirecionando usuário normal para:", from);
        navigate(from);
      }
    }
  }, [isLoading, profile, isAdmin, navigate, from, sessionLoading, currentSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoginLoading(true);
      await signIn(email, password);
      // O redirecionamento é feito pelo useEffect quando o profile for carregado
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setLoginLoading(false);
    }
  };

  // Se estiver carregando, mostra o loader
  if (isLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Se o usuário já estiver logado, mostra apenas o loader enquanto redireciona
  if (profile?.id || currentSession?.user?.id) {
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
          
          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Seu email"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Sua senha"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <RegistrationForm />
            </TabsContent>
          </Tabs>

          <Alert className="mt-4">
            <AlertDescription>
              Se você acabou de se registrar, verifique seu email para confirmar sua conta antes de fazer login.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

export default Login;
