
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection = () => {
  // Perguntas frequentes
  const faqs = [
    {
      pergunta: "Qual o tempo de permanência da membrana?",
      resposta: "A membrana BoneHeal não é reabsorvível e precisa ser removida em um segundo procedimento. O período de permanência ideal é geralmente de 7 a 15 dias. Em casos específicos, como quando se utiliza enxerto ósseo em conjunto, esse período pode ser estendido para até 30 dias."
    },
    {
      pergunta: "O procedimento é doloroso?",
      resposta: "O procedimento é realizado sob anestesia local, garantindo o conforto durante a aplicação. O pós-operatório geralmente apresenta desconforto mínimo, controlável com medicação comum para dor."
    },
    {
      pergunta: "Quanto tempo leva para formar o novo osso?",
      resposta: "A formação inicial do osso começa durante o período em que a membrana está em posição. Após a remoção da membrana, o processo de maturação óssea continua por semanas a meses, dependendo da extensão da área tratada."
    },
    {
      pergunta: "Quais cuidados devo ter após o procedimento?",
      resposta: "Manter uma higiene bucal rigorosa, escovando os dentes com cuidado e utilizando um enxaguante bucal recomendado. Evitar alimentos duros ou crocantes na área tratada. Aplicar compressas de gelo na face para reduzir o inchaço. Tomar a medicação prescrita pelo dentista (analgésicos e/ou antibióticos). Retornar às consultas de acompanhamento conforme agendado."
    },
    {
      pergunta: "Qualquer pessoa pode fazer esse procedimento?",
      resposta: "A maioria dos pacientes que necessitam de regeneração óssea pode se beneficiar do tratamento com BoneHeal. No entanto, algumas condições médicas como diabetes não controlado, uso de certos medicamentos ou tabagismo intenso podem afetar o resultado. Uma avaliação completa com seu dentista determinará se você é um bom candidato."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-primary">
          Perguntas Frequentes
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                  {faq.pergunta}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-0 text-gray-700">
                  {faq.resposta}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
