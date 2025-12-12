import test, { expect } from '@playwright/test';

// log in into an account before every test
test.beforeEach(async ({ page }) => {
  await page.goto('/login')
  const emailInput = page.getByPlaceholder('Enter your email');
  const passInput = page.getByPlaceholder('Enter your password');
  const loginBtn = page.getByRole('button', { name: 'Log In' });
  
  await expect(emailInput).toBeVisible({ timeout: 15000 });
  await expect(passInput).toBeVisible({ timeout: 15000 });

  // making sure the login input fields are clear before filling with data
  await emailInput.clear(); 
  await passInput.clear();
  await emailInput.fill('testing@email.com');
  await passInput.fill('testing123456#');
  await loginBtn.click();

  await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
  await expect(page).toHaveTitle(/dashboard | diversus/i, { timeout: 15000 });
})

test.describe('Chat input form', () => {

  test('renders the bot introduction bubble succesfully', async ({ page }) => {
    const introBubble = page.getByTestId('greeting-ai-chat-bubble');
    await introBubble.waitFor();
    await expect(introBubble).toBeVisible();
    await expect(introBubble).not.toHaveText(''); // checking if the bubble
  });

  test('user sends the AI a message and receives a valid response', async ({ page }) => {
    await page.waitForLoadState(); // waits the page load

    const userInput = page.getByPlaceholder('Enter your message...');
    const sendMessageButton = page.getByRole('button', { name: 'send-message-button' });
    const panelDiv = page.getByTestId('chat-panel');

    await panelDiv.waitFor(); // wait for panel to load and bypass the loading skeleton

    await expect(panelDiv).toBeVisible();
    await expect(userInput).toBeVisible();
    await expect(sendMessageButton).toBeVisible();

    await userInput.fill('Hello, computer');
    await expect(userInput).toHaveText('Hello, computer');
    await sendMessageButton.click();
    await expect(userInput).toHaveText('');

    const aiResponse = page.getByLabel('ai-chat-bubble').nth(1); // get the response after the greeting bubble
    await aiResponse.waitFor(); // awaiting the response load
    await expect(aiResponse).toBeVisible();
    await expect(aiResponse).not.toHaveText(''); // making sure the response is not empty
  })
});

test.describe('Workout/Diet form', () => {
  test('workout/diet form opens if user requests for it', async ({ page }) => {
    await page.waitForLoadState(); // waits the page load

    const userInput = page.getByPlaceholder('Enter your message...');
    await userInput.waitFor();
    await expect(userInput).toBeVisible();
  
    const sendMessageButton = page.getByRole('button', { name: 'send-message-button' });
    await userInput.waitFor();
    await expect(sendMessageButton).toBeVisible();
  
    await userInput.clear();
    await userInput.fill('Diversus, open the diet and workout form for me!');
    await sendMessageButton.click();

    const formContainer = page.getByTestId('plan-choices-container');
    await formContainer.waitFor();
    await expect(formContainer).toBeVisible();
    await expect(formContainer).toHaveClass(/opacity-100/, { timeout: 15000 });
  });

  test('workout/diet form opens if user clicks in the form button', async ({ page }) => {
    await page.waitForLoadState(); // waits the page load

    const formButton = page.getByTestId('form-button');
    await formButton.waitFor();
    await expect(formButton).toBeVisible();

    formButton.click();

    const formContainer = page.getByTestId('plan-choices-container');
    await formContainer.waitFor();
    await expect(formContainer).toBeVisible();
    await expect(formContainer).toHaveClass(/opacity-100/, { timeout: 15000 });
  })
})