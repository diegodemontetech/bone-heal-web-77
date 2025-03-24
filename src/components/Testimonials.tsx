
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

// Filtered to only include 5-star reviews
const testimonials = [
  {
    name: "Munir S.",
    role: "Cirurgião-Dentista",
    content: "Excelente resultados quando corretamente utilizada.",
    date: "17/02/2017"
  },
  {
    name: "Jamil S.",
    role: "Cirurgião-Dentista",
    content: "Produto muito bom, parabéns pela parceria Dental Cremer e Boneheal.",
    date: "16/02/2017"
  },
  {
    name: "Sandra O.",
    role: "Cirurgiã-Dentista",
    content: "Produto excelente! Tive um resultado no paciente acima das expectativas. Fácil manipulação!",
    date: "16/02/2018"
  },
  {
    name: "Cristiano M.",
    role: "Cirurgião-Dentista",
    content: "Revolucionou a exodontia, com regeneração óssea guiada, quando realizada a técnica adequada! Uso e recomendo!",
    date: "23/08/2017"
  },
  {
    name: "Elizeu G.",
    role: "Cirurgião-Dentista",
    content: "Excelente produto. Além de usá-lo para preservação alveolar pós-exodontia, utilizo para procedimentos de regeneração óssea, principalmente onde há risco de exposição da membrana ao meio bucal, com excelentes resultados.",
    date: "13/12/2017"
  },
  {
    name: "Decio M.",
    role: "Cirurgião-Dentista",
    content: "Muito bom",
    date: "07/04/2017"
  },
  {
    name: "Roberto R.",
    role: "Cirurgião-Dentista", 
    content: "Excelente produto",
    date: "13/09/2018"
  },
  {
    name: "Pollyana C.",
    role: "Cirurgiã-Dentista",
    content: "Excelente resultado",
    date: "24/08/2017"
  },
  {
    name: "Cristianode E.",
    role: "Cirurgião-Dentista",
    content: "Excelente",
    date: "08/09/2017"
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 text-primary font-heading">
            Depoimentos
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto font-light">
            Veja o que os profissionais estão dizendo sobre o Bone Heal
          </p>
        </motion.div>
        
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-neutral-600 mb-8 text-lg font-light leading-relaxed">{testimonial.content}</p>
                      <div className="flex flex-col">
                        <div className="text-left">
                          <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-neutral-500">{testimonial.role}</p>
                          <p className="text-xs text-neutral-400 mt-1">{testimonial.date}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
