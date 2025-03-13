
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const LoginForm = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoginLoading(true);
      await signIn(email, password);
      // O redirecionamento é feito pelo useEffect quando o profile for carregado
    } catch (error: any) {
      // Exibir mensagem de erro específica
      const errorMessage = error?.message || "Erro ao fazer login. Tente novamente.";
      setLoginError(errorMessage);
      console.error("Erro de login:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}
        
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
              disabled={loginLoading}
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
              disabled={loginLoading}
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
  );
};

export default LoginForm;
