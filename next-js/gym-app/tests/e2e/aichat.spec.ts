import test, { expect } from '@playwright/test';

// log in into an account before every test
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  const emailInput = page.getByPlaceholder('Enter your email');
  const passInput = page.getByPlaceholder('Enter your password');
  const loginBtn = page.getByRole('button', { name: 'Log In' });
  
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await expect(passInput).toBeVisible({ timeout: 15000 });

  await emailInput.fill('testing@email.com');
  await passInput.fill('testing123456#');
  await loginBtn.click();

  await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  await expect(page).toHaveTitle(/dashboard | diversus/i, { timeout: 15000 });
})

test.describe('Chat input form', () => {
  const username = 'Test'
  const introBubbleContent = `Hello ${username}, to get started you can tell me what are your fitness goals and I will help you achieve it, but that needs to be essentially something related to either workout or a diet.`;

  test('renders the bot introduction bubble succesfully', async ({ page }) => {
    const introBubble = page.getByTestId('greeting-ai-chat-bubble');
    await expect(introBubble).toBeVisible();
    await expect(introBubble).toHaveText(introBubbleContent);
  });

  test('user sends the AI a message and receives a valid response', async ({ page }) => {
    const userInput = page.getByPlaceholder('Enter your message...');
    const sendMessageButton = page.getByRole('button', { name: 'send-message-button' });
    const panelDiv = page.getByTestId('chat-panel');

    await expect(panelDiv).toBeVisible();
    await expect(userInput).toBeVisible();
    await expect(sendMessageButton).toBeVisible();

    await userInput.fill('Hello, computer');
    await expect(userInput).toHaveText('Hello, computer');
    await sendMessageButton.click();
    await expect(userInput).toHaveText('');

    await page.waitForTimeout(5000); // wait for the response generation

    const aiResponse = page.getByLabel('ai-chat-bubble').nth(1); // get the response after the greeting bubble
    await expect(aiResponse).toBeVisible();
    await expect(aiResponse).not.toHaveText(''); // making sure the response is not empty
  })
})