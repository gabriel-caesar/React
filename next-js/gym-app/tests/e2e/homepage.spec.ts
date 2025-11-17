import { test, expect } from '@playwright/test';

test.describe('Home Page', () => { 

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })

  test('should have correct metadata and elements', async ({ page }) => {
    const gymImg = page.getByAltText('gym-photo');
    const logoImg = page.getByAltText('brand-logo');

    await expect(gymImg).toBeVisible();
    await expect(logoImg).toBeVisible();

    await expect(gymImg).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });
    await expect(logoImg).toHaveScreenshot({ maxDiffPixelRatio: 0.01 });

    // rest of the elements are already being tested with Jest
  });

  test('should redirect the user to registration form', async ({ page }) => {

    await page.getByRole('link', { name: /get started/i }).click();

    await expect(page).toHaveTitle(/get started | diversus/i);

    await expect(page).toHaveURL('/get-started');

  })

  test('should redirect the user to login form', async ({ page }) => {

    await page.getByRole('link', { name: /log in/i }).click();

    await expect(page).toHaveTitle(/login | diversus/i);

    await expect(page).toHaveURL('/login');

  })

})