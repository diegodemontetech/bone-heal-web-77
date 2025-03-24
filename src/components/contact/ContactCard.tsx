
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
    <Card className="bg-white rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ContactCard;
