
import { useWhatsAppMessages } from './hooks/useWhatsAppMessages';
import ChatHeader from './chat/ChatHeader';
import MessagesList from './chat/MessagesList';
import MessageInput from './chat/MessageInput';
import EmptyChat from './chat/EmptyChat';

interface WhatsAppChatProps {
  selectedLead: any;
  onMessageSent: () => void;
}

const WhatsAppChat = ({ selectedLead, onMessageSent }: WhatsAppChatProps) => {
  const { messages, loading, sendMessage } = useWhatsAppMessages(selectedLead, onMessageSent);

  if (!selectedLead) {
    return <EmptyChat />;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader selectedLead={selectedLead} />
      
      <div className="flex-1 p-4 overflow-auto bg-gray-50">
        <MessagesList messages={messages} loading={loading} />
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default WhatsAppChat;
