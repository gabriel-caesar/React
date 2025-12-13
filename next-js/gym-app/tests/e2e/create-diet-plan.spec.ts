import test, { expect } from '@playwright/test';

// log in into an account before every test
test.beforeEach(async ({ page }) => {
  await page.goto('/login');
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
});

test.describe('Diet plan creation', () => {
  test('creates and saves a diet plan successfully', async ({ page }) => {
    await page.waitForLoadState(); // waits the page load

    const formButton = page.getByTestId('form-button');
    await formButton.waitFor();
    await expect(formButton).toBeVisible();
    formButton.click();

    const formContainer = page.getByTestId('plan-choices-container');
    await formContainer.waitFor();
    await expect(formContainer).toBeVisible();
    await expect(formContainer).toHaveClass(/opacity-100/, { timeout: 15000 });

    // ## PLAN TYPE SELECTION ##
    const dietPlanButton = page.getByTestId('diet-plan-button');
    await dietPlanButton.waitFor();
    await expect(dietPlanButton).toBeVisible();

    await dietPlanButton.click();

    // ## SECTION WHERE ARROWS BECOME AVAILABLE ##
    // getting the form arrows
    const rightArrowButton = page.getByTestId('go-right-button');
    await rightArrowButton.waitFor();
    await expect(rightArrowButton).toBeVisible();
    const leftArrowButton = page.getByTestId('go-left-button');
    await leftArrowButton.waitFor();
    await expect(leftArrowButton).toBeVisible();
    const inputErrorContainer = page.getByTestId('input-error-container'); // defining the input error container

    // ## GOAL SELECTION ##
    const bulkingButton = page.getByTestId('bulking-button');
    await bulkingButton.waitFor();
    await expect(bulkingButton).toBeVisible();

    await bulkingButton.click();

    // ## GENDER SELECTION ##
    const maleButton = page.getByTestId('male-button');
    await maleButton.waitFor();
    await expect(maleButton).toBeVisible();

    await maleButton.click();

    // ## WEIGHT INPUT FIELD ##
    const weightInput = page.getByTestId('current-weight-input');
    await weightInput.waitFor();
    await expect(weightInput).toBeVisible();

    // also handling errors on wrong inputs
    await weightInput.clear();
    await weightInput.fill('91');
    await page.keyboard.down('Enter');
    await inputErrorContainer.waitFor();
    await expect(inputErrorContainer).toBeVisible();
    await expect(inputErrorContainer).toHaveText(
      `Try something like 80kg or 176lb`
    );
    await weightInput.clear();
    await weightInput.fill('91kg');
    await page.keyboard.down('Enter');
    await expect(inputErrorContainer).not.toBeVisible();

    // ## HEIGHT INPUT FIELD ##
    const heightInput = page.getByTestId('height-input');
    await heightInput.waitFor();
    await expect(heightInput).toBeVisible();

    // also handling errors on wrong inputs
    await heightInput.clear();
    await heightInput.fill('91kg');
    await page.keyboard.down('Enter');
    await inputErrorContainer.waitFor();
    await expect(inputErrorContainer).toBeVisible();
    await expect(inputErrorContainer).toHaveText(
      `Try something like 180cm or 5'11"`
    );
    await heightInput.clear();
    await heightInput.fill('180cm');
    await page.keyboard.down('Enter');
    await expect(inputErrorContainer).not.toBeVisible();

    // ## AGE INPUT FIELD ##
    const ageInput = page.getByTestId('age-input');
    await ageInput.waitFor();
    await expect(ageInput).toBeVisible();

    // also handling errors
    await ageInput.clear();
    await ageInput.fill('thirty three');
    await page.keyboard.down('Enter');
    await inputErrorContainer.waitFor();
    await expect(inputErrorContainer).toBeVisible();
    await expect(inputErrorContainer).toHaveText(
      `Only numbers and 10+ age are allowed`
    );
    await ageInput.clear();
    await ageInput.fill('33');
    await page.keyboard.down('Enter');
    await expect(inputErrorContainer).not.toBeVisible();

    // ## ACTIVITY LEVEL SELECTION ##
    const intermediateButton = page.getByTestId('intermediate-button');
    await intermediateButton.waitFor();
    await expect(intermediateButton).toBeVisible();

    await intermediateButton.click();

    // ## NUMBER OF MEALS INPUT FIELD ##
    const numberOfMealsInput = page.getByTestId('number-of-meals-input');
    await numberOfMealsInput.waitFor();
    await expect(numberOfMealsInput).toBeVisible();

    // also checking errors
    await numberOfMealsInput.clear();
    await numberOfMealsInput.fill('');
    await page.keyboard.down('Enter');
    await inputErrorContainer.waitFor();
    await expect(inputErrorContainer).toBeVisible();
    await expect(inputErrorContainer).toHaveText(`Only numbers are allowed`);
    await numberOfMealsInput.clear();
    await numberOfMealsInput.fill('2');
    await page.keyboard.down('Enter');
    await expect(inputErrorContainer).not.toBeVisible();

    // ## MEAL TIMING SELECTION ##
    const mealTimingButton = page.getByTestId('three-hours-button');
    await mealTimingButton.waitFor();
    await expect(mealTimingButton).toBeVisible();

    await mealTimingButton.click();

    // ## DURATION WEEKS INPUT FIELD ##
    const durationWeeks = page.getByTestId('plan-duration-input');
    await durationWeeks.waitFor();
    await expect(durationWeeks).toBeVisible();

    // also handling errors
    await durationWeeks.clear();
    await durationWeeks.fill('');
    await page.keyboard.down('Enter');
    await inputErrorContainer.waitFor();
    await expect(inputErrorContainer).toBeVisible();
    await expect(inputErrorContainer).toHaveText(
      `Enter only numbers (optional: followed with "weeks" or "week")`
    );
    await durationWeeks.clear();
    await durationWeeks.fill('4');
    await page.keyboard.down('Enter');
    await expect(inputErrorContainer).not.toBeVisible();

    // ## DIETARY RESTRICTIONS INPUT FIELD ##
    const dietRestrictions = page.getByTestId('restrictions-input');
    await dietRestrictions.waitFor();
    await expect(dietRestrictions).toBeVisible();

    await dietRestrictions.clear();
    await dietRestrictions.fill('Shrimp');
    await page.keyboard.down('Enter');

    // checking if the restriction went through to the restriction container
    const restrictionContainer = page.getByTestId('diet-restriction-container');
    await restrictionContainer.waitFor();
    await expect(restrictionContainer).toBeVisible();
    const shrimpRestriction = page.getByTestId('shrimp');
    await shrimpRestriction.waitFor();
    await expect(shrimpRestriction).toBeVisible();
    await expect(shrimpRestriction).toHaveText(/shrimp/);

    // checking if the restriction was deleted
    const removeRestrictionButton = page.getByTestId(
      'remove-shrimp-restriction'
    );
    await removeRestrictionButton.waitFor();
    await removeRestrictionButton.click();
    await expect(restrictionContainer).not.toBeVisible();
    await expect(shrimpRestriction).not.toBeVisible();

    // moving forward to the next section
    await rightArrowButton.click();

    // ## WANT SUPPLEMENTS SELECTION ##
    const supplementYesButton = page.getByTestId('yes-button');
    await supplementYesButton.waitFor();
    await expect(supplementYesButton).toBeVisible();

    await supplementYesButton.click();

    // ## DAILY CALORIC INTAKE SELECTION ##
    const leaveItToAIButton = page.getByTestId('leave-to-ai-button');
    await leaveItToAIButton.waitFor();
    await expect(leaveItToAIButton).toBeVisible();

    await leaveItToAIButton.click();

    // ## USER NOTES FIELD ##
    const userNotes = page.getByTestId('user-notes-textarea');
    await userNotes.waitFor();
    await expect(userNotes).toBeVisible();

    await userNotes.clear();
    await userNotes.fill('This is a test');

    // moving forward to the next section
    await rightArrowButton.click();

    // ## GENERATE PLAN SECTION ##
    const generateButton = page.getByTestId('generate-plan-button');
    await generateButton.waitFor();
    await expect(generateButton).toBeVisible();

    await generateButton.click();

    // ## GENERATING PLAN LOADING SECTION ##
    const loadingContainer = page.getByTestId('generating-plan-wrapper');
    await loadingContainer.waitFor();
    await expect(loadingContainer).toBeVisible();

    // timeout is waiting for the container to disappear
    await expect(loadingContainer).not.toBeVisible({ timeout: 30000 }); // loading container fades-out
    await expect(formContainer).not.toHaveClass(/opacity-100/, {
      timeout: 15000,
    }); // form container fades-out
    await expect(page).not.toHaveURL('/dashboard', { timeout: 120000 }); // expecting the URL to not end with 'dashboard', since the user wil be redirected to a new conversation

    const savePlanButton = page.getByTestId('save-plan-button');
    await savePlanButton.waitFor({ timeout: 120000 }); // this timeout has to be long due to generation time being long
    await expect(savePlanButton).toBeVisible();

    const dietPlanResponse = page.getByLabel('ai-chat-bubble').nth(1); // get the diet response after the greeting bubble
    await dietPlanResponse.waitFor(); // awaiting the response load
    await expect(dietPlanResponse).toBeVisible();
    await expect(dietPlanResponse).not.toHaveText(''); // making sure the response is not empty

    const conversationTitle = page.getByTestId('conversation-title');
    await conversationTitle.waitFor();
    await expect(conversationTitle).toBeVisible();
    await expect(conversationTitle).not.toHaveText(/Welcome/, {
      timeout: 30000,
    });

    // after saving, we expect that the view plan button shows up
    const inputContainer = page.getByTestId('input-form-test-id');
    await inputContainer.waitFor({ timeout: 10000 });
    await expect(inputContainer).toBeVisible();
    
    const conversationId = await savePlanButton.getAttribute(
      'data-conversation-id'
    ); // getting the plan id attached to the save plan button
    await expect(page).toHaveURL(`/dashboard/${conversationId}`, {
      timeout: 30000,
    }); // checking if the user was redirected to a brand new conversation
    
    await page.reload(); // reloads the page to close formContainer, since the conventional way wasn't closing it
    await page.waitForLoadState('networkidle'); // waits the page load after reload so the test workers can save the plan
    
    const planId = await savePlanButton.getAttribute('data-plan-id');
    await savePlanButton.click({ delay: 5000 }); // save plan
    
    const viewPlanButton = page.getByTestId('view-plan-button');
    await viewPlanButton.waitFor({ timeout: 120000 });
    await expect(viewPlanButton).toBeVisible();

    await viewPlanButton.click();

    // expecting that at leats one element from the Plans tab is
    // rendered and that the user got redirected to the plan it just saved
    const generalInfoHeader = page.getByTestId('general-info-header');
    await generalInfoHeader.waitFor({ timeout: 30000 });
    await expect(generalInfoHeader).toBeVisible();
    await expect(generalInfoHeader).toHaveText('General Information');
    await expect(page).toHaveURL(`/dashboard/plans/${planId}`, {
      timeout: 30000,
    });
  });
});
