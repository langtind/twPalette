"use client";

import * as React from "react";
import ColorPalette from "@/components/color-palette";
import { ExportDialog } from "@/components/export-dialog";
import { generateRandomHex, generateShades } from "@/lib/colors";
import ColorInput from "@/components/color-input.tsx";

export default function TailwindColorGenerator() {
  const [baseColor, setBaseColor] = React.useState(() => generateRandomHex());
  const [colorName, setColorName] = React.useState("");
  const [shades, setShades] = React.useState<Record<string, string>>({});
  const [baseLevel, setBaseLevel] = React.useState<number>();
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [useTailwindCharacteristics, setUseTailwindCharacteristics] =
    React.useState(() => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("useTailwindCharacteristics");
        return stored ? JSON.parse(stored) : true;
      }
      return true;
    });
  const [fixInputColorTo500, setFixInputColorTo500] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fixInputColorTo500");
      return stored ? JSON.parse(stored) : false;
    }
    return false;
  });

  React.useEffect(() => {
    const { shades, baseLevel, name } = generateShades(
      baseColor,
      useTailwindCharacteristics,
      fixInputColorTo500,
    );
    setShades(shades);
    setBaseLevel(baseLevel);
    setColorName(name);
  }, [baseColor, useTailwindCharacteristics, fixInputColorTo500]);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setBaseColor(generateRandomHex());
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  React.useEffect(() => {
    localStorage.setItem(
      "useTailwindCharacteristics",
      JSON.stringify(useTailwindCharacteristics),
    );
  }, [useTailwindCharacteristics]);

  React.useEffect(() => {
    localStorage.setItem(
      "fixInputColorTo500",
      JSON.stringify(fixInputColorTo500),
    );
  }, [fixInputColorTo500]);

  const toggleUseTailwindCharacteristics = () => {
    setUseTailwindCharacteristics((prev: boolean) => !prev);
  };

  const toggleFixInputColorTo500 = () => {
    setFixInputColorTo500((prev: boolean) => !prev);
  };

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
            Press <span className="underline">spacebar</span> or enter a hexcode
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
            useTailwindCharacteristics={useTailwindCharacteristics}
            onToggleUseTailwindCharacteristics={
              toggleUseTailwindCharacteristics
            }
            fixInputColorTo500={fixInputColorTo500}
            onToggleFixInputColorTo500={toggleFixInputColorTo500}
          />
        </div>
      </div>

      <div className="max-w-5xl px-6 pb-12 mx-auto space-y-8 mt-20">
        <ColorPalette
          shades={shades}
          baseLevel={baseLevel}
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
