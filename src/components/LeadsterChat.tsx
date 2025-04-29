
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface LeadsterChatProps {
  title?: string;
  message?: string;
  phoneNumber?: string;
}

const LeadsterChat = ({ 
  title = "Converse com um especialista", 
  message = "Olá! Como posso ajudar você hoje?",
  phoneNumber = "5511943264252" 
}: LeadsterChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Abrir chat após 5 segundos na página
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formatar a mensagem para o WhatsApp
    const whatsappMessage = `Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}
Mensagem: ${formData.message}`;
    
    // Redirecionar para WhatsApp
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`,
      "_blank"
    );
    
    // Fechar o chat após envio
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-50 w-80 sm:w-96"
          >
            <Card className="overflow-hidden shadow-lg border-primary/20">
              <div className="bg-primary text-white p-4">
                <h3 className="font-bold">{title}</h3>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="absolute top-3 right-3 text-white hover:text-gray-200"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                {!showChat ? (
                  <div className="space-y-4">
                    <p>{message}</p>
                    <Button 
                      onClick={() => setShowChat(true)} 
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      Iniciar conversa
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="Seu e-mail"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        name="phone"
                        placeholder="Seu telefone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Textarea
                        name="message"
                        placeholder="Sua mensagem"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Enviar
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-primary text-white rounded-full p-3 shadow-lg flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </motion.button>
    </>
  );
};

export default LeadsterChat;
