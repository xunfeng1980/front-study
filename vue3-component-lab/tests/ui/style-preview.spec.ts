import { expect, test } from '@playwright/test'

test('style preview renders CSS, Sass and Tailwind fixtures', async ({ page }) => {
  await page.goto('/style-preview')

  const cssGrid = page.getByTestId('css-grid')
  const cssCard = page.getByTestId('css-card-active')
  const sassPanel = page.getByTestId('sass-panel')
  const tailwindCard = page.getByTestId('tailwind-card')
  const tailwindBadge = page.getByTestId('tailwind-badge')

  const gridTemplateColumns = await cssGrid.evaluate((node) =>
    getComputedStyle(node).gridTemplateColumns,
  )
  expect(gridTemplateColumns).toContain(' ')

  const cardTransform = await cssCard.evaluate((node) => getComputedStyle(node).transform)
  expect(cardTransform).not.toBe('none')

  const borderRadius = await sassPanel.evaluate((node) => getComputedStyle(node).borderRadius)
  expect(borderRadius).not.toBe('0px')

  const cardPadding = await tailwindCard.evaluate((node) => getComputedStyle(node).paddingTop)
  expect(cardPadding).not.toBe('0px')

  const badgeDisplay = await tailwindBadge.evaluate((node) => getComputedStyle(node).display)
  expect(badgeDisplay).toBe('inline-flex')
})
