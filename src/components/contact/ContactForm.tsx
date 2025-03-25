
import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useContactFormSubmit } from './hooks/useContactFormSubmit';

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  
  const { handleSubmit, isSubmitting } = useContactFormSubmit({ 
    name, 
    phone, 
    email, 
    department, 
    message, 
    onSuccess: () => setIsSubmitted(true) 
  });

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

  const departments = [
    { id: 1, department: 'Comercial' },
    { id: 2, department: 'Logística' },
    { id: 3, department: 'Administrativo' },
    { id: 4, department: 'Suporte Técnico' },
    { id: 5, department: 'Consultoria' },
  ];

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg flex flex-col items-center justify-center text-center h-full">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <MessageSquare className="w-12 h-12 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-primary mb-4">Obrigado pelo Contato!</h3>
        <p className="text-lg text-gray-600">
          Recebemos sua mensagem e entraremos em contato o mais breve possível.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-lg space-y-5 h-full">
      <h3 className="text-xl font-bold text-primary mb-4">Envie uma mensagem</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">Departamento<span className="text-red-500">*</span></label>
        <Select 
          value={department} 
          onValueChange={setDepartment}
          required
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Selecione um departamento" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.department}>
                {dept.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nome<span className="text-red-500">*</span></label>
        <Input
          type="text"
          className="w-full"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            className="w-full"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Telefone<span className="text-red-500">*</span></label>
          <Input
            type="tel"
            className="w-full"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={handlePhoneChange}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Mensagem</label>
        <textarea
          className="w-full h-32 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Sua mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 bg-primary hover:bg-primary-light transition-colors duration-200 rounded-lg text-white font-semibold"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  );
};

export default ContactForm;
