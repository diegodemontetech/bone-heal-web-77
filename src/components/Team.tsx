import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: "Dr. João Silva",
    role: "Fundador e Diretor Científico",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80",
    bio: "Doutor em Implantodontia com mais de 20 anos de experiência clínica."
  },
  {
    name: "Dra. Maria Santos",
    role: "Pesquisadora Chefe",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80",
    bio: "Especialista em biomateriais e regeneração tecidual."
  },
  {
    name: "Dr. Carlos Oliveira",
    role: "Diretor de Desenvolvimento",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80",
    bio: "PhD em Engenharia Biomédica, responsável por inovações em produtos."
  }
];

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
          Nossa Equipe
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="mb-6 relative mx-auto">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-primary">{member.name}</h3>
              <div className="text-lg text-neutral-600 mb-4">{member.role}</div>
              <p className="text-neutral-500">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;