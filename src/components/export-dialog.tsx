import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colorName: string;
  shades: Record<string, string>;
}

type ExportFormat = {
  id: string;
  name: string;
  getCode: (colorName: string, shades: Record<string, string>) => string;
};

const exportFormats: ExportFormat[] = [
  {
    id: "tailwind-hex",
    name: "Tailwind (HEX)",
    getCode: (colorName, shades) =>
      `'${colorName.toLowerCase().replace(" ", "-")}': {\n` + // Replace space with hyphen
      Object.entries(shades)
        .map(([key, value]) => `  '${key}': '${value}'`)
        .join(",\n") +
      "\n}",
  },
  {
    id: "tailwind-oklch",
    name: "Tailwind (OKLCH)",
    getCode: () => "// OKLCH format coming soon",
  },
  {
    id: "tailwind-hsl",
    name: "Tailwind (HSL)",
    getCode: () => "// HSL format coming soon",
  },
  {
    id: "scss-hex",
    name: "SCSS (HEX)",
    getCode: () => "// SCSS format coming soon",
  },
  {
    id: "css-hex",
    name: "CSS (HEX)",
    getCode: () => "// CSS HEX format coming soon",
  },
  {
    id: "css-hsl",
    name: "CSS (HSL)",
    getCode: () => "// CSS HSL format coming soon",
  },
  {
    id: "css-rgb",
    name: "CSS (RGB)",
    getCode: () => "// CSS RGB format coming soon",
  },
  {
    id: "svg-figma",
    name: "SVG (Figma)",
    getCode: () => "// SVG format coming soon",
  },
];

export default function Component({
  open,
  onOpenChange,
  colorName,
  shades,
}: ExportDialogProps) {
  const [activeFormat, setActiveFormat] = React.useState(exportFormats[0]);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    const code = activeFormat.getCode(colorName, shades);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-medium">
              Export code
            </DialogTitle>
          </div>
        </DialogHeader>
        <Separator />
        <div className="grid md:grid-cols-[240px_1fr] h-[600px] md:h-[400px]">
          <ScrollArea className="border-t md:border-r md:border-t-0">
            <div className="grid">
              {exportFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setActiveFormat(format)}
                  className={`px-6 py-2 text-left transition-colors hover:bg-muted ${
                    activeFormat.id === format.id
                      ? "bg-muted font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {format.name}
                </button>
              ))}
            </div>
          </ScrollArea>
          <div className="relative border-t md:border-t-0">
            <ScrollArea className="h-full">
              <div className="p-6 relative">
                <Button
                  onClick={copyToClipboard}
                  variant="secondary"
                  size="sm"
                  className="absolute right-6 top-6"
                >
                  {copied ? "Code copied!" : "Copy code"}
                </Button>
                <pre className="text-sm">
                  <code>{activeFormat.getCode(colorName, shades)}</code>
                </pre>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ExportDialog = Component;
