
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
      pergunta: "O que é Bone Heal®?",
      resposta: "Bone Heal® é uma película usada como barreira onde se deseja obter regeneração óssea guiada."
    },
    {
      pergunta: "De que material é constituído Bone Heal®?",
      resposta: "Bone Heal® é constituída 100% por polipropileno."
    },
    {
      pergunta: "Em que casos posso usar Bone Heal®?",
      resposta: "Bone Heal® está indicada para ser usada em todos os casos pós-exodontias, independentemente da causa, principalmente quando houver perda de parede alveolar."
    },
    {
      pergunta: "Que outras indicações posso usar Bone Heal®?",
      resposta: "Bone Heal® pode ser usada quando se deseja obter regeneração óssea guiada em casos de fenestrações ou perda de paredes ósseas após exodontias. Bone Heal®, pode também ser usada juntamente com implantes imediatos. Nestes casos, é preciso que haja espaço entre Bone Heal® e a superfície do implante para que haja a formação e manutenção do coágulo sanguíneo. Quanto maior for este espaço, maior será a quantidade óssea formada. Nas comunicações buco-sinusais imediatas ou mediatas, sem processo infeccioso agudo. Nas apicectomias, curetagens periapicais e enucleação de cistos."
    },
    {
      pergunta: "Como age Bone Heal®?",
      resposta: "Bone Heal® isola a área a ser regenerada, exercendo a função de uma barreira mecânica, permitindo a manutenção do coágulo sanguíneo no espaço compreendido pelo defeito ósseo, onde células mesenquimais pluripotentes, capazes de gerar tanto tecido ósseo quanto tecido queratinizado, exerçam suas atividades."
    },
    {
      pergunta: "Como manipular Bone Heal®?",
      resposta: "A manipulação de Bone Heal® deve obedecer à técnica cirúrgica asséptica e de preferência por Cirurgiões-Dentistas que dominem as técnicas regenerativas das cirurgias orais, pois o uso inadequado da barreira poderá resultar em insucesso quanto aos objetivos pretendidos."
    },
    {
      pergunta: "É preciso hidratar Bone Heal® antes de usar?",
      resposta: "Não adicione nenhuma substância à superfície de Bone Heal®. Bone Heal® vem pronta para ser usada, com suas superfícies especificamente tratadas para permitir a proteção do coágulo. Apenas remova da embalagem interna com uma pinça estéril e faça as adaptações recortando com tesoura, de acordo com o defeito a ser regenerado."
    },
    {
      pergunta: "É preciso fechamento primário dos retalhos quando uso Bone Heal®?",
      resposta: "Esta é uma das principais características que diferencia Bone Heal® de outros materiais usados até hoje como barreira não absorvível. Bone Heal® foi projetada e é preparada para ser deixada INTENCIONALMENTE EXPOSTA AO MEIO BUCAL. Quanto maior for a área de exposição, maior será o ganho de tecido queratinizado."
    },
    {
      pergunta: "Como devo fazer para adaptar Bone Heal®?",
      resposta: "Bone Heal® apresenta fácil manuseabilidade. Faça as adaptações recortando Bone Heal® com tesoura, a fim de obter o formato que consiga recobrir totalmente o defeito a ser regenerado. É importantíssimo que quando da colocação de Bone Heal® sobre o defeito a ser regenerado, haja sangue suficiente para preencher o espaço entre Bone Heal® e o defeito ósseo. O preenchimento do defeito ósseo com sangue deverá ser na sua totalidade, fazendo com que haja contato do sangue com toda a superfície interna da Bone Heal®."
    },
    {
      pergunta: "Quanto preciso recobrir o defeito ósseo?",
      resposta: "Bone Heal® deverá sempre isolar totalmente a área a ser regenerada, ultrapassando cerca de 2 milímetros, além das margens do defeito. Os retalhos cirúrgicos devem permitir que todo o defeito ósseo a ser reparado seja identificado. Não é preciso grandes retalhos cirúrgicos para que Bone Heal® permaneça sobre o defeito ósseo. É importante observar que todo o defeito fique recoberto com a Bone Heal®, garantindo assim, que não haja espaço para proliferação de tecido mole para dentro do defeito que se quer regenerar."
    },
    {
      pergunta: "Quando devo remover Bone Heal®?",
      resposta: "Bone Heal® poderá ser removida entre 7 a 14 dias, embora possa ser removida após esse período, quando o Cirurgião-Dentista julgar necessário."
    },
    {
      pergunta: "É preciso anestesiar para remover Bone Heal®?",
      resposta: "Não. Bone Heal® é removida apenas com uma pinça estéril, delicadamente, puxando-a no sentido vertical. Não há dor na remoção."
    },
    {
      pergunta: "Há algum problema se Bone Heal® ficar submersa?",
      resposta: "Caso ocorra o recobrimento natural da Bone Heal® na hora da aproximação dos retalhos, não haverá qualquer problema em deixá-la submersa. Isso pode ocorrer nos casos onde se faz algum desgaste no tecido ósseo, como no caso de osteoplastias com o objetivo de se conseguir um aplainamento ósseo. Nesses casos, na hora da sutura dos retalhos haverá a aproximação dos retalhos e a Bone Heal® ficará submersa. A sua remoção poderá ser feita na hora da abertura para instalação dos cicatrizadores."
    },
    {
      pergunta: "Que cuidados são necessários enquanto Bone Heal® for mantida em posição?",
      resposta: "O paciente deverá ser orientado para não praticar exercícios físicos enquanto Bone Heal® não for removida. Deverá ser orientado para não tocar na área da cirurgia e nem exercer pressão mastigatória nesta região. Como Bone Heal® dificulta o acúmulo de microrganismos e restos alimentares em sua superfície, qualquer substância antisséptica usada rotineiramente pode ser usada para fazer enxagues bucais a cada 8h até quando a barreira for removida. Os enxagues deverão ser prescritos para serem iniciados somente 24 horas após o término da cirurgia."
    },
    {
      pergunta: "Quais as dimensões de Bone Heal®?",
      resposta: "Bone Heal® é apresentada em 3 tamanhos: 15mm x 40mm, indicada para exodontias unitárias ou defeitos ósseos que apresentem tamanhos semelhantes; 20mm x 30mm, defeitos correspondentes a 2 exodontias de dentes contíguos e 30mm x 40mm, tamanhos suficiente para regeneração de defeitos correspondentes a 3 exodontias de elementos contíguos."
    },
    {
      pergunta: "Bone Heal® é aprovada pela ANVISA?",
      resposta: "Bone Heal® está registrada na ANVISA sob número 81197590000, como: Bone Heal® - Membrana Regenerativa Odontológica. Fabricante: Bone Heal Ind e Com Ltda."
    },
    {
      pergunta: "Quanto tempo depois posso instalar o implante após realizar uma exodontia e usar Bone Heal®?",
      resposta: "Em média, 90 dias."
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
