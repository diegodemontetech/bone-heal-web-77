
import { Card, CardContent } from "@/components/ui/card";
import RegistrationForm from "@/components/auth/RegistrationForm";

const Register = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Registro</h1>
          <p className="text-gray-600 mb-6">
            Preencha o formulário abaixo para criar sua conta de dentista. 
            Suas informações serão automaticamente sincronizadas com nosso sistema 
            de gestão após o cadastro.
          </p>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
