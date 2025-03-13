
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OptionsSectionProps {
  type: string;
  options: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const OptionsSection = ({ type, options, handleInputChange }: OptionsSectionProps) => {
  if (!["select", "radio", "checkbox"].includes(type)) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="options">Opções</Label>
      <Textarea
        id="options"
        name="options"
        placeholder="Opção 1, Opção 2, Opção 3"
        value={options}
        onChange={handleInputChange}
      />
      <p className="text-xs text-muted-foreground">
        Separe as opções por vírgula
      </p>
    </div>
  );
};
