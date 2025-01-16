import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const messages = [
    "Olá! 👋 Que bom ter você aqui!",
    "Gostaria de saber mais sobre como se tornar um Dentista parceiro da Bone Heal?",
    "Ótimo! Para melhor atendê-lo, precisamos de algumas informações:",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen && step < messages.length) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('contact_leads')
        .insert([
          {
            name,
            phone,
            reason,
            source: 'whatsapp_widget'
          }
        ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="relative"
          >
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-lg shadow-2xl w-[380px] overflow-hidden"
              >
                <div className="bg-primary p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <img src="/placeholder.svg" alt="Bone Heal" className="w-8 h-8 rounded-full" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-semibold">Bone Heal</h3>
                      <span className="text-white/80 text-sm">Online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-4 h-[400px] flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {messages.slice(0, step).map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-100 p-3 rounded-lg max-w-[80%]"
                      >
                        {message}
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-neutral-100 p-3 rounded-lg max-w-[80%]"
                      >
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {step >= messages.length && !submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="Seu telefone"
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          placeholder="Como podemos ajudar? (opcional)"
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows={3}
                        />
                      </motion.div>
                      <motion.button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        Enviar Mensagem
                        <Send className="w-4 h-4 ml-2" />
                      </motion.button>
                    </form>
                  ) : submitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-4"
                    >
                      <h4 className="font-semibold text-lg mb-2">Obrigado pelo contato!</h4>
                      <p className="text-gray-600">
                        Em breve, nossa equipe entrará em contato com você.
                      </p>
                    </motion.div>
                  ) : null}
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setIsOpen(true)}
                className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-dark transition-colors"
              >
                <MessageSquare className="h-6 w-6" />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;