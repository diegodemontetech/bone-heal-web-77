import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Dr. Carlos Silva",
    role: "Implantodontista",
    content: "Revolucionou minha prática clínica. Os resultados são impressionantes e consistentes.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
  },
  {
    name: "Dra. Ana Paula",
    role: "Cirurgiã-Dentista",
    content: "Simplesmente o melhor sistema que já utilizei. Meus pacientes adoram os resultados.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop"
  },
  {
    name: "Dr. Ricardo Santos",
    role: "Periodontista",
    content: "A regeneração óssea nunca foi tão previsível. Recomendo fortemente.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop"
  },
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
                      <div className="flex items-center space-x-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                          <p className="text-sm text-neutral-500">{testimonial.role}</p>
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