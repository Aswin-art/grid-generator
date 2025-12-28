import type { GridConfig, GridItem, CSSFormat, UIFramework } from "./types";

// Generate vanilla CSS
export function generateVanillaCSS(
  config: GridConfig,
  items: GridItem[]
): { html: string; css: string } {
  const { columns, rows, gap, columnGap, rowGap, useUniformGap } = config;

  const gapValue = useUniformGap ? `${gap}px` : `${rowGap}px ${columnGap}px`;

  let css = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${gapValue};
}`;

  let html = `<div class="grid-container">`;

  if (items.length > 0) {
    items.forEach((item, index) => {
      const itemClass = `grid-item-${index + 1}`;
      html += `\n  <div class="${itemClass}">${item.label}</div>`;

      css += `\n\n.${itemClass} {
  grid-column: ${item.columnStart} / ${item.columnEnd};
  grid-row: ${item.rowStart} / ${item.rowEnd};
}`;
    });
  }

  html += `\n</div>`;

  return { html, css };
}

// Generate Bootstrap classes (using CSS Grid since Bootstrap's grid is 12-column based)
export function generateBootstrap(
  config: GridConfig,
  items: GridItem[]
): { html: string; css: string } {
  const { columns, rows, gap } = config;

  // Bootstrap 5 supports CSS Grid via d-grid
  let html = `<div class="d-grid" style="grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, 1fr); gap: ${gap}px;">`;

  if (items.length > 0) {
    items.forEach((item, index) => {
      html += `\n  <div style="grid-column: ${item.columnStart} / ${item.columnEnd}; grid-row: ${item.rowStart} / ${item.rowEnd};">${item.label}</div>`;
    });
  }

  html += `\n</div>`;

  const css = `/* Bootstrap 5 with CSS Grid */
/* Make sure to include Bootstrap CSS in your project:
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
*/

/* d-grid enables CSS Grid display in Bootstrap 5 */`;

  return { html, css };
}

// Generate Tailwind CSS classes
export function generateTailwind(
  config: GridConfig,
  items: GridItem[],
  framework: UIFramework
): { html: string; css: string } {
  const { columns, rows, gap, columnGap, rowGap, useUniformGap } = config;

  // Convert gap to Tailwind spacing (4px = 1 unit)
  const gapValue = Math.round(gap / 4);
  const colGapValue = Math.round(columnGap / 4);
  const rowGapValue = Math.round(rowGap / 4);

  const gapClass = useUniformGap
    ? `gap-${gapValue}`
    : `gap-x-${colGapValue} gap-y-${rowGapValue}`;

  const gridClasses = `grid grid-cols-${columns} grid-rows-${rows} ${gapClass}`;

  // Generate based on framework
  switch (framework) {
    case "shadcn":
      return generateShadcnOutput(gridClasses, items);
    case "mui":
      return generateMUIOutput(config, items);
    case "chakra":
      return generateChakraOutput(config, items);
    case "antd":
      return generateAntDesignOutput(config, items);
    default:
      return generatePlainTailwind(gridClasses, items);
  }
}

function generatePlainTailwind(
  gridClasses: string,
  items: GridItem[]
): { html: string; css: string } {
  let html = `<div class="${gridClasses}">`;

  if (items.length > 0) {
    items.forEach((item) => {
      const colSpan = item.columnEnd - item.columnStart;
      const rowSpan = item.rowEnd - item.rowStart;
      // Use col-start/row-start for exact positioning + span for size
      const posClasses = `col-start-${item.columnStart} col-span-${colSpan} row-start-${item.rowStart} row-span-${rowSpan}`;
      html += `\n  <div class="${posClasses}">${item.label}</div>`;
    });
  }

  html += `\n</div>`;

  const css = `/* Tailwind CSS - No additional CSS needed */
/* Make sure Tailwind CSS is configured in your project */`;

  return { html, css };
}

function generateShadcnOutput(
  gridClasses: string,
  items: GridItem[]
): { html: string; css: string } {
  let html = `{/* shadcn/ui with Tailwind Grid */}
