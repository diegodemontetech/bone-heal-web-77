
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface ProductQuestionsProps {
  productId: string;
}

const ProductQuestions = ({ productId }: ProductQuestionsProps) => {
  // In a real implementation, you would fetch questions from an API
  // For now, using sample data based on the provided questions
  const [questions] = useState([
    {
      id: "1",
      question: "Qual o tempo de permanência recomendado para a membrana Bone Heal após a exodontia?",
      answer: "O tempo de permanência da membrana Bone Heal varia de acordo com o caso clínico. Normalmente, pode ser removida a partir de 7 dias, tempo suficiente para a formação do tecido de granulação. Todavia, nada impede que seja removida depois de 7 dias, não havendo necessidade de deixá-la até 28 dias.",
      asker: {
        name: "Ricardo Mendes",
        role: "Dentista",
        initial: "R"
      },
      date: "15 de maio de 2022",
      answerDate: "17 de maio de 2022"
    },
    {
      id: "2",
      question: "Qual a vida útil/validade das membranas Bone Heal e Heal Bone após a abertura da embalagem?",
      answer: "A validade é de 3 anos a partir da data de fabricação, conforme indicado na embalagem.",
      asker: {
        name: "Eduardo Nascimento",
        role: "Cirurgião-Dentista",
        initial: "E"
      },
      date: "17 de março de 2024",
      answerDate: "18 de março de 2024"
    },
    {
      id: "3",
      question: "A membrana pode ser utilizada em pacientes com diabetes controlada?",
      answer: "Tanto Bone Heal® quanto Heal Bone® podem ser usadas em qualquer paciente que possa ser submetido à cirurgia de exodontia. Os cuidados pré e pós-operatórios dependem da avaliação sistêmica.",
      asker: {
        name: "Matheus Silva",
        role: "Dentista",
        initial: "M"
      },
      date: "18 de março de 2023",
      answerDate: "20 de março de 2023"
    },
    {
      id: "4",
      question: "Posso associar a membrana Bone Heal com biomateriais de enxerto ósseo?",
      answer: "Sim, a membrana Bone Heal® ou Heal Bone® pode ser perfeitamente associada com biomateriais de enxerto ósseo. Um dos grandes diferenciais da técnica ROG-M (Regeneração Óssea Guiada Modificada) com Bone Heal® é justamente trabalhar apenas com o coágulo sanguíneo, pois todos os biomateriais, sem exceção, interferem na osteogênese.",
      asker: {
        name: "Rogério Campos",
        role: "Dentista",
        initial: "R"
      },
      date: "22 de novembro de 2023",
      answerDate: "23 de novembro de 2023"
    },
    {
      id: "5",
      question: "Qual a diferença entre o Bone Heal e o Heal Bone? Em quais casos devo escolher um ou outro?",
      answer: "Tanto o Bone Heal® quanto o Heal Bone® são membranas não-reabsorvíveis de polipropileno para regeneração óssea guiada. A principal diferença está na no processo fabril. Heal Bone® foi projetada para permanecer até 28 dias implantada. Bone Heal® pode ser deixada por tempo indeterminado.",
      asker: {
        name: "Felipe Albuquerque",
        role: "Cirurgião-Dentista",
        initial: "F"
      },
      date: "10 de setembro de 2022",
      answerDate: "12 de setembro de 2022"
    },
    {
      id: "6",
      question: "A membrana Bone Heal pode ser usada em casos de implante imediato?",
      answer: "Sim, a membrana Bone Heal® é altamente recomendada para casos de implantes imediatos. É imprescindível que haja espaço entre o implante e a Bone Heal® ou Heal Bone®. Quanto maior for o gap mais previsível o resultado.",
      asker: {
        name: "Carolina Ferreira",
        role: "Implantodontista",
        initial: "C"
      },
      date: "23 de julho de 2022",
      answerDate: "24 de julho de 2022"
    },
    {
      id: "7",
      question: "É possível usar o Bone Heal em casos de preservação alveolar pós-extração de dentes com lesão periapical?",
      answer: "Sim, o Bone Heal® ou Heal Bone® podem ser indicados também para casos de preservação alveolar após extração de dentes com lesão periapical, desde que se trate de lesões crônicas.",
      asker: {
        name: "Paulo Roberto",
        role: "Implantodontista",
        initial: "P"
      },
      date: "07 de junho de 2023",
      answerDate: "08 de junho de 2023"
    },
  ]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Perguntas e Respostas</h2>
      
      <div className="space-y-6">
        {questions.map((item) => (
          <div key={item.id} className="pb-6">
            <div className="flex items-start gap-4 mb-3">
              <Avatar className="h-10 w-10 bg-primary text-white">
                <span>{item.asker.initial}</span>
              </Avatar>
              <div>
                <div className="flex flex-col">
                  <span className="font-medium">{item.asker.name}</span>
                  <span className="text-sm text-gray-500">{item.asker.role} • {item.date}</span>
                </div>
                <p className="mt-2 text-gray-800 font-medium">{item.question}</p>
              </div>
            </div>
            
            <div className="ml-14 mt-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8 bg-blue-600 text-white">
                  <span>BH</span>
                </Avatar>
                <div>
                  <span className="font-medium">Equipe Bone Heal</span>
                  <span className="text-xs text-gray-500 ml-2">{item.answerDate}</span>
                </div>
              </div>
              <p className="text-gray-700">{item.answer}</p>
            </div>
            
            {questions.indexOf(item) < questions.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQuestions;
