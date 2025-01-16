import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
                className="bg-white rounded-lg shadow-lg w-80 overflow-hidden"
              >
                <div className="bg-primary p-4 flex justify-between items-center">
                  <h3 className="text-white font-semibold">Fale Conosco</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-4">
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nome</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Telefone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={handlePhoneChange}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Motivo do Contato</label>
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full px-3 py-2 border rounded-md resize-none"
                          rows={3}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
                      >
                        Enviar Mensagem
                        <Send className="w-4 h-4 ml-2 inline" />
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <h4 className="font-semibold text-lg mb-2">Obrigado pelo contato!</h4>
                      <p className="text-gray-600">
                        Em breve, nossa equipe entrará em contato com você.
                      </p>
                    </div>
                  )}
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