<div className="${gridClasses}">`;

  if (items.length > 0) {
    items.forEach((item) => {
      const colSpan = item.columnEnd - item.columnStart;
      const rowSpan = item.rowEnd - item.rowStart;
      const posClasses = `col-start-${item.columnStart} col-span-${colSpan} row-start-${item.rowStart} row-span-${rowSpan}`;
      html += `\n  <Card className="${posClasses}">
    <CardContent className="p-4">
      ${item.label}
    </CardContent>
  </Card>`;
    });
  }

  html += `\n</div>`;

  const css = `// Import shadcn/ui components
import { Card, CardContent } from "@/components/ui/card"

// No additional CSS needed with Tailwind`;

  return { html, css };
}

function generateMUIOutput(
  config: GridConfig,
  items: GridItem[]
): { html: string; css: string } {
  const { columns, rows, gap } = config;

  // MUI Grid2 with CSS Grid support
  let html = `{/* Material UI with CSS Grid */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(${columns}, 1fr)',
    gridTemplateRows: 'repeat(${rows}, 1fr)',
    gap: ${gap / 8},
  }}
>`;

  if (items.length > 0) {
    items.forEach((item) => {
      html += `\n  <Paper
    sx={{
      gridColumn: '${item.columnStart} / ${item.columnEnd}',
      gridRow: '${item.rowStart} / ${item.rowEnd}',
      p: 2,
    }}
  >
    ${item.label}
  </Paper>`;
    });
  }

  html += `\n</Box>`;

  const css = `// Import MUI components
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

// No additional CSS needed with MUI`;

  return { html, css };
}

function generateChakraOutput(
  config: GridConfig,
  items: GridItem[]
): { html: string; css: string } {
  const { columns, rows, gap } = config;

  let html = `{/* Chakra UI Grid */}
<Grid
  templateColumns="repeat(${columns}, 1fr)"
  templateRows="repeat(${rows}, 1fr)"
  gap={${gap / 4}}
>`;

  if (items.length > 0) {
    items.forEach((item) => {
      html += `\n  <GridItem colStart={${item.columnStart}} colEnd={${item.columnEnd}} rowStart={${item.rowStart}} rowEnd={${item.rowEnd}}>
    <Box p={4} bg="gray.100">
      ${item.label}
    </Box>
  </GridItem>`;
    });
  }

  html += `\n</Grid>`;

  const css = `// Import Chakra UI components
import { Grid, GridItem, Box } from '@chakra-ui/react'

// No additional CSS needed with Chakra UI`;

  return { html, css };
}

function generateAntDesignOutput(
  config: GridConfig,
  items: GridItem[]
): { html: string; css: string } {
  const { columns, rows, gap } = config;

  // Ant Design doesn't have native CSS Grid, so we use inline styles
  let html = `{/* Ant Design with CSS Grid */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(${columns}, 1fr)',
    gridTemplateRows: 'repeat(${rows}, 1fr)',
    gap: ${gap},
  }}
>`;

  if (items.length > 0) {
    items.forEach((item) => {
      html += `\n  <Card
    style={{
      gridColumn: '${item.columnStart} / ${item.columnEnd}',
      gridRow: '${item.rowStart} / ${item.rowEnd}',
    }}
  >
    ${item.label}
  </Card>`;
    });
  }

  html += `\n</div>`;

  const css = `// Import Ant Design components
import { Card } from 'antd';

// No additional CSS needed - using inline CSS Grid styles`;

  return { html, css };
}

// Main generator function
export function generateCode(
  config: GridConfig,
  items: GridItem[],
  cssFormat: CSSFormat,
  uiFramework: UIFramework
): { html: string; css: string } {
  switch (cssFormat) {
    case "vanilla":
      return generateVanillaCSS(config, items);
    case "bootstrap":
      return generateBootstrap(config, items);
    case "tailwind":
      return generateTailwind(config, items, uiFramework);
    default:
      return generateVanillaCSS(config, items);
  }
}
