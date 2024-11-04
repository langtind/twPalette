// src/lib/colors.ts
import convert from "color-convert";
import { generateCustomColorName } from "@/lib/generate-name";

// Constants
const CMY_HUES = [180, 300, 60];
const RGB_HUES = [360, 240, 120, 0];
const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const INTENSITY_MAP: { [key: number]: number } = {
  50: 0.92,
  100: 0.8,
  200: 0.6,
  300: 0.4,
  400: 0.25,
  500: 0,
  600: 0.2,
  700: 0.4,
  800: 0.6,
  900: 0.8,
  950: 0.9,
};

// Helper Functions
function hueShift(hues: number[], hue: number, intensity: number): number {
  const closestHue = hues.reduce((a, b) =>
    Math.abs(b - hue) < Math.abs(a - hue) ? b : a,
  );
  return Math.round(intensity * (closestHue - hue) * 0.5);
}

function lighten(hex: string, intensity: number): string {
  const [h, s, v] = convert.hex.hsv(hex);
  const hue = h + hueShift(CMY_HUES, h, intensity);
  const saturation = Math.max(0, s - Math.round(s * intensity * 0.75));
  const value = Math.min(100, v + Math.round((100 - v) * intensity * 0.85));
  return `#${convert.hsv.hex([hue, saturation, value])}`;
}

function darken(hex: string, intensity: number): string {
  const [h, s, v] = convert.hex.hsv(hex);
  const hue = h + hueShift(RGB_HUES, h, 1 - intensity);
  const saturation = Math.min(100, s + Math.round((100 - s) * intensity * 0.5));
  const value = Math.max(0, v - Math.round(v * intensity * 0.85));
  return `#${convert.hsv.hex([hue, saturation, value])}`;
}

function calculateBrightness(hex: string): number {
  const [r, g, b] = convert.hex.rgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateLevel(hex: string): number {
  const brightness = calculateBrightness(hex);
  if (brightness > 200) return 100;
  if (brightness > 150) return 300;
  if (brightness < 90) return 900;
  if (brightness < 100) return 700;
  return 500;
}

// Main Shade Generation Functions
function generateTailwindShades(
  baseColor: string,
  fixInputColorTo500: boolean,
): { shades: { [key: number]: string }; baseLevel: number } {
  const baseLevel = fixInputColorTo500 ? 500 : calculateLevel(baseColor);
  const shades: { [key: number]: string } = { [baseLevel]: baseColor };

  SHADE_STEPS.forEach((level) => {
    if (level < baseLevel) {
      shades[level] = lighten(baseColor, INTENSITY_MAP[level]);
    } else if (level > baseLevel) {
      shades[level] = darken(baseColor, INTENSITY_MAP[level]);
    }
  });

  return { shades, baseLevel };
}

function generateLinearShades(
  baseColor: string,
  fixInputColorTo500: boolean,
): { shades: { [key: number]: string }; baseLevel: number } {
  const [h, s, l] = convert.hex.hsl(baseColor);
  const baseLevel = fixInputColorTo500 ? 500 : calculateLevel(baseColor);

  // Calculate the range for lightness adjustment
  const maxLightness = Math.min(100, l + (100 - l) * (1 - baseLevel / 1000));
  const minLightness = Math.max(0, l - l * (baseLevel / 1000));
  const lightnessRange = maxLightness - minLightness;

  const shades: { [key: number]: string } = {};

  SHADE_STEPS.forEach((step) => {
    const stepPosition = (step - 50) / 900; // Normalize step position between 0 and 1
    const lightness = maxLightness - stepPosition * lightnessRange;
    const clampedLightness = Math.max(0, Math.min(100, lightness));

    let adjustedSaturation = s;
    if (clampedLightness > 90) adjustedSaturation = Math.max(0, s - 15);
    else if (clampedLightness < 10) adjustedSaturation = Math.max(0, s - 20);

    shades[step] =
      `#${convert.hsl.hex([h, adjustedSaturation, Math.round(clampedLightness)])}`;
  });

  // Ensure the base color is set for the base level
  shades[baseLevel] = baseColor;

  return { shades, baseLevel };
}

// Exported Functions
export function generateShades(
  baseColor: string,
  useTailwindCharacteristics: boolean = true,
  fixInputColorTo500: boolean = false,
) {
  const fullColorCode = `#${baseColor.replace("#", "").padEnd(6, "0")}`;
  const [h, s, l] = convert.hex.hsl(fullColorCode);
  const name = generateCustomColorName(h, s / 100, l / 100);

  if (useTailwindCharacteristics) {
    const { shades, baseLevel } = generateTailwindShades(
      fullColorCode,
      fixInputColorTo500,
    );
    return { shades, baseLevel, name };
  } else {
    const { shades, baseLevel } = generateLinearShades(
      fullColorCode,
      fixInputColorTo500,
    );
    return { shades, baseLevel, name };
  }
}

export const generateRandomHex = (): string => {
  return `#${Array.from({ length: 6 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
};

export const getLuminance = (hex: string): number => {
  return hexToNormalizedRgb(hex)
    .map((val) =>
      val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4),
    )
    .reduce((acc, val, idx) => acc + val * [0.2126, 0.7152, 0.0722][idx], 0);
};

export const shouldUseLightText = (hex: string): boolean =>
  getLuminance(hex) < 0.5;

export const hexToNormalizedRgb = (hex: string): number[] => {
  return convert.hex.rgb(hex).map((val: number) => val / 255);
};
