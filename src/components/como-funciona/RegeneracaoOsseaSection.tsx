
import { Info } from "lucide-react";

const RegeneracaoOsseaSection = () => {
  return (
    <section id="rog" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">O que é a Regeneração Óssea Guiada?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A Regeneração Óssea Guiada (ROG) é uma técnica odontológica utilizada para aumentar a quantidade de osso em áreas onde houve perda, seja por extração dentária, doença periodontal ou outras causas. A BoneHeal é uma membrana de polipropileno especialmente desenvolvida para guiar o crescimento ósseo nessa região.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Princípio Fundamental</h3>
            <p className="text-gray-700 mb-6">
              O princípio fundamental da ROG com BoneHeal é criar um espaço protegido para que as células ósseas possam proliferar e formar novo osso, impedindo que tecidos moles (como a gengiva) invadam essa área.
            </p>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Abordagem Única</h3>
            <p className="text-gray-700 mb-6">
              Uma das grandes vantagens da BoneHeal é a possibilidade de utilização sem a necessidade de enxerto ósseo em muitos casos, simplificando o procedimento e reduzindo o desconforto pós-operatório.
            </p>
            <div className="flex items-center text-primary font-medium">
              <Info className="mr-2 h-5 w-5" />
              A membrana BoneHeal pode ser intencionalmente deixada exposta na boca, algo que não é possível com outros tipos de membranas.
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-2xl">
            <img 
              src="https://i.ibb.co/5rhwywJ/6.webp" 
              alt="Regeneração Óssea com BoneHeal" 
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegeneracaoOsseaSection;
