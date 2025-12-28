"use client";

import { useState, useMemo } from "react";
import { GridCanvas } from "@/components/grid-canvas";
import { GridControls } from "@/components/grid-controls";
import { CodeOutput } from "@/components/code-output";
import { generateCode } from "@/lib/generators";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  type GridConfig,
  type GridItem,
  type CSSFormat,
  type UIFramework,
  DEFAULT_GRID_CONFIG,
} from "@/lib/types";

export default function Home() {
  const [config, setConfig] = useState<GridConfig>(DEFAULT_GRID_CONFIG);
  const [items, setItems] = useState<GridItem[]>([]);
  const [cssFormat, setCSSFormat] = useState<CSSFormat>("vanilla");
  const [uiFramework, setUIFramework] = useState<UIFramework>("none");

  const handleConfigChange = (partial: Partial<GridConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const handleCSSFormatChange = (format: CSSFormat) => {
    setCSSFormat(format);
    if (format !== "tailwind") {
      setUIFramework("none");
    }
  };

  const handleClearItems = () => {
    setItems([]);
  };

  // Only generate code when there are items
  const { html, css } = useMemo(() => {
    if (items.length === 0) {
      return {
        html: "<!-- Click on cells above to add grid items -->",
        css: "/* Add items to the grid to generate CSS */",
      };
    }
    return generateCode(config, items, cssFormat, uiFramework);
  }, [config, items, cssFormat, uiFramework]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Grid Generator
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Click cells to add items. Drag to move. Resize from corners. Export
            to CSS.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Left Sidebar - Controls */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-8 space-y-6">
              <GridControls
                config={config}
                cssFormat={cssFormat}
                uiFramework={uiFramework}
                onConfigChange={handleConfigChange}
                onCSSFormatChange={handleCSSFormatChange}
                onUIFrameworkChange={setUIFramework}
              />

              {/* Clear button */}
              {items.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full gap-2 text-destructive hover:text-destructive"
                  onClick={handleClearItems}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All ({items.length})
                </Button>
              )}
            </div>
          </aside>

          {/* Right Content - Canvas & Output */}
          <div className="order-1 space-y-8 lg:order-2">
            {/* Grid Canvas */}
            <section>
              <GridCanvas
                config={config}
                items={items}
                onItemsChange={setItems}
              />
            </section>

            {/* Code Output */}
            <section>
              <CodeOutput html={html} css={css} />
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Built with precision by{" "}
            <a
              href="https://github.com/Aswin-art"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Aswin
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
