
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  fullName: string | null;
}

export const UserAvatar = ({ fullName }: UserAvatarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar>
        <AvatarImage
          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${fullName}`}
        />
        <AvatarFallback>
          {fullName ? fullName.substring(0, 2).toUpperCase() : "UN"}
        </AvatarFallback>
      </Avatar>
      <span>{fullName}</span>
    </div>
  );
};
