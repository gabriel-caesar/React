import { test, expect } from '@playwright/test';

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

    await firstName.waitFor(); // waits for the firstName to be visible
    await expect(firstName).toBeVisible({ timeout: 1000 });

    await firstName.clear();
    await firstName.fill('John');
    await lastName.fill('Doe');
    await email.fill(`${emailFilling}@email.com`);
    await pass.fill('johndoe123456#');
    await confirmPass.fill('johndoe123456#');

    const nextBtn = page.getByRole('button', { name: 'Register' });

    await nextBtn.click();

    await expect(page).toHaveURL('/login?registered=true');

    await expect(page).toHaveTitle(/login | diversus/i);

    // green text box that tells the user to log in
    const loginFeedback = page.getByTestId('login-feedback');
    await loginFeedback.waitFor();
    await expect(loginFeedback).toBeVisible();
  });

  test(`user can't register with an existent email`, async ({page}) => {
    const email = page.getByPlaceholder('Enter your email');

    await email.waitFor();
    await expect(email).toBeVisible({ timeout: 1000 });

    await email.clear();
    await email.fill(`testing@email.com`);

    const nextBtn = page.getByRole('button', { name: 'Register' });

    await nextBtn.click();

    const emailError = page.getByTestId('email-error');

    await emailError.waitFor();
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText('* Email already in use');

    await expect(page).toHaveURL('/get-started');

    await expect(page).toHaveTitle(/get started | diversus/i);

    // all other errors are already being handled on Jest tests
  })
});
