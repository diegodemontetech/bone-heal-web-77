import { motion } from "framer-motion";

const timelineEvents = [
  {
    year: "2018",
    title: "Fundação da Bone Heal",
    description: "Início da jornada com foco em inovação em regeneração óssea."
  },
  {
    year: "2019",
    title: "Primeiros Testes Clínicos",
    description: "Desenvolvimento e validação do protocolo inicial."
  },
  {
    year: "2020",
    title: "Aprovação ANVISA",
    description: "Certificação e autorização para comercialização."
  },
  {
    year: "2021",
    title: "Lançamento Oficial",
    description: "Introdução da barreira de polipropileno no mercado."
  },
  {
    year: "2022",
    title: "Expansão Nacional",
    description: "Crescimento da presença em todo território brasileiro."
  },
  {
    year: "2023",
    title: "Reconhecimento Internacional",
    description: "Início das exportações e parcerias globais."
  }
];

const Timeline = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 text-primary"
        >
          Nossa Trajetória
        </motion.h2>
        <div className="relative">
          {/* Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20" />
          
          {/* Events */}
          <div className="space-y-24">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex items-center ${
                  index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="w-1/2 pr-8 text-right">
                  {index % 2 === 0 ? (
                    <>
                      <h3 className="text-2xl font-bold text-primary mb-2">{event.title}</h3>
                      <p className="text-neutral-600">{event.description}</p>
                      <div className="text-lg font-bold text-primary/60 mt-2">{event.year}</div>
                    </>
                  ) : (
                    <div className="w-full" />
                  )}
                </div>
                <div className="relative flex items-center justify-center w-8">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                </div>
                <div className="w-1/2 pl-8">
                  {index % 2 === 1 ? (
                    <>
                      <h3 className="text-2xl font-bold text-primary mb-2">{event.title}</h3>
                      <p className="text-neutral-600">{event.description}</p>
                      <div className="text-lg font-bold text-primary/60 mt-2">{event.year}</div>
                    </>
                  ) : (
                    <div className="w-full" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;