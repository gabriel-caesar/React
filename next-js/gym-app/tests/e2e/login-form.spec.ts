import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/login');
});

test.describe('Login Form', () => {
  test('should log user succesfully', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email');
    const passInput = page.getByPlaceholder('Enter your password');
    const loginBtn = page.getByRole('button', { name: 'Log In' });

    await emailInput.waitFor();
    await passInput.waitFor();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passInput).toBeVisible({ timeout: 5000 });

    emailInput.clear();
    passInput.clear();
    await emailInput.fill('testing@email.com');
    await passInput.fill('testing123456#');
    await loginBtn.click();

    await expect(page).toHaveURL('/dashboard');
    await expect(page).toHaveTitle(/dashboard | diversus/i);
  });

  test('should not log user', async ({ page }) => {
    const emailInput = page.getByPlaceholder('Enter your email');
    const passInput = page.getByPlaceholder('Enter your password');
    const loginBtn = page.getByRole('button', { name: 'Log In' });

    await emailInput.waitFor();
    await passInput.waitFor();
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(passInput).toBeVisible({ timeout: 5000 });

    await emailInput.clear();
    await passInput.clear();
    await emailInput.fill('notexisting@email.com');
    await passInput.fill('fake123456#');
    await loginBtn.click();

    await expect(page).toHaveURL('/login');

    const error = page.getByTestId('errorElement');

    // inputs are not blank after login attempt
    await expect(emailInput).toHaveValue('notexisting@email.com');
    await expect(passInput).toHaveValue('fake123456#');

    await error.waitFor();
    await expect(error).toBeVisible();
    await expect(error).toHaveText(/\* invalid credentials/i);

    await expect(page).toHaveURL('/login');
    await expect(page).toHaveTitle(/login | diversus/i);
  });
});