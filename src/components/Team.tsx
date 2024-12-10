import { Avatar } from "@/components/ui/avatar";

const Team = () => {
  return (
    <section className="section-padding bg-white" id="team">
      <div className="container mx-auto container-padding">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-primary">
          Nossa Equipe
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://gflhpcvldqoqjikeepjh.supabase.co/storage/v1/object/public/fotos/munir"
              alt="Dr. Munir Salomão"
              className="rounded-2xl w-full aspect-[4/3] object-cover"
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-4 text-primary">Dr. Munir Salomão</h3>
            <p className="text-lg text-neutral-600 mb-6">
              Dr. Munir Salomão é fundador da empresa Bone Heal Ind e Com Ltda, 
              renomado idealizador da barreira de polipropileno Bone Heal®.
            </p>
            <ul className="space-y-3 text-neutral-600">
              <li>• Cirurgião-dentista especialista em implantodontia</li>
              <li>• Professor de cirurgia de implantes</li>
              <li>• Pesquisador em regeneração óssea guiada na Faculdade de Medicina da USP</li>
              <li>• Criador e consultor da Barreira Regenerativa @boneheal</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Team;