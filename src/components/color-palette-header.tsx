import { Button } from "@/components/ui/button";
import { Grid3X3, FileOutput, Edit } from "lucide-react";

interface ColorPaletteHeaderProps {
  colorName: string;
  onContrastGrid?: () => void;
  onExport?: () => void;
  onEdit?: () => void;
}

export default function Component({
  colorName = "Olive Drab",
  onContrastGrid = () => {},
  onExport = () => {},
  onEdit = () => {},
}: ColorPaletteHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl ">{colorName}</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onContrastGrid}>
          <Grid3X3 className="w-4 h-4 mr-2" />
          Contrast grid
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <FileOutput className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>
    </div>
  );
}

export const ColorPaletteHeader = Component;
