"use client";

import * as React from "react";
import { Check, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddSecondary?: () => void;
  useTailwindCharacteristics: boolean;
  onToggleUseTailwindCharacteristics: () => void;
  fixInputColorTo500: boolean;
  onToggleFixInputColorTo500: () => void;
}

export function ColorInput({
  value = "#9b40ea",
  onChange,
  onAddSecondary,
  useTailwindCharacteristics,
  onToggleUseTailwindCharacteristics,
  fixInputColorTo500,
  onToggleFixInputColorTo500,
}: ColorInputProps) {
  const [inputValue, setInputValue] = React.useState(value);
  const [isValidHex, setIsValidHex] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [isInputActive, setIsInputActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase();
    setInputValue(newValue);

    // Add # if user starts typing without it
    if (newValue.length > 0 && !newValue.startsWith("#")) {
      const withHash = `#${newValue}`;
      setInputValue(withHash);
      validateAndUpdate(withHash);
      return;
    }

    validateAndUpdate(newValue);
  };

  const validateAndUpdate = (hex: string) => {
    const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex);
    setIsValidHex(isValid);
    if (isValid) {
      onChange(hex);
    }
  };

  // Update input value when color changes from picker
  React.useEffect(() => {
    setInputValue(value);
    setIsValidHex(true);
  }, [value]);

  const handleDivClick = () => {
    setIsInputActive(true);
    inputRef.current?.focus();
  };

  const handleInputBlur = () => {
    setIsInputActive(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`flex items-center gap-3 w-full max-w-2xl bg-white rounded-full border shadow-sm px-3 py-1 cursor-text transition-all ${
          isInputActive ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={handleDivClick}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full transition-transform hover:scale-105 cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full border-0"
          style={{ backgroundColor: isValidHex ? value : "#ffffff" }}
        />
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className={`w-32 border-0 bg-transparent p-0 text-base font-medium focus-visible:ring-0 ${
            !isValidHex ? "text-red-500" : ""
          }`}
          placeholder="#000000"
        />
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-auto w-auto p-1"
          onClick={(e) => {
            e.stopPropagation();
            setShowSettings(true);
          }}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <Button
        variant="ghost"
        className="text-base text-muted-foreground hover:text-foreground"
        onClick={onAddSecondary}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add secondary color
      </Button>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Generator settings</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <button
              className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors relative"
              onClick={onToggleUseTailwindCharacteristics}
            >
              <div className="pr-8">
                <h3 className="font-semibold text-lg mb-1">
                  Use Tailwind CSS characteristics
                </h3>
                <p className="text-gray-500">
                  Mimics the characteristics of the original Tailwind CSS color
                  scales. We decide what shade number your input color gets
                  based on the lightness.
                </p>
              </div>
              {useTailwindCharacteristics && (
                <div className="absolute right-4 top-4 bg-black rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>

            <button
              className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors relative"
              onClick={onToggleFixInputColorTo500}
            >
              <div className="pr-8">
                <h3 className="font-semibold text-lg mb-1">
                  Fix input color to 500 shade
                </h3>
                <p className="text-gray-500">
                  Your input color is fixed at the 500 shade regardless of the
                  lightness of the color. The rest of the scale is made
                  proportionally lighter or darker.
                </p>
              </div>
              {fixInputColorTo500 && (
                <div className="absolute right-4 top-4 bg-black rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>

            <button
              className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors relative"
              onClick={() => {}}
            >
              <div className="pr-8">
                <h3 className="font-semibold text-lg mb-1">
                  Consistent APCA contrast
                </h3>
                <p className="text-gray-500">
                  Each shade number has a consistent APCA contrast value every
                  time you generate a color scale, but your input color may not
                  match any shade exactly.
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
