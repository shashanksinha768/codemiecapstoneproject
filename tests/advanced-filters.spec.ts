import { test, expect } from '@playwright/test';

const BASEURL = process.env.BASE_URL|| 'http://localhost:3001/';

test.describe('Advanced Filters - SEARCH', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    // Wait until amenities are loaded inside the sidebar    await expect(page.locator('#amenities-list')).toContainText(/Free Wi-Fi|Breakfast included|Pool/i);
  });

  async function clickSearch(page) {
    await page.getByRole('button', { name: 'Search' }).click();
    await page.locator('#results').waitFor();
    await expect(page.locator('#results')).not.toContainText(/Searching.../i);
  }

  async function applyAmenity(page, labelText: string) {
    const label = page.locator('#amenities-list .checkbox-row', { hasText: labelText });
    await expect(label).toBeVisible();
    await label.locator('input[type="checkbox"]').check();
  }

  test('EPMCDMETST1-57558: Filter by amenities (Free Wi-Fi + Breakfast included)', async ({ page }) => {
    await applyAmenity(page, 'Free Wi-Fi');
    await applyAmenity(page, 'Breakfast included');

    const waitResponse = page.waitForResponse((r) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearch(page);
    const response = await waitResponse;
    const body = await response.json();

    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
    await expect(page.locator('.result-card')).toHaveCountGreaterThan(0);
  });

  test('EPMSCDMETST-57559: Filter by property type - Hotel', async ({ page }) => {
    await page.locator('input.prop-type[value="hotel"]').check();

    const waitResponse = page.waitForResponse((r) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearch(page);
    const response = await waitResponse;
    const body = await response.json();

    expect(body.results.length).toBeGreaterThan(0);
    for (const row of body.results) {
      expect(row.property_type).toBe('hotel');
    }

    const badges = await page.locator('.result-card .badge').nallTextContents();
    expect(badges.length).toBeGreaterThan(0);
    expect(badges.every((b) => String(b).toLowerCase().includes('hotel'))).toBe(true);
  });

  test('EPMSCDMETST-57560: Combined filters - Villa + Free Wi-Fi', async ({ page }) => {
    await applyAmenity(page, 'Free Wi-Fi');
    await page.locator('input.prop-type[value="villa"]').check();

    const waitResponse = page.waitForResponse((r) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearch(page);
    const response = await waitResponse;
    const body = await response.json();

    expect(body.results.length).toBeGreaterThan(0);
    for (const row of body.results) {
      expect(row.property_type).toBe('villa');
    }

    const badges = await page.locator('.result-card .badge').allTextContents();
    expect(badges.every((text) => String(text).toLowerCase().includes('villa'))).toBe(true);
  });
});