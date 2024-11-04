// src/types/color-convert.d.ts
declare module "color-convert" {
  const convert: {
    hex: {
      rgb: (hex: string) => [number, number, number];
      hsv: (hex: string) => [number, number, number];
      hsl: (hex: string) => [number, number, number];
    };
    hsv: {
      hex: (hsv: [number, number, number]) => string;
    };
    hsl: {
      hex: (hsl: [number, number, number]) => string;
    };
  };
  export default convert;
}
