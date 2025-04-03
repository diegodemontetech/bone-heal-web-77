
import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GoogleReview {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  response?: string;
}

const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: "1",
    author: "Luís Augusto Serrano",
    rating: 5,
    content: "Uso o Bone Heal desde seu lançamento e agora também o Heal Bone, produtos de fácil manuseio para instalação e remoção. A melhor membrana para ROG que existe no mercado Odontológico. Empresa confiável, com embasamento científico de seus produtos, equipe e funcionários muito atenciosos. Parabéns!",
    date: "2 meses atrás",
    response: "Ficamos muito felizes em atendê-lo Dr. Luís e agradecemos pela confiança em nossa empresa. Continue contando com nossos produtos e serviços para auxiliá-lo na realização do seu trabalho!"
  },
  {
    id: "2",
    author: "Eliane Oliveira de Souza",
    rating: 5,
    content: "Surpreendentemente muito bem estruturado, prático, rápido e prestativo atendimento. Muito bom. Obrigada!!! Vocês me ajudaram muito.",
    date: "2 meses atrás",
    response: "Ficamos felizes em ajudá-la Dra. Eliane, continue contando com nossos produtos e serviços!"
  },
  {
    id: "3",
    author: "Rui Bueno de Oliveira",
    rating: 5,
    content: "Atendimento rápido e eficiente. Estarei usando o Heal Boné pela primeira vez. O Bone Heal cumpriu o que prometeu. Muito bom.",
    date: "2 meses atrás",
    response: "Ficamos felizes em atendê-lo, Dr. Rui! Nos dê um retorno do que achou. É muito importante para nós sabermos a opinião dos profissionais. Siga acompanhando nossas redes sociais."
  },
  {
    id: "4",
    author: "Maraci Sanches Bohac",
    rating: 5,
    content: "Excelente produto de qualidade, preço acessível. Excelente pós-extração, para manter altura e espessura óssea, sem enxertia. Empresa com ótimo atendimento, sem burocracias e entrega rápida.",
    date: "6 meses atrás",
    response: "Obrigado pela sua avaliação, Dra. Maraci! Nossos produtos e serviços, bem como nossa equipe, estarão sempre à sua disposição! Continue contando conosco!"
  },
  {
    id: "5",
    author: "Carol Castro",
    rating: 5,
    content: "Boa qualidade, bom atendimento. Recomendo!",
    date: "1 semana atrás",
    response: "Obrigado pela sua avaliação, Dra. Carol! Continue contando com nossos produtos e serviços."
  },
  {
    id: "6",
    author: "Vanice",
    rating: 5,
    content: "Produto fantástico, empresa séria, com entrega rápida e atendimento maravilhoso.",
    date: "2 meses atrás",
    response: "Obrigado pela sua avaliação Dra. Vanice. Continue contando com nossos produtos e serviços!"
  },
  {
    id: "7",
    author: "Eduardo Kian",
    rating: 5,
    content: "Empresa que trabalha com princípios embasados cientificamente. São meus fornecedores há mais de 10 anos. Estou muito satisfeito com o atendimento, produto e prazo de entrega. Recomendo!",
    date: "7 meses atrás",
    response: "Obrigado pela sua avaliação e indicação, Dr. Eduardo. Ficamos felizes em auxiliá-lo em seu trabalho! Continue em contato com nossos produtos e serviços, bem como nossa equipe!"
  },
  {
    id: "8",
    author: "Geraldo Marques de Sousa",
    rating: 5,
    content: "Muito bem atendido. Informações claras e prontas. Ótimo. Recomendo.",
    date: "5 meses atrás",
    response: "Obrigado pela sua avaliação, Dr. Geraldo. Ficamos felizes em atendê-lo! Continue contando com nossos produtos e serviços."
  },
  {
    id: "9",
    author: "Jose Oswaldo Vieira",
    rating: 5,
    content: "Utilizo a membrana reparadora como barreira epitelial e conjuntiva há muitos anos. Excelentes resultados.",
    date: "4 meses atrás",
    response: "Obrigado pela sua avaliação! Ficamos felizes em ajudá-lo em seu trabalho, Dr. José Oswaldo. Continue contando conosco!"
  },
  {
    id: "10",
    author: "Elio Soares",
    rating: 5,
    content: "Produto de qualidade e excelente atendimento!",
    date: "3 semanas atrás",
    response: "Obrigado pela sua avaliação Elio! Continue contando com nossos produtos e serviços!"
  },
  {
    id: "11",
    author: "Ana Claudia Stabelito",
    rating: 5,
    content: "Além da qualidade do material, gosto da atenção e prontidão no atendimento.",
    date: "4 meses atrás",
    response: "Obrigado pela sua avaliação, Dra. Ana Claudia. Ficamos muito felizes em atendê-la e contribuir para a realização do seu trabalho. Continue contando conosco!"
  },
  {
    id: "12",
    author: "Paula Pacheco",
    rating: 5,
    content: "Atendimento rápido, eficiente e muito simpático, fiquei muito impressionada. Continuem assim!",
    date: "7 meses atrás",
    response: "Obrigado pela sua avaliação, Dra. Paula. Ficamos muito felizes em tê-la atendido! Continue contando com nossa equipe!"
  },
  {
    id: "13",
    author: "Cláudia Eliane Rossit de Mendonça",
    rating: 5,
    content: "Excelente atendimento! Fiz a compra e no mesmo dia o material foi enviado. Recebi no dia seguinte!",
    date: "9 meses atrás",
    response: "Obrigado Dra. Claudia pela sua avaliação. Sempre ficamos felizes em poder atendê-la! Nossa equipe permanece à sua disposição."
  },
  {
    id: "14",
    author: "Helena Klemba",
    rating: 5,
    content: "Melhor membrana para casos de pós extração. Uma benção",
    date: "3 semanas atrás",
    response: "Obrigado pela sua avaliação Dra. Helena! Ficamos felizes em ajudá-la em seu trabalho."
  },
  {
    id: "15",
    author: "Andre ls",
    rating: 5,
    content: "Bone Heal é minha primeira e única escolha em ROG. Resultados absurdamente viáveis, reprodutíveis e satisfatórios. Sempre grato ao Prof. Munir Salomão.",
    date: "6 meses atrás",
    response: "Obrigado pela sua avaliação, Dr. André. Ficamos muito felizes em ajudá-lo em seu trabalho! Continue contando conosco!"
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export const GoogleReviewsCarousel = () => {
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    // Calculate average rating
    if (GOOGLE_REVIEWS.length > 0) {
      const sum = GOOGLE_REVIEWS.reduce((acc, review) => acc + review.rating, 0);
      setAverageRating(parseFloat((sum / GOOGLE_REVIEWS.length).toFixed(1)));
    }
  }, []);

  return (
    <div className="w-full py-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Avaliações dos Clientes</h3>
          <div className="flex items-center mt-1">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.floor(averageRating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : star <= averageRating + 0.5 
                        ? 'text-yellow-400 fill-yellow-400 opacity-60' 
                        : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{averageRating}</span>
            <span className="text-gray-500 ml-1">({GOOGLE_REVIEWS.length} avaliações)</span>
          </div>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent>
          {GOOGLE_REVIEWS.map((review) => (
            <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{review.author}</p>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} />
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm line-clamp-4">{review.content}</p>
                    
                    {review.response && (
                      <div className="bg-gray-50 p-3 rounded-md mt-3 text-sm">
                        <p className="text-xs font-medium text-gray-700 mb-1">Resposta da Bone Heal</p>
                        <p className="text-gray-600 text-xs line-clamp-2">{review.response}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
};

export default GoogleReviewsCarousel;
