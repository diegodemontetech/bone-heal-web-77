
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AutoChat from "@/components/AutoChat";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log("Form data:", data);
      toast.success("Mensagem enviada com sucesso! Em breve entraremos em contato.");
      reset();
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">Entre em Contato</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos prontos para ajudar com qualquer dúvida sobre nossos produtos e serviços
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      {...register("name", { required: "Nome é obrigatório" })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        {...register("email", { 
                          required: "Email é obrigatório",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido"
                          }
                        })}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        {...register("phone", { required: "Telefone é obrigatório" })}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      placeholder="Assunto da mensagem"
                      {...register("subject", { required: "Assunto é obrigatório" })}
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      placeholder="Sua mensagem"
                      rows={5}
                      {...register("message", { required: "Mensagem é obrigatória" })}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">●</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Telefone</h3>
                    <p className="text-gray-600">(11) 4326-4252</p>
                    <p className="text-gray-600">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">contato@boneheal.com.br</p>
                    <p className="text-gray-600">suporte@boneheal.com.br</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Endereço</h3>
                    <p className="text-gray-600">São Paulo - SP, Brasil</p>
                    <p className="text-gray-600">CEP: 00000-000</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4">Horário de Funcionamento</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
                    <span>Segunda a Sexta</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span>9:00 - 12:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AutoChat />
    </div>
  );
};

export default ContactPage;
