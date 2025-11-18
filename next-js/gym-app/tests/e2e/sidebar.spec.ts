import test, { expect } from '@playwright/test';

test.describe('Side Bar Menu', () => {

  // logs in into an account before every test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.getByPlaceholder('Enter your email');
    const passInput = page.getByPlaceholder('Enter your password');
    const loginBtn = page.getByRole('button', { name: 'Log In' });
    
    await expect(emailInput).toBeVisible({ timeout: 15000 });
    await expect(passInput).toBeVisible({ timeout: 15000 });
  
    await page.waitForTimeout(1000);
  
    await emailInput.fill('testing@email.com');
    await passInput.fill('testing123456#');
    await loginBtn.click();
  
    await expect(page).toHaveURL('/dashboard', { timeout: 15000 });
    await expect(page).toHaveTitle(/dashboard | diversus/i, { timeout: 15000 });
  })

  test('creates a brand new conversation and selects it through the side bar', async ({ page }) => {

    // getting all screen elements we need
    const sendMessageButton = page.getByTestId('send-message-button');
    const conversationTitle = page.getByTestId('conversation-title');
    const threeBarsMenu = page.getByTestId('three-bars-menu');
    const sideBarPanel = page.getByTestId('sidebar-panel');
    const inputField = page.getByTestId('user-input-field');
    const chatPanel = page.getByTestId('chat-panel');

    // getting visibility feedback
    await expect(chatPanel).toBeVisible();
    await expect(inputField).toBeVisible();
    await expect(threeBarsMenu).toBeVisible();
    await expect(sendMessageButton).toBeVisible();
    await expect(conversationTitle).toHaveText('Welcome');

    // write the ai a message
    await inputField.fill('Give me a full diet plan for a serious hiker');
    await sendMessageButton.click();

    // checking if an user chat bubble was created
    const userChatBubble = page.getByTestId('user-chat-bubble');
    await expect(userChatBubble).toBeVisible();
    await expect(userChatBubble).toHaveText('Give me a full diet plan for a serious hiker');

    // open the side bar menu
    await threeBarsMenu.click();

    // check if the side bar is opened and if conversation title changed
    await expect(sideBarPanel).toBeVisible();
    await expect(sideBarPanel).not.toHaveClass('w-0');
    await expect(conversationTitle).not.toHaveText('Welcome', { timeout: 15000 });
    
    // get the conversation title to select it from the side bar menu link
    const title = await conversationTitle.innerText();
    await expect(conversationTitle).toHaveText(title); // checking the title correctness
    const conversationLink = page.getByTestId(`${title.split(' ').join('-').toLowerCase()}-title`);

    // expecting that the conversation link is selected
    await expect(conversationLink).toBeVisible();
    await expect(conversationLink).toHaveClass(/bg-red-500/);

  })

})