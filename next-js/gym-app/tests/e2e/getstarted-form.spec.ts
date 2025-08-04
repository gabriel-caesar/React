import { test, expect } from '@playwright/test';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

test.describe('Get Started Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/get-started');
  });

  test('user registers successfuly', async ({ page }) => {
    const firstName = page.getByPlaceholder('Enter your first name');
    const lastName = page.getByPlaceholder('Enter your last name');
    const email = page.getByPlaceholder('Enter your email');
    const pass = page.getByPlaceholder('Enter your password');
    const confirmPass = page.getByPlaceholder('Confirm your password');

    let emailFilling = '';

    // generates random emails
    for (let i = 0; i < 10; i++) {
      emailFilling += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    }

    await firstName.fill('John');
    await lastName.fill('Doe');
    await email.fill(`${emailFilling}@email.com`);
    await pass.fill('johndoe123456#');
    await confirmPass.fill('johndoe123456#');

    const nextBtn = page.getByRole('button', { name: 'Register' });

    await nextBtn.click();

    await expect(page).toHaveURL('/dashboard');

    await expect(page).toHaveTitle(/dashboard | diversus/i);
  });

  test(`user can't register with an existent email`, async ({page}) => {
    const email = page.getByPlaceholder('Enter your email');

    await email.fill(`testing@email.com`);

    const nextBtn = page.getByRole('button', { name: 'Register' });

    await nextBtn.click();

    const emailError = page.getByTestId('email-error');

    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('* Email already in use');

    await expect(page).toHaveURL('/get-started');

    await expect(page).toHaveTitle(/get started | diversus/i);

    // all other errors are already being handled on Jest tests
  })
});
