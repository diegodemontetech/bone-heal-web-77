
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoginForm from "./LoginForm";
import RegistrationForm from "./RegistrationForm";

const LoginTabs = () => {
  return (
    <>
      <Tabs defaultValue="login" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Cadastrar</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm />
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
    </>
  );
};

export default LoginTabs;
