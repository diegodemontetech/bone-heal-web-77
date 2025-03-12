
import { format } from "date-fns";

export const useDateFormat = () => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Data inválida";
    }
  };

  return { formatDate };
};
