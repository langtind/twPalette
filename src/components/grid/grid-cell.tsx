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
        backgroundImage: !showBackground
          ? 'url("data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Crect%20x%3D%270%27%20y%3D%270%27%20width%3D%2710%27%20height%3D%2710%27%20fill%3D%27%23f8f9fa%27%2F%3E%3Crect%20x%3D%2710%27%20y%3D%2710%27%20width%3D%2710%27%20height%3D%2710%27%20fill%3D%27%23f8f9fa%27%2F%3E%3C%2Fsvg%3E")'
          : undefined,
      }}
      className={`p-2 text-sm text-center rounded-lg transition-colors
        ${!showBackground ? "bg-[length:20px_20px]" : ""}`}
    >
      {formattedContrast}
    </div>
  );
}