
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { QuestionFormProps } from "./types";

const QuestionForm = ({ question, setQuestion, submitQuestion }: QuestionFormProps) => {
  const session = useSession();

  if (!session) return null;

  return (
    <div className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <h4 className="text-md font-medium">Tire dúvidas sobre o produto</h4>
      <Textarea 
        placeholder="Escreva sua pergunta aqui..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="bg-white"
      />
      <Button 
        onClick={submitQuestion}
        className="bg-primary hover:bg-primary/90 text-white"
      >
        Fazer uma pergunta
      </Button>
    </div>
  );
};

export default QuestionForm;
