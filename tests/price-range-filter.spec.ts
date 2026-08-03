import { test, expect } from '@playwright/test';

/**
 * Price Range Filter - E2E Tests (scoped strictly to price min/max filter)
 *
 * Prereq: App server running and accessible at BASE_URL (default: http://localhost:3001/)
 */

const BASE_URL = process.env.BASE_URL' || 'http://localhost:3001/';

function parsePriceText(text: string): number {
  // Expects format like "$120/night"
  const m = text.match(/\$([0-9.+-)]+)/);
  if (!m) throw new Error('Could not parse price from: ' + text);
  return Number(m[1]);
}

async function goToApp(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  // Wait till UI is ready (amenities loaded in the adv filters sidebar)
  await expect(page.locator('#amenities-list')).notToContainText(/Loading.../i);
}

async function setPriceRange(page: any, min?: string, max?: string) {
  const minInput = page.getByLabel(/Minimum price per night/i);
  const maxInput = page.getByLabel(/Maximum price per night/i);

  if (min !== undefined) {
    await minInput.fill('');
    await minInput.type(min);
  } else {
    await minInput.fill('');
  }

  if (max !== undefined) {
    await maxInput.fill('');
    await maxInput.type(max);
  } else {
    await maxInput.fill('');
  }
}

async function clickSearchWaitResults(page: any) {
  await page.getByRole('button', { name: 'Search' }).click();
  await page.locator('#results').waitFor();
  await expect(page.locator('#results')).not.toContainText(/Searching.../i);
}

async function getResultPrices(page: any): Promise<number[]> {
  const priceNodes = page.locator('.result-card .price');
  const count = await priceNodes.count();
  const prices: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = await priceNodes.nth(i).innerText();
    prices.push(parsePriceText(t));
  }
  return prices;
}

test.describe('Price Range Filter - SEARCH', () => {
  test.beforeEach(async ({ page }) => {
    await goToApp(page);
  });

  test('EPMMCDMETST-57797: Valid minimum and maximum price filter returns results within range', async ({ page }) => {
    await setPriceRange(page, '90', '200');

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);

    const prices = await getResultPrices(page);
    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices) {
      expect(p).toBeGreaterThanOrEqual(90);
      expect(p).toBeLessThanOrEqual(200);
    }
  });

  test('EPMMCDMETST-57797: Minimum price only filter filters results by lower bound', async ({ page }) => {
    await setPriceRange(page, '200', undefined);

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;
    expect(response.ok()).toBeTruthy();

    const prices = await getResultPrices(page);
    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices) {
      expect(p).toBeGreaterThanOrEqual(200);
    }
  });

  test('EPMMCDMETST-57797: Maximum price only filter filters results by upper bound', async ({ page }) => {
    await setPriceRange(page, undefined, '150');

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;
    expect(response.ok()).toBeTruthy();

    const prices = await getResultPrices(page);
    expect(prices.length).toBeGreaterThan(0);
    for (const p of prices) {
      expect(p).toBeLessThanOrEqual(150);
    }
  });

  test('EPMMCDMETST-57797: Invalid - negative minPrice returns validation error (HTTP 400)', async ({ page }) => {
    await setPriceRange(page, '-1', undefined);

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;

    expect(response.status()).toBe(400);
    await expect(page.locator('#results')).toContainText(/minPrice must be a non-negative number/i);
  });

  test('EPMMCDMETST-57797: Invalid - non-numeric minPrice returns validation error (HTTP 400)', async ({ page }) => {
    // Type into a number input; it may end up empty, but app in SEARCH aPI should validate when param is sent.
    // To ensure param is send, we also set via dom value injection.
    const minInput = page.getByLabel(/Minimum price per night/i);
    await minInput.fill('');
    await minInput.type('abc');
    // force non-numeric value into the input for this negative test
    await page.evaluate(() => {
      const el = document.querySelector('input[aria-label="Minimum price per night"]');
      if (el) el.value = 'abc';
    });

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;

    expect(response.status()).toBe(400);
    await expect(page.locator('#results')).toContainText(/minPrice must be a non-negative number/i);
  });

  test('EPMCDMETST-57797: Invalid - minPrice > maxPrice returns validation error (HTTP 400)', async ({ page }) => {
    await setPriceRange(page, '250', '100');

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;

    expect(response.status()).toBe(400);
    await expect(page.locator('#results')).toContainText(/minPrice must be less than or equal to maxPrice/i);
  });

  test('EPMCDMETST-57797: No results - price range with no matches shows empty state', async ({ page }) => {
    await setPriceRange(page, '10000', '10500');

    const waitResponse = page.waitForResponse((r: any) => r.url().includes('/api/search') && r.request().method() === 'GET');
    await clickSearchWaitResults(page);
    const response = await waitResponse;

    expect(response.ok()).toBeTruthy();

    await expect(page.locator('#results')).toContainText(/No accommodations found matching your filters/i);
  });
});
