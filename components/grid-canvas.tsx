"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { GridConfig, GridItem } from "@/lib/types";
import { X } from "lucide-react";

interface GridCanvasProps {
  config: GridConfig;
  items: GridItem[];
  onItemsChange: (items: GridItem[]) => void;
  className?: string;
}

export function GridCanvas({
  config,
  items,
  onItemsChange,
  className,
}: GridCanvasProps) {
  const { columns, rows, gap, columnGap, rowGap, useUniformGap } = config;
  const canvasRef = useRef<HTMLDivElement>(null);

  // Selection state
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Resize state
  const [isResizing, setIsResizing] = useState(false);

  // Preview positions during drag/resize for smooth animation
  const [previewPositions, setPreviewPositions] = useState<
    Record<
      string,
      {
        columnStart: number;
        columnEnd: number;
        rowStart: number;
        rowEnd: number;
      }
    >
  >({});

  const gapStyle = useUniformGap
    ? { gap: `${gap}px` }
    : { columnGap: `${columnGap}px`, rowGap: `${rowGap}px` };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    ...gapStyle,
  };

  // Get cell position from pixel coordinates
  const getCellFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return null;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const cellWidth = rect.width / columns;
      const cellHeight = rect.height / rows;

      const col = Math.floor(x / cellWidth) + 1;
      const row = Math.floor(y / cellHeight) + 1;

      if (col < 1 || col > columns || row < 1 || row > rows) return null;

      return { col, row };
    },
    [columns, rows]
  );

  // Find item at specific cell
  const getItemAtCell = useCallback(
    (col: number, row: number, excludeId?: string) => {
      return items.find((item) => {
        if (excludeId && item.id === excludeId) return false;
        return (
          col >= item.columnStart &&
          col < item.columnEnd &&
          row >= item.rowStart &&
          row < item.rowEnd
        );
      });
    },
    [items]
  );

  // Check if area is valid (within bounds and doesn't overlap with non-swappable items)
  const isAreaValid = useCallback(
    (colStart: number, colEnd: number, rowStart: number, rowEnd: number) => {
      return (
        colStart >= 1 &&
        colEnd <= columns + 1 &&
        rowStart >= 1 &&
        rowEnd <= rows + 1
      );
    },
    [columns, rows]
  );

  // Handle click on empty cell to add item
  const handleCellClick = (col: number, row: number) => {
    const existingItem = getItemAtCell(col, row);
    if (existingItem) return;

    setSelectedItem(null);

    const newItem: GridItem = {
      id: `item-${Date.now()}`,
      columnStart: col,
      columnEnd: col + 1,
      rowStart: row,
      rowEnd: row + 1,
      label: `${items.length + 1}`,
    };

    onItemsChange([...items, newItem]);
    setTimeout(() => setSelectedItem(newItem.id), 0);
  };

  // Handle item click to select
  const handleItemClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(selectedItem === id ? null : id);
  };

  // Handle delete item
  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onItemsChange(items.filter((item) => item.id !== id));
    if (selectedItem === id) setSelectedItem(null);
  };

  // Handle drag start
  const handleDragStart = (id: string, e: React.MouseEvent) => {
    if (selectedItem !== id) return;

    e.preventDefault();
    e.stopPropagation();

    const item = items.find((i) => i.id === id);
    if (!item) return;

    setIsDragging(true);

    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (cell) {
      setDragOffset({
        x: cell.col - item.columnStart,
        y: cell.row - item.rowStart,
      });
    }

    // Initialize preview positions for all items
    const initialPositions: Record<string, (typeof previewPositions)[string]> =
      {};
    items.forEach((i) => {
      initialPositions[i.id] = {
        columnStart: i.columnStart,
        columnEnd: i.columnEnd,
        rowStart: i.rowStart,
        rowEnd: i.rowEnd,
      };
    });
    setPreviewPositions(initialPositions);
  };

  // Handle resize start
  const handleResizeStart = (id: string, e: React.MouseEvent) => {
    if (selectedItem !== id) return;

    e.preventDefault();
    e.stopPropagation();

    const item = items.find((i) => i.id === id);
    if (!item) return;

    setIsResizing(true);

    const initialPositions: Record<string, (typeof previewPositions)[string]> =
      {};
    items.forEach((i) => {
      initialPositions[i.id] = {
        columnStart: i.columnStart,
        columnEnd: i.columnEnd,
        rowStart: i.rowStart,
        rowEnd: i.rowEnd,
      };
    });
    setPreviewPositions(initialPositions);
  };

  // Handle mouse move for drag/resize with swap logic
  useEffect(() => {
    if (!isDragging && !isResizing) return;
    if (!selectedItem) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cell = getCellFromPoint(e.clientX, e.clientY);
      if (!cell) return;

      const draggedItem = items.find((i) => i.id === selectedItem);
      if (!draggedItem) return;

      if (isDragging) {
        const width = draggedItem.columnEnd - draggedItem.columnStart;
        const height = draggedItem.rowEnd - draggedItem.rowStart;

        let newColStart = cell.col - dragOffset.x;
        let newRowStart = cell.row - dragOffset.y;

        // Keep within bounds
        newColStart = Math.max(1, Math.min(newColStart, columns - width + 1));
        newRowStart = Math.max(1, Math.min(newRowStart, rows - height + 1));

        const newColEnd = newColStart + width;
        const newRowEnd = newRowStart + height;

        // Find items that would be overlapped
        const overlappedItems: GridItem[] = [];
        for (let c = newColStart; c < newColEnd; c++) {
          for (let r = newRowStart; r < newRowEnd; r++) {
            const itemAtCell = getItemAtCell(c, r, selectedItem);
            if (
              itemAtCell &&
              !overlappedItems.find((i) => i.id === itemAtCell.id)
            ) {
              overlappedItems.push(itemAtCell);
            }
          }
        }

        // Calculate new positions with swap logic
        const newPositions: Record<string, (typeof previewPositions)[string]> =
          {};

        // Set dragged item's new position
        newPositions[selectedItem] = {
          columnStart: newColStart,
          columnEnd: newColEnd,
          rowStart: newRowStart,
          rowEnd: newRowEnd,
        };

        // Swap overlapped items to dragged item's original position
        if (overlappedItems.length > 0) {
          const originalPos = {
            columnStart: draggedItem.columnStart,
            columnEnd: draggedItem.columnEnd,
            rowStart: draggedItem.rowStart,
            rowEnd: draggedItem.rowEnd,
          };

          // For single item overlap, do a direct swap
          if (overlappedItems.length === 1) {
            const swapItem = overlappedItems[0];
            const swapWidth = swapItem.columnEnd - swapItem.columnStart;
            const swapHeight = swapItem.rowEnd - swapItem.rowStart;

            // Check if swap item fits in original position
            const newSwapColEnd = originalPos.columnStart + swapWidth;
            const newSwapRowEnd = originalPos.rowStart + swapHeight;

            if (
              isAreaValid(
                originalPos.columnStart,
                newSwapColEnd,
                originalPos.rowStart,
                newSwapRowEnd
              )
            ) {
              newPositions[swapItem.id] = {
                columnStart: originalPos.columnStart,
                columnEnd: newSwapColEnd,
                rowStart: originalPos.rowStart,
                rowEnd: newSwapRowEnd,
              };
            }
          }
        }

        // Keep other items in their current positions
        items.forEach((item) => {
          if (!newPositions[item.id]) {
            newPositions[item.id] = {
              columnStart: item.columnStart,
              columnEnd: item.columnEnd,
              rowStart: item.rowStart,
              rowEnd: item.rowEnd,
            };
          }
        });

        setPreviewPositions(newPositions);
      }

      if (isResizing) {
        let newColEnd = Math.max(
          draggedItem.columnStart + 1,
          Math.min(cell.col + 1, columns + 1)
        );
        let newRowEnd = Math.max(
          draggedItem.rowStart + 1,
          Math.min(cell.row + 1, rows + 1)
        );

        // For resize, we don't swap - just prevent overlap
        let hasCollision = false;
        for (let c = draggedItem.columnStart; c < newColEnd; c++) {
          for (let r = draggedItem.rowStart; r < newRowEnd; r++) {
            if (getItemAtCell(c, r, selectedItem)) {
              hasCollision = true;
              break;
            }
          }
          if (hasCollision) break;
        }

        if (!hasCollision) {
          const newPositions: Record<
            string,
            (typeof previewPositions)[string]
          > = {};
          items.forEach((item) => {
            if (item.id === selectedItem) {
              newPositions[item.id] = {
                columnStart: draggedItem.columnStart,
                columnEnd: newColEnd,
                rowStart: draggedItem.rowStart,
                rowEnd: newRowEnd,
              };
            } else {
              newPositions[item.id] = {
                columnStart: item.columnStart,
                columnEnd: item.columnEnd,
                rowStart: item.rowStart,
                rowEnd: item.rowEnd,
              };
            }
          });
          setPreviewPositions(newPositions);
        }
      }
    };

    const handleMouseUp = () => {
      // Apply all preview positions to actual items
      if (Object.keys(previewPositions).length > 0) {
        onItemsChange(
          items.map((item) => ({
            ...item,
            ...(previewPositions[item.id] || {}),
          }))
        );
      }

      setIsDragging(false);
      setIsResizing(false);
      setPreviewPositions({});
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    selectedItem,
    items,
    columns,
    rows,
    dragOffset,
    getCellFromPoint,
    getItemAtCell,
    isAreaValid,
    onItemsChange,
    previewPositions,
  ]);

  // Click outside to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedItem(null);
    }
  };

  // Generate empty cells for click targets
  const cells = [];
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= columns; col++) {
      const occupied = getItemAtCell(col, row);
      cells.push(
        <div
          key={`cell-${col}-${row}`}
          onClick={() => !occupied && handleCellClick(col, row)}
          className={cn(
            "flex items-center justify-center rounded-sm border border-dashed",
            occupied
              ? "border-transparent"
              : "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors duration-200"
          )}
          style={{
            gridColumn: col,
            gridRow: row,
          }}
        >
          {!occupied && (
            <span className="text-xs text-muted-foreground/50 select-none">
              +
            </span>
          )}
        </div>
      );
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Grid info bar */}
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Canvas
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {columns} × {rows}
          </span>
          {items.length > 0 && (
            <span className="text-xs text-primary font-medium">
              {items.length} item{items.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Grid canvas */}
      <div
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={cn(
          "relative aspect-square w-full rounded-sm border border-border bg-background p-4",
          (isDragging || isResizing) && "cursor-grabbing"
        )}
        style={gridStyle}
      >
        {/* Empty cells (click targets) */}
        {cells}

        {/* Grid items with motion */}
        <AnimatePresence>
          {items.map((item) => {
            const isSelected = selectedItem === item.id;
            const isActive = isDragging || isResizing;

            // Use preview position if available
            const position = previewPositions[item.id] || {
              columnStart: item.columnStart,
              columnEnd: item.columnEnd,
              rowStart: item.rowStart,
              rowEnd: item.rowEnd,
            };

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: isSelected && isActive ? 1.02 : 1,
                  zIndex: isSelected ? 10 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  layout: { type: "spring", stiffness: 400, damping: 30 },
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.15 },
                }}
                onClick={(e) => handleItemClick(item.id, e)}
                onMouseDown={(e) => isSelected && handleDragStart(item.id, e)}
                className={cn(
                  "group relative flex items-center justify-center rounded-sm select-none",
                  isSelected
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg cursor-grab"
                    : "bg-primary/70 text-primary-foreground/90 hover:bg-primary/80 cursor-pointer",
                  isSelected && isActive && "cursor-grabbing shadow-xl"
                )}
                style={{
                  gridColumn: `${position.columnStart} / ${position.columnEnd}`,
                  gridRow: `${position.rowStart} / ${position.rowEnd}`,
                }}
              >
                {/* Label */}
                <motion.span
                  className="text-sm font-medium"
                  animate={{ scale: isSelected && isActive ? 1.1 : 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {item.label}
                </motion.span>

                {/* Delete button - only on selected */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md hover:scale-110 transition-transform"
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Resize handle - only on selected */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: isResizing ? 1.25 : 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.15 }}
                      onMouseDown={(e) => handleResizeStart(item.id, e)}
                      className="absolute -bottom-1 -right-1 flex h-4 w-4 cursor-se-resize items-center justify-center rounded-sm bg-primary-foreground/20 hover:bg-primary-foreground/40 transition-colors"
                    >
                      <svg
                        className="h-2.5 w-2.5 text-primary-foreground"
                        viewBox="0 0 10 10"
                        fill="currentColor"
                      >
                        <path d="M9 1v8H1l8-8z" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">+</kbd>{" "}
          add
        </span>
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
            Click
          </kbd>{" "}
          select
        </span>
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Drag</kbd>{" "}
          move/swap
        </span>
        <span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">↘</kbd>{" "}
          resize
        </span>
      </div>
    </div>
  );
}
