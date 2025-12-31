"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { CSSFormat, GridConfig, UIFramework } from "@/lib/types";

interface GridControlsProps {
  config: GridConfig;
  cssFormat: CSSFormat;
  uiFramework: UIFramework;
  onConfigChange: (config: Partial<GridConfig>) => void;
  onCSSFormatChange: (format: CSSFormat) => void;
  onUIFrameworkChange: (framework: UIFramework) => void;
}

export function GridControls({
  config,
  cssFormat,
  uiFramework,
  onConfigChange,
  onCSSFormatChange,
  onUIFrameworkChange,
}: GridControlsProps) {
  return (
    <div className="space-y-8">
      {/* Section: Grid Structure */}
      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Structure
        </h3>
        <div className="space-y-6">
          {/* Columns */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="columns" className="text-sm font-medium">
                Columns
              </Label>
              <span className="font-mono text-sm tabular-nums text-foreground">
                {config.columns}
              </span>
            </div>
            <Slider
              id="columns"
              data-testid="columns-input"
              min={1}
              max={12}
              step={1}
              value={[config.columns]}
              onValueChange={([value]) => onConfigChange({ columns: value })}
              className="w-full"
            />
          </div>

          {/* Rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rows" className="text-sm font-medium">
                Rows
              </Label>
              <span className="font-mono text-sm tabular-nums text-foreground">
                {config.rows}
              </span>
            </div>
            <Slider
              id="rows"
              data-testid="rows-input"
              min={1}
              max={12}
              step={1}
              value={[config.rows]}
              onValueChange={([value]) => onConfigChange({ rows: value })}
              className="w-full"
            />
          </div>

          {/* Gap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="gap" className="text-sm font-medium">
                Gap
              </Label>
              <span className="font-mono text-sm tabular-nums text-foreground">
                {config.gap}px
              </span>
            </div>
            <Slider
              id="gap"
              min={0}
              max={64}
              step={4}
              value={[config.gap]}
              onValueChange={([value]) =>
                onConfigChange({
                  gap: value,
                  columnGap: value,
                  rowGap: value,
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Section: Output */}
      <section>
        <h3 className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Output
        </h3>
        <div className="space-y-4">
          {/* CSS Format */}
          <div className="space-y-2">
            <Label htmlFor="css-format" className="text-sm font-medium">
              CSS
            </Label>
            <Select
              value={cssFormat}
              onValueChange={(v) => onCSSFormatChange(v as CSSFormat)}
            >
              <SelectTrigger id="css-format" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vanilla">Vanilla CSS</SelectItem>
                <SelectItem value="bootstrap">Bootstrap</SelectItem>
                <SelectItem value="tailwind">TailwindCSS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* UI Framework - only shown when TailwindCSS is selected */}
          {cssFormat === "tailwind" && (
            <div className="space-y-2">
              <Label htmlFor="ui-framework" className="text-sm font-medium">
                Framework
              </Label>
              <Select
                value={uiFramework}
                onValueChange={(v) => onUIFrameworkChange(v as UIFramework)}
              >
                <SelectTrigger id="ui-framework" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="shadcn">shadcn/ui</SelectItem>
                  <SelectItem value="mui">Material UI</SelectItem>
                  <SelectItem value="chakra">Chakra UI</SelectItem>
                  <SelectItem value="antd">Ant Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
