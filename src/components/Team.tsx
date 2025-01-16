import { motion } from "framer-motion";

const Team = () => {
  return (
    <section className="section-padding bg-white" id="team">
      <div className="container mx-auto container-padding">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl text-center mb-12 text-primary"
        >
          Sobre o Fundador
        </motion.h2>
        
        {/* Top section with image and brief intro */}
        <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://cloud-1de12d.b-cdn.net/media/original/4372c63cef0efffefda27509bc44164e/DrMuniremAZULAA.png"
              alt="Dr. Munir Salomão"
              className="rounded-2xl w-full object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-3xl font-bold mb-4 text-primary">Dr. Munir Salomão</h3>
            <p className="text-lg text-neutral-600 mb-6">
              Fundador da Bone Heal Ind e Com Ltda, renomado idealizador da barreira de polipropileno Bone Heal®. 
              Pesquisador, desenvolvedor do Método ROG-M de Munir Salomão, pioneiro no desenvolvimento e introdução 
              de barreiras de polipropileno para Regeneração Óssea Guiada no mercado nacional.
            </p>
            <ul className="space-y-3 text-neutral-600">
              <li>• Cirurgião-dentista especialista em implantodontia, pacientes especiais e periodontia</li>
              <li>• Professor de cirurgia de implantes e do Método ROG-M de Munir Salomão</li>
              <li>• Pesquisador em regeneração óssea guiada pela Faculdade de Medicina da USP</li>
              <li>• Criador e consultor dos produtos da empresa @boneheal</li>
            </ul>
          </motion.div>
        </div>
        
        {/* Bottom section with detailed story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 space-y-4 text-neutral-600 max-w-4xl mx-auto"
        >
          <p>
            A Bone Heal nasceu de um sonho genuíno do Dr. Munir Salomão, um visionário que desejava transformar 
            a vida de centenas de pessoas, proporcionando-lhes qualidade de vida. Foram necessários 12 anos de 
            pesquisa intensa e sacrifício, noites sem dormir e a frustração dos primeiros testes que não deram certo.
          </p>
          <p>
            Hoje, com 40 anos de carreira como dentista, ele realizou mais de 3 mil cirurgias de Regeneração 
            Óssea Guiada sem enxerto, utilizando os produtos e o Método ROG-M de Munir Salomão que desenvolveu.
          </p>
          <p>
            Ainda apaixonado pelas pessoas e pela odontologia, ele continua a ser a mente criativa por trás dos 
            desenvolvimentos da Bone Heal, permanecendo ativo e mais comprometido do que nunca com seu sonho de 
            ver seus produtos transformando vidas.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;