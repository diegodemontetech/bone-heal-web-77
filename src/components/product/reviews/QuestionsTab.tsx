
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import QuestionForm from "./QuestionForm";

const QuestionsTab = () => {
  const [question, setQuestion] = useState("");
  const session = useSession();
  const { toast } = useToast();

  const submitQuestion = () => {
    if (!session) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para enviar uma pergunta",
        variant: "destructive"
      });
      return;
    }

    if (!question.trim()) {
      toast({
        title: "Pergunta vazia",
        description: "Por favor, escreva sua pergunta",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pergunta enviada",
      description: "Obrigado por sua pergunta! Nossa equipe responderá em breve."
    });

    setQuestion("");
  };

  return (
    <>
      <QuestionForm 
        question={question} 
        setQuestion={setQuestion} 
        submitQuestion={submitQuestion} 
      />
      
      <div className="space-y-4 mt-6">
        <p className="text-center py-6 text-gray-500">
          Este produto ainda não tem perguntas. Faça a primeira!
        </p>
      </div>
    </>
  );
};

export default QuestionsTab;
