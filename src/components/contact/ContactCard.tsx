
import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

const ContactCard = ({ icon, title, children }: ContactCardProps) => {
  return (
    <Card className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <div className="bg-primary/10 p-1.5 rounded-full">
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {children}
      </CardContent>
    </Card>
  );
};

export default ContactCard;
