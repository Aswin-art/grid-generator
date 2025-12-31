import { expect, test } from "@playwright/test";

test.describe("Grid Generator", () => {
  test("should load the homepage with correct title", async ({ page }) => {
    await page.goto("/");

    // Check if the page title contains Grid Generator
    await expect(page).toHaveTitle(/Grid Generator/i);

    // Check if the main heading is visible
    await expect(page.locator("h1")).toContainText("Grid Generator");
  });

  test("should display the grid canvas", async ({ page }) => {
    await page.goto("/");

    // Check if the grid canvas is visible
    const gridCanvas = page.locator('[data-testid="grid-canvas"]');
    await expect(gridCanvas).toBeVisible();
  });

  test("should display grid controls", async ({ page }) => {
    await page.goto("/");

    // Check if columns slider is visible
    const columnsSlider = page.locator('[data-testid="columns-input"]');
    await expect(columnsSlider).toBeVisible();

    // Check if rows slider is visible
    const rowsSlider = page.locator('[data-testid="rows-input"]');
    await expect(rowsSlider).toBeVisible();
  });

  test("should display code output section", async ({ page }) => {
    await page.goto("/");

    // Check if code output area exists
    const codeOutput = page.locator('[data-testid="code-output"]');
    await expect(codeOutput).toBeVisible();

    // Check if HTML and CSS tabs are present
    await expect(page.getByRole("tab", { name: "HTML" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "CSS" })).toBeVisible();
  });

  test("should add grid item when clicking on empty cell", async ({ page }) => {
    await page.goto("/");

    // Find an empty cell (marked with +) and click it
    const emptyCell = page
      .locator('[data-testid="grid-canvas"] >> text=+')
      .first();
    await emptyCell.click();

    // Check if a grid item was added (item with label "1")
    await expect(
      page.locator('[data-testid="grid-canvas"]').getByText("1"),
    ).toBeVisible();
  });

  test("should show Clear All button after adding items", async ({ page }) => {
    await page.goto("/");

    // Initially Clear All button should not be visible
    await expect(
      page.getByRole("button", { name: /Clear All/i }),
    ).not.toBeVisible();

    // Click on empty cell to add item
    const emptyCell = page
      .locator('[data-testid="grid-canvas"] >> text=+')
      .first();
    await emptyCell.click();

    // Clear All button should now be visible
    await expect(
      page.getByRole("button", { name: /Clear All/i }),
    ).toBeVisible();
  });

  test("should switch between HTML and CSS tabs", async ({ page }) => {
    await page.goto("/");

    // Click on CSS tab
    await page.getByRole("tab", { name: "CSS" }).click();

    // CSS tab should be active
    await expect(page.getByRole("tab", { name: "CSS" })).toHaveAttribute(
      "data-state",
      "active",
    );

    // Click on HTML tab
    await page.getByRole("tab", { name: "HTML" }).click();

    // HTML tab should be active
    await expect(page.getByRole("tab", { name: "HTML" })).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
