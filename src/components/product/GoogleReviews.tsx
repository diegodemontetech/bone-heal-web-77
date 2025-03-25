
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

const googleReviews = [
  {
    id: 1,
    author: "Mariana Silva",
    rating: 5,
    date: "2 meses atrás",
    content: "Resultados impressionantes com o Bone Heal! Minha recuperação foi muito mais rápida e com menos dor após o procedimento. Recomendo fortemente para qualquer profissional da área odontológica.",
    avatar: "MS"
  },
  {
    id: 2,
    author: "Carlos Oliveira",
    rating: 5,
    date: "3 meses atrás",
    content: "A Bone Heal transformou minha prática clínica. Os pacientes ficam muito satisfeitos com a recuperação acelerada e os resultados são consistentemente excelentes. Vale cada centavo!",
    avatar: "CO"
  },
  {
    id: 3,
    author: "Patricia Mendes",
    rating: 5,
    date: "1 mês atrás",
    content: "Produto excepcional! Tenho usado em minha clínica há 6 meses e os resultados de regeneração óssea são notáveis. Atendimento da empresa também é de primeira qualidade.",
    avatar: "PM"
  },
  {
    id: 4,
    author: "Roberto Almeida",
    rating: 5,
    date: "4 meses atrás",
    content: "Como implantodontista, posso dizer que o Bone Heal mudou completamente minha abordagem para regeneração óssea. Excelente produto e suporte técnico da empresa.",
    avatar: "RA"
  },
  {
    id: 5,
    author: "Ana Paula Costa",
    rating: 5,
    date: "2 meses atrás",
    content: "Meus pacientes têm apresentado uma recuperação muito mais rápida desde que comecei a usar o Bone Heal. A empresa também oferece um suporte fantástico para qualquer dúvida.",
    avatar: "AC"
  }
];

const GoogleReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % googleReviews.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Avaliações do Google
          <span className="text-sm font-normal text-gray-500">(5.0 ⭐)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden" style={{ height: '200px' }}>
          <div 
            className="transition-transform duration-500 ease-in-out absolute w-full"
            style={{ transform: `translateY(-${currentIndex * 100}%)` }}
          >
            {googleReviews.map((review) => (
              <div key={review.id} className="p-4 border-b last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-800 font-semibold">
                      {review.avatar}
                    </div>
                    <span className="font-medium">{review.author}</span>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="flex mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 text-sm">{review.content}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center mt-4 gap-1">
          {googleReviews.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? 'bg-violet-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleReviews;
