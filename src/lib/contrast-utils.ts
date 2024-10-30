export type Method = "apca" | "wcag2";
export type Score = "AA" | "AAA" | "all";

export const getWCAG2Contrast = (l1: number, l2: number) => {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const getAPCAContrast = (l1: number, l2: number) => {
  // Simplified APCA approach based on lightness perception
  const isLightOnDark = l1 < l2;

  const contrast = isLightOnDark
    ? 0.138 * Math.pow(l2 - l1, 0.5) * 100
    : 0.138 * Math.pow(l1 - l2, 0.5) * 100;

  return Math.abs(contrast);
};

export const ratioToPercentage = (ratio: number) => {
  return Math.min((ratio / 7) * 100, 100);
};

export const getContrast = (l1: number, l2: number, method: Method) => {
  const contrast =
    method === "apca" ? getAPCAContrast(l1, l2) : getWCAG2Contrast(l1, l2);
  return Math.abs(contrast); // Ensure positive contrast
};

export const meetsContrastThreshold = (ratio: number, score: Score) => {
  if (score === "all") return true;

  // Define WCAG 2 standard contrast thresholds
  const threshold = score === "AA" ? 4.5 : 7.0;
  return ratio >= threshold;
};
