
import React from 'react';
import { MessageCircle, User } from 'lucide-react';

interface Question {
  id: string;
  author: string;
  role: string;
  date: string;
  content: string;
  answer: {
    author: string;
    date: string;
    content: string;
  };
}

interface ProductQuestionsProps {
  productId: string;
}

const ProductQuestions = ({ productId }: ProductQuestionsProps) => {
  // Estas são perguntas artificiais para demonstração
  const questions: Question[] = [
    {
      id: "1",
      author: "Ricardo Mendes",
      role: "Dentista",
      date: "15 de maio de 2022",
      content: "Qual o tempo de permanência recomendado para a membrana Bone Heal após a exodontia?",
      answer: {
        author: "Equipe Bone Heal",
        date: "17 de maio de 2022",
        content: "O tempo de permanência da membrana Bone Heal varia de acordo com o caso clínico. Normalmente, pode ser removida a partir de 7 dias, tempo suficiente para a formação do tecido de granulação. Todavia, nada impede que seja removida depois de 7 dias, não havendo necessidade de deixá-la até 28 dias."
      }
    },
    {
      id: "2",
      author: "Eduardo Nascimento",
      role: "Cirurgião-Dentista",
      date: "17 de março de 2024",
      content: "Qual a vida útil/validade das membranas Bone Heal e Heal Bone após a abertura da embalagem?",
      answer: {
        author: "Equipe Bone Heal",
        date: "18 de março de 2024",
        content: "A validade é de 3 anos a partir da data de fabricação, conforme indicado na embalagem."
      }
    },
    {
      id: "3",
      author: "Matheus Silva",
      role: "Dentista",
      date: "18 de março de 2023",
      content: "A membrana pode ser utilizada em pacientes com diabetes controlada?",
      answer: {
        author: "Equipe Bone Heal",
        date: "20 de março de 2023",
        content: "Tanto Bone Heal® quanto Heal Bone® podem ser usadas em qualquer paciente que possa ser submetido à cirurgia de exodontia. Os cuidados pré e pós-operatórios dependem da avaliação sistêmica."
      }
    },
    {
      id: "4",
      author: "Rogério Campos",
      role: "Dentista",
      date: "22 de novembro de 2023",
      content: "Posso associar a membrana Bone Heal com biomateriais de enxerto ósseo?",
      answer: {
        author: "Equipe Bone Heal",
        date: "23 de novembro de 2023",
        content: "Sim, a membrana Bone Heal® ou Heal Bone® pode ser perfeitamente associada com biomateriais de enxerto ósseo. Um dos grandes diferenciais da técnica ROG-M (Regeneração Óssea Guiada Modificada) com Bone Heal® é justamente trabalhar apenas com o coágulo sanguíneo, pois todos os biomateriais, sem exceção, interferem na osteogênese."
      }
    },
    {
      id: "5",
      author: "Felipe Albuquerque",
      role: "Cirurgião-Dentista",
      date: "10 de setembro de 2022",
      content: "Qual a diferença entre o Bone Heal e o Heal Bone? Em quais casos devo escolher um ou outro?",
      answer: {
        author: "Equipe Bone Heal",
        date: "12 de setembro de 2022",
        content: "Tanto o Bone Heal® quanto o Heal Bone® são membranas não-reabsorvíveis de polipropileno para regeneração óssea guiada. A principal diferença está na no processo fabril. Heal Bone® foi projetada para permanecer até 28 dias implantada. Bone Heal® pode ser deixada por tempo indeterminado."
      }
    },
    {
      id: "6",
      author: "Carolina Ferreira",
      role: "Implantodontista",
      date: "23 de julho de 2022",
      content: "A membrana Bone Heal pode ser usada em casos de implante imediato?",
      answer: {
        author: "Equipe Bone Heal",
        date: "24 de julho de 2022",
        content: "Sim, a membrana Bone Heal® é altamente recomendada para casos de implantes imediatos. É imprescindível que haja espaço entre o implante e a Bone Heal® ou Heal Bone®. Quanto maior for o gap mais previsível o resultado."
      }
    },
    {
      id: "7",
      author: "Paulo Roberto",
      role: "Implantodontista",
      date: "07 de junho de 2023",
      content: "É possível usar o Bone Heal em casos de preservação alveolar pós-extração de dentes com lesão periapical?",
      answer: {
        author: "Equipe Bone Heal",
        date: "08 de junho de 2023",
        content: "Sim, o Bone Heal® ou Heal Bone® podem ser indicados também para casos de preservação alveolar após extração de dentes com lesão periapical, desde que se trate de lesões crônicas."
      }
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-12">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        Perguntas Frequentes
      </h2>

      <div className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="border-b border-gray-100 pb-6 last:border-0">
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="bg-gray-100 h-10 w-10 rounded-full flex items-center justify-center text-gray-600 font-medium">
                  {question.author.charAt(0)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{question.author}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">{question.role}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{question.date}</p>
                <p className="font-medium text-gray-800">{question.content}</p>
              </div>
            </div>

            {question.answer && (
              <div className="ml-12 pl-4 border-l-2 border-primary/20">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium text-xs">
                      BH
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">{question.answer.author}</span>
                      <span className="text-xs text-gray-500">{question.answer.date}</span>
                    </div>
                    <p className="text-gray-700 mt-1">{question.answer.content}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductQuestions;
