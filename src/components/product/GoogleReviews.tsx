
import { Star } from "lucide-react";

const GoogleReviews = () => {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-100">
      <div className="flex items-center mb-2">
        <h3 className="text-lg font-bold">Avaliações dos Clientes</h3>
        <div className="ml-auto flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">5.0</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-500">
        Baseado em mais de 120 avaliações verificadas
      </p>
    </div>
  );
};

export default GoogleReviews;
