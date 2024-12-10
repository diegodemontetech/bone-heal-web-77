import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

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
    <section className="py-24 bg-neutral-50">
      <div className="max-w-[1440px] mx-auto px-8 lg:px-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-primary">
            Depoimentos
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Veja o que os profissionais estão dizendo sobre o Bone Heal
          </p>
        </div>
        
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-neutral-600 mb-6">{testimonial.content}</p>
                    <div className="flex items-center space-x-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-neutral-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;