import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controls } from "./controls";
import { GridCell } from "./grid-cell";
import {
  getContrast,
  meetsContrastThreshold,
  Method,
  Score,
} from "@/lib/contrast-utils";
import { getLuminance, shouldUseLightText } from "@/lib/colors.ts";

interface ContrastGridProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shades: Record<string, string>;
}

export function ContrastGrid({
  open,
  onOpenChange,
  shades,
}: ContrastGridProps) {
  const [useAutoTextColor, setUseAutoTextColor] = useState(false);
  const [method, setMethod] = useState<Method>("wcag2");
  const [score, setScore] = useState<Score>("AA");

  const colorShades = [
    { name: "White", value: "#FFFFFF" },
    ...Object.entries(shades).map(([name, value]) => ({ name, value })),
    { name: "Black", value: "#000000" },
  ];

  const formatContrast = (ratio: number) => {
    if (!meetsContrastThreshold(ratio, score)) return "";

    return ratio.toFixed(1); // Display positive value only
  };

  const shouldShowBackground = (ratio: number) => {
    return meetsContrastThreshold(ratio, score);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Contrast Grid</DialogTitle>
        </DialogHeader>
        <div className="flex gap-12 flex-1 min-h-0">
          <Controls
            method={method}
            score={score}
            useAutoTextColor={useAutoTextColor}
            onMethodChange={setMethod}
            onScoreChange={setScore}
            onAutoTextColorChange={setUseAutoTextColor}
          />

          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full rounded-md border">
              <div className="min-w-[800px]">
                <div className="grid grid-cols-[150px_repeat(12,1fr)] gap-1 mr-2 mb-2">
                  {/* Header row */}
                  <div className="sticky top-0 bg-background z-10">
                    <div className="p-2 font-medium text-gray-400"></div>
                  </div>
                  {colorShades.slice(0, -1).map((shade) => (
                    <div
                      key={shade.name}
                      className="sticky top-0 bg-background z-10"
                    >
                      <div className="p-2 text-sm font-medium text-gray-400">
                        {shade.name}
                      </div>
                    </div>
                  ))}

                  {/* Grid rows */}
                  {colorShades.map((rowShade, rowIndex) => (
                    <React.Fragment key={rowShade.name}>
                      <div className="sticky left-0 bg-background z-10">
                        <div className="p-2 font-medium text-gray-400">
                          {rowShade.name}
                        </div>
                      </div>
                      {colorShades.slice(0, -1).map((colShade, colIndex) => {
                        const l1 = getLuminance(rowShade.value);
                        const l2 = getLuminance(colShade.value);
                        const contrast = getContrast(l1, l2, method);
                        const formattedContrast = formatContrast(contrast);
                        const showBackground = shouldShowBackground(contrast);
                        const useLightText = shouldUseLightText(colShade.value);

                        return (
                          <GridCell
                            key={`${rowShade.name}-${colShade.name}`}
                            rowShade={rowShade}
                            colShade={colShade}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            contrast={contrast}
                            useAutoTextColor={useAutoTextColor}
                            showBackground={showBackground}
                            formattedContrast={formattedContrast}
                            useLightText={useLightText}
                          />
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
