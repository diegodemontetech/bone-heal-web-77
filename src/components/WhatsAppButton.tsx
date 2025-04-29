
import { Button, ButtonProps } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps extends ButtonProps {
  text?: string;
  phoneNumber?: string;
}

const WhatsAppButton = ({ 
  text = "Olá, gostaria de mais informações", 
  phoneNumber = "5511943264252", 
  className,
  ...props 
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      variant="outline" 
      className={`bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 ${className}`}
      onClick={handleClick}
      {...props}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      WhatsApp
    </Button>
  );
};

export default WhatsAppButton;
