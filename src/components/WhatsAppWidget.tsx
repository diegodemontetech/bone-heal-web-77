import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [currentInput, setCurrentInput] = useState<'name' | 'phone' | null>(null);
  const [hasInterest, setHasInterest] = useState<boolean | null>(null);

  const messages = [
    {
      text: "Olá! 👋 Sou a Maria, consultora da Bone Heal.",
      delay: 1000
    },
    {
      text: "Gostaria de saber mais sobre como se tornar um Dentista parceiro da Bone Heal?",
      delay: 3000,
      showInterestButtons: true
    }
  ];

  const handleInterest = async (interested: boolean) => {
    setHasInterest(interested);
    if (interested) {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      setCurrentInput('name');
      setShowInput(true);
    } else {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      handleSubmit();
    }
  };

  const handleInputSubmit = async (value: string) => {
    if (currentInput === 'name') {
      setName(value);
      setShowInput(false);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      setCurrentInput('phone');
      setShowInput(true);
    } else if (currentInput === 'phone') {
      setPhone(value);
      setShowInput(false);
      handleSubmit();
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('contact_leads')
        .insert([
          {
            name,
            phone,
            reason: hasInterest ? 'Interessado em parceria' : 'Não interessado',
            source: 'whatsapp_widget'
          }
        ]);

      if (error) throw error;

      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsTyping(false);
      
      toast.success('Obrigado pelo contato!');
      
      // Wait a bit before minimizing
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-2xl w-[380px] overflow-hidden"
            >
              <div className="bg-primary p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                        alt="Maria - Consultora Bone Heal" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-white font-semibold">Maria</h3>
                    <span className="text-white/80 text-sm">Online</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4 h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: step > index ? 1 : 0, x: step > index ? 0 : -20 }}
                      transition={{ delay: message.delay / 1000 }}
                      className="bg-neutral-100 p-3 rounded-lg max-w-[80%] flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Maria" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        {message.text}
                        {message.showInterestButtons && hasInterest === null && (
                          <div className="mt-3 space-x-2">
                            <button
                              onClick={() => handleInterest(true)}
                              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                            >
                              Sim
                            </button>
                            <button
                              onClick={() => handleInterest(false)}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                              Não
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {hasInterest === true && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-neutral-100 p-3 rounded-lg max-w-[80%] flex items-start space-x-2"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                            alt="Maria" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          {currentInput === 'name' ? "Qual é o seu nome?" : "Qual é o seu telefone?"}
                        </div>
                      </motion.div>
                    </>
                  )}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-neutral-100 p-3 rounded-lg max-w-[80%] flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Maria" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                      </div>
                    </motion.div>
                  )}
                </div>

                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex space-x-2"
                  >
                    <input
                      type={currentInput === 'phone' ? 'tel' : 'text'}
                      value={currentInput === 'phone' ? phone : name}
                      onChange={(e) => {
                        if (currentInput === 'phone') {
                          setPhone(formatPhone(e.target.value));
                        } else {
                          setName(e.target.value);
                        }
                      }}
                      placeholder={currentInput === 'phone' ? "Seu telefone" : "Seu nome"}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <button
                      onClick={() => handleInputSubmit(currentInput === 'phone' ? phone : name)}
                      className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppWidget;