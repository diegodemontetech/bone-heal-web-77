
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPickerPopover = ({ color, onChange }: ColorPickerPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="w-10 h-10 p-0"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <HexColorPicker
          color={color}
          onChange={onChange}
        />
        <div className="grid grid-cols-4 gap-1 mt-2">
          {DEFAULT_COLORS.map((presetColor) => (
            <Button
              key={presetColor}
              type="button"
              variant="outline"
              className="w-6 h-6 p-0 rounded-md"
              style={{ backgroundColor: presetColor }}
              onClick={() => onChange(presetColor)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
