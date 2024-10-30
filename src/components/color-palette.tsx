"use client";

import { useState } from "react";
import { ColorPaletteHeader } from "./color-palette-header";
import { ContrastGrid } from "@/components/grid/contrast-grid.tsx";
import { Check } from "lucide-react";

interface ColorPaletteProps {
  shades: Record<string, string>;
  colorName: string;
  onExport?: () => void;
}

function getContrastColor(hexcolor: string): string {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#1a1a1a" : "#ffffff";
}

export default function Component({
  shades,
  colorName = "Olive Drab",
  onExport,
}: ColorPaletteProps) {
  const [showContrastGrid, setShowContrastGrid] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      // Reset the copied state after animation
      setTimeout(() => setCopiedColor(null), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      <ColorPaletteHeader
        colorName={colorName}
        onContrastGrid={() => setShowContrastGrid(true)}
        onExport={onExport}
        onEdit={() => console.log("Edit clicked")}
      />

      <div className="grid grid-cols-11 gap-2">
        {Object.entries(shades).map(([key, value]) => (
          <div
            key={key}
            onClick={() => copyToClipboard(value)}
            className="group h-24 rounded-lg p-4 flex flex-col justify-end relative transition-transform hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: value,
              color: getContrastColor(value),
            }}
          >
            {copiedColor === value ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
            ) : (
              <div className="text-center">
                <div className="text-sm font-medium">{key}</div>
                <div className="text-xs uppercase opacity-90">
                  {value.slice(1)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ContrastGrid
        open={showContrastGrid}
        onOpenChange={setShowContrastGrid}
        shades={shades}
      />
    </div>
  );
}

export const ColorPalette = Component;
