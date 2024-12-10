import { motion } from 'framer-motion';

const Team = () => {
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
          Fundador
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="https://cloud-1de12d.b-cdn.net/media/original/43c147618843d4e449ac7ac7dc730930/fotodrmunir.png"
                  alt="Dr. Munir Salomão"
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4 text-primary">Dr. Munir Salomão</h3>
              <p className="text-lg text-neutral-600 mb-6">
                Dr. Munir Salomão é fundador da empresa Bone Heal Ind e Com Ltda, 
                renomado idealizador da barreira de polipropileno Bone Heal®.
              </p>
              <ul className="space-y-3 text-neutral-600">
                <li>• Especialista em Periodontia</li>
                <li>• Especialista em odontologia para pacientes com necessidades especiais</li>
                <li>• Professor de cirurgia de implantes</li>
                <li>• Pesquisador em regeneração óssea guiada na Faculdade de Medicina da USP</li>
                <li>• Criador e consultor da Barreira Regenerativa @boneheal</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;