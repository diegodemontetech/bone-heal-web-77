
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";

const AutoChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showInitialPopup, setShowInitialPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Olá! Como posso te ajudar hoje?", isUser: false }
  ]);

  useEffect(() => {
    // Show initial popup after 5 seconds
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowInitialPopup(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, isUser: true }]);
      setMessage("");
      
      // Simulate response after a short delay
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            text: "Obrigado por entrar em contato! Um de nossos especialistas entrará em contato em breve. Você pode continuar sua navegação enquanto isso.", 
            isUser: false 
          }
        ]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowInitialPopup(false);
  };

  return (
    <>
      {/* Initial Popup */}
      {showInitialPopup && (
        <div className="fixed bottom-24 right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-80 animate-bounce">
          <button 
            onClick={() => setShowInitialPopup(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
          <p className="text-sm mb-3">Olá! Posso ajudar com informações sobre nossos produtos?</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowInitialPopup(false)}
            >
              Agora não
            </Button>
            <Button 
              size="sm"
              className="bg-primary"
              onClick={() => {
                setShowInitialPopup(false);
                setIsOpen(true);
              }}
            >
              Conversar
            </Button>
          </div>
        </div>
      )}
      
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 flex items-center justify-center transition-all ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <MessageCircle className="text-white" size={24} />
        )}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg z-50 w-80 md:w-96 flex flex-col max-h-[500px] border border-gray-200">
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-medium">Chat com a Bone Heal</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] max-h-[350px]">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isUser 
                      ? 'bg-primary/10 text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-3 flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 mr-2"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-primary text-white"
              size="icon"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AutoChat;
