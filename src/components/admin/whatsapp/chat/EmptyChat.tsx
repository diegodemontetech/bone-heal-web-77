
import { MessageSquare } from 'lucide-react';

const EmptyChat = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-primary/10 p-3 rounded-full mb-4">
        <MessageSquare className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">Selecione um contato</h3>
      <p className="text-muted-foreground max-w-md">
        Escolha um contato na lista à esquerda para iniciar ou continuar uma conversa.
      </p>
    </div>
  );
};

export default EmptyChat;
