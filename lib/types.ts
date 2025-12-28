// CSS Output format options
export type CSSFormat = "vanilla" | "bootstrap" | "tailwind";

// UI Framework options (only when TailwindCSS is selected)
export type UIFramework = "none" | "shadcn" | "mui" | "chakra" | "antd";

// Grid configuration state
export interface GridConfig {
  columns: number;
  rows: number;
  gap: number;
  columnGap: number;
  rowGap: number;
  useUniformGap: boolean;
}

// Individual grid item
export interface GridItem {
  id: string;
  columnStart: number;
  columnEnd: number;
  rowStart: number;
  rowEnd: number;
  label: string;
}

// Complete grid state
export interface GridState {
  config: GridConfig;
  items: GridItem[];
}

// Output settings
export interface OutputSettings {
  cssFormat: CSSFormat;
  uiFramework: UIFramework;
  containerClassName: string;
}

// Default configurations
export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 3,
  rows: 3,
  gap: 16,
  columnGap: 16,
  rowGap: 16,
  useUniformGap: true,
};

export const DEFAULT_OUTPUT_SETTINGS: OutputSettings = {
  cssFormat: "vanilla",
  uiFramework: "none",
  containerClassName: "grid-container",
};
