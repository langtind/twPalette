export type Method = "apca" | "wcag2";
export type Score = "60" | "80" | "all";

export const getWCAG2Contrast = (l1: number, l2: number) => {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const getAPCAContrast = (l1: number, l2: number) => {
  // Placeholder for APCA implementation
  const contrast = Math.abs(l1 - l2) * 100;
  return contrast;
};

export const ratioToPercentage = (ratio: number) => {
  return ((ratio - 1) / (21 - 1)) * 106;
};

export const getContrast = (l1: number, l2: number, method: Method) => {
  if (method === "apca") {
    return getAPCAContrast(l1, l2);
  }
  return getWCAG2Contrast(l1, l2);
};

export const meetsContrastThreshold = (ratio: number, score: Score) => {
  if (score === "all") return true;
  const percentage = ratioToPercentage(ratio);
  return score === "60" ? percentage >= 60 : percentage >= 80;
};
