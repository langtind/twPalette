interface GridCellProps {
  rowShade: { name: string; value: string };
  colShade: { name: string; value: string };
  rowIndex: number;
  colIndex: number;
  contrast: number;
  useAutoTextColor: boolean;
  showBackground: boolean;
  formattedContrast: string;
  useLightText: boolean;
}

export function GridCell({
  rowShade,
  colShade,
  showBackground,
  useAutoTextColor,
  useLightText,
  formattedContrast,
}: GridCellProps) {
  return (
    <div
      style={{
        backgroundColor: showBackground ? colShade.value : undefined,
        color: showBackground
          ? useAutoTextColor
            ? useLightText
              ? "#FFFFFF"
              : "#000000"
            : rowShade.value
          : undefined,
      }}
      className={`p-2 text-sm text-center rounded-lg transition-colors
        ${!showBackground ? "border border-gray-50 dark:border-gray-700" : ""}`}
    >
      {formattedContrast}
    </div>
  );
}
