"use client";

import * as React from "react";
import { ColorInput } from "@/components/color-input";
import { ColorPalette } from "@/components/color-palette";
import { ExportDialog } from "@/components/export-dialog";
import { generateRandomHex, generateShades, hexToHsv } from "@/lib/colors";
import { generateCustomColorName } from "@/lib/generate-name";

export default function TailwindColorGenerator() {
  const [baseColor, setBaseColor] = React.useState(() => generateRandomHex());
  const [colorName, setColorName] = React.useState("");
  const [shades, setShades] = React.useState<Record<string, string>>({});
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);

  React.useEffect(() => {
    const { h, s, v } = hexToHsv(baseColor);
    const newShades = generateShades(baseColor);
    setShades(newShades);
    const newColorName = generateCustomColorName(h, s, v);
    setColorName(newColorName);
  }, [baseColor]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // Prevent page scroll
        setBaseColor(generateRandomHex());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 pt-20 w-full">
        <div className="md:mb-12 text-center">
          <div className="text-3xl md:text-5xl font-semibold text-color font-display">
            Tailwind CSS
            <br />
            Color Generator
          </div>
          <p className="text-gray-600 md:text-lg mt-6 hidden md:block leading-normal">
            Press spacebar or enter a hexcode
            <br />
            to create a custom color scale
          </p>
          <p className="text-color-muted md:text-lg mt-4 md:hidden">
            Enter a hexcode to create a custom color scale
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="max-w-md mx-auto">
          <ColorInput
            value={baseColor}
            onChange={setBaseColor}
            onAddSecondary={() => console.log("Add secondary color")}
          />
        </div>
      </div>

      <div className="max-w-5xl px-6 pb-12 mx-auto space-y-8 mt-20">
        <ColorPalette
          shades={shades}
          colorName={colorName}
          onExport={() => setExportDialogOpen(true)}
        />
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        colorName={colorName}
        shades={shades}
      />
    </>
  );
}

export { TailwindColorGenerator };
