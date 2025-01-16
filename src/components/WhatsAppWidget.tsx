import { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

const WhatsAppWidget = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [currentInput, setCurrentInput] = useState<'name' | 'phone' | null>(null);
  const [hasInterest, setHasInterest] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<Array<{ text: string; delay: number; showInterestButtons?: boolean; isUser?: boolean }>>([]);
  const { toast } = useToast();

  // Fetch configurable messages
  const { data: configMessages, isLoading } = useQuery({
    queryKey: ["whatsapp-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_messages_config")
        .select("*");
      
      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          description: "Não foi possível carregar as mensagens. Por favor, tente novamente.",
          variant: "destructive"
        });
        throw error;
      }
      
      return data.reduce((acc, curr) => ({
        ...acc,
        [curr.message_key]: curr.message_text
      }), {} as Record<string, string>);
    },
  });

  useEffect(() => {
    // Show widget after 5 seconds only if messages are loaded
    if (!isLoading && configMessages) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Start conversation immediately
        startConversation();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, configMessages]);

  const startConversation = async () => {
    if (!configMessages) {
      console.error("No config messages available");
      return;
    }

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages([
      {
        text: configMessages.greeting || "Olá! Como posso ajudar?",
        delay: 0
      }
    ]);
    setStep(1);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMessages(prev => [...prev, {
      text: configMessages.partnership_question || "Você tem interesse em ser um parceiro Bone Heal?",
      delay: 0,
      showInterestButtons: true
    }]);
    setStep(2);
    setIsTyping(false);
  };

  const handleInterest = async (interested: boolean) => {
    setHasInterest(interested);
    setMessages(prev => [...prev, {
      text: interested ? "Sim" : "Não",
      delay: 0,
      isUser: true
    }]);
    
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
      setMessages(prev => [...prev, {
        text: value,
        delay: 0,
        isUser: true
      }]);
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, {
        text: `Qual é o seu telefone ${value.toLowerCase()}? (ex: 11999999999)`,
        delay: 0
      }]);
      setIsTyping(false);
      setCurrentInput('phone');
      setShowInput(true);
    } else if (currentInput === 'phone') {
      // Validate phone number format
      const phoneNumber = value.replace(/\D/g, '');
      if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        toast({
          description: 'Por favor, insira um número de telefone válido com DDD',
          variant: "destructive"
        });
        return;
      }
      setPhone(value);
      setShowInput(false);
      setMessages(prev => [...prev, {
        text: value,
        delay: 0,
        isUser: true
      }]);
      setCurrentInput(null); // Important: Set to null to prevent further input
      handleSubmit(value);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (phoneValue?: string) => {
    if (!configMessages) return;

    try {
      const { error } = await supabase
        .from('contact_leads')
        .insert([
          {
            name,
            phone: phoneValue || phone,
            reason: hasInterest ? 'Interessado em parceria' : 'Não interessado',
            source: 'whatsapp_widget'
          }
        ]);

      if (error) throw error;

      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessages(prev => [...prev, {
        text: configMessages.thank_you.replace('{name}', name.toLowerCase()),
        delay: 0
      }]);
      setIsTyping(false);
      
      toast({
        description: 'Obrigado pelo contato!'
      });
      
      // Wait 10 seconds before minimizing
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    } catch (error) {
      console.error('Error:', error);
      toast({
        description: 'Erro ao enviar mensagem. Tente novamente.',
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return null; // Don't render anything while loading
  }

  const renderMessage = (message: { text: string; isUser?: boolean; showInterestButtons?: boolean }, index: number) => {
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!message.isUser && (
          <div className="flex-shrink-0 mr-3">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                alt="Maria" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
            message.isUser 
              ? 'bg-pink-50 text-black' 
              : 'bg-gray-100 text-black'
          }`}
        >
          <p className="text-sm">{message.text}</p>
          {message.showInterestButtons && hasInterest === null && (
            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleInterest(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
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
    );
  };

  return (
    <AnimatePresence>
      {isVisible && configMessages && (
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
              <div className="bg-[#8B2F4B] p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Maria" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#8B2F4B]"></div>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-white font-semibold text-lg">Maria</h3>
                      <span className="text-white/80 text-sm">Online</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-4 h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-2">
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {isTyping && (
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80" 
                          alt="Maria" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="bg-gray-100 rounded-full px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {showInput && (
                  <div className="mt-4 flex space-x-2">
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
                      placeholder={
                        currentInput === 'phone' 
                          ? "Seu telefone com DDD (ex: 11999999999)" 
                          : "Seu nome"
                      }
                      className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => handleInputSubmit(currentInput === 'phone' ? phone : name)}
                      className="bg-[#8B2F4B] text-white p-3 rounded-lg hover:bg-[#8B2F4B]/90 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
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
