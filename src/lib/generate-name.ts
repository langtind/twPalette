const baseNames = [
  { name: "red", hue: 0 },
  { name: "orange", hue: 30 },
  { name: "yellow", hue: 60 },
  { name: "lime", hue: 90 },
  { name: "green", hue: 120 },
  { name: "teal", hue: 150 },
  { name: "cyan", hue: 180 },
  { name: "blue", hue: 210 },
  { name: "indigo", hue: 240 },
  { name: "violet", hue: 270 },
  { name: "purple", hue: 300 },
  { name: "pink", hue: 330 },
];

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const prefixes = [
  "Electric",
  "Royal",
  "Deep",
  "Bright",
  "Vivid",
  "Cosmic",
  "Crystal",
  "Mystic",
];

export function generateColorName(
  hue: number,
  saturation: number,
  lightness: number,
): string {
  let closestName = baseNames[0].name;
  let closestDiff = 360;

  baseNames.forEach(({ name, hue: baseHue }) => {
    const diff = Math.min(
      Math.abs(hue - baseHue),
      Math.abs(hue - baseHue + 360),
    );
    if (diff < closestDiff) {
      closestDiff = diff;
      closestName = name;
    }
  });

  // Determine the shade based on lightness and saturation
  const shadeIndex = Math.round((1 - lightness) * (shades.length - 1));
  let shade = shades[shadeIndex];

  // Adjust shade based on saturation
  if (saturation < 0.3) {
    shade = Math.max(50, shade - 200); // For very unsaturated colors, use lighter shades
  } else if (saturation > 0.7) {
    shade = Math.min(950, shade + 200); // For highly saturated colors, use darker shades
  }

  return `${closestName}-${shade}`;
}

export function generateCustomColorName(
  hue: number,
  saturation: number,
  lightness: number,
): string {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const baseName = generateColorName(hue, saturation, lightness).split("-")[0]; // Get just the base color name
  const capitalizedBaseName =
    baseName.charAt(0).toUpperCase() + baseName.slice(1); // Capitalize the base name
  return `${prefix} ${capitalizedBaseName}`; // Add a space here
}
