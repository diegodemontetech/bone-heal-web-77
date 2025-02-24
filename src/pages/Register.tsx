
import { Card, CardContent } from "@/components/ui/card";
import RegistrationForm from "@/components/auth/RegistrationForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-purple-900">Registro</h1>
            <p className="mt-2 text-lg text-purple-600">
              Crie sua conta para começar
            </p>
          </div>
          <Card className="border-purple-100">
            <CardContent className="p-6">
              <RegistrationForm />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
