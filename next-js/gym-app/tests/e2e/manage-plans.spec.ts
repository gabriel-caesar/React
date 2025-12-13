import test, { expect } from '@playwright/test';

// log in before every test
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

  await page.waitForLoadState('networkidle'); // wait for the first navigation to load, so it can navigate to the plans route safely
});

test.describe.serial(`Manages diet's goal field`, () => {
  test('edits the diet goal field', async ({ page }) => {
    await page.goto('/dashboard/plans');
    await expect(page).toHaveURL('/dashboard/plans', { timeout: 15000 });

    const viewPlanButton = page.getByTestId('view-plan-button').last(); // getting the last view plan button
    const planId = await viewPlanButton.getAttribute('data-plan-id');
    await viewPlanButton.waitFor();
    await expect(viewPlanButton).toBeVisible(); 
    await viewPlanButton.click();
1
    expect(page).toHaveURL(`/dashboard/plans/${planId}`, { timeout: 15000 }); // navigate to that plan's route

    const goalTextElement = page.getByTestId('goal-text');
    await goalTextElement.waitFor();
    await expect(goalTextElement).toBeVisible();
    await expect(goalTextElement).toHaveText(/bulking/i);

    const threeDotsMenuButton = page.getByTestId('three-dots-menu-button');
    const editButton = page.getByTestId('edit-button');

    await threeDotsMenuButton.waitFor();
    await expect(threeDotsMenuButton).toBeVisible();
    await threeDotsMenuButton.click();

    await expect(editButton).toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-in
    await editButton.click();

    await expect(editButton).not.toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-out
    await expect(goalTextElement).not.toBeVisible({ timeout: 10000 });

    // after clicking the edit button, we expect the edit inputs to show up
    const editGoalInput = page.getByTestId('edit-goal-input');
    await editGoalInput.waitFor();
    await expect(editGoalInput).toBeVisible();
    await expect(editGoalInput).toHaveValue(/bulking/i);
    await editGoalInput.clear();
    await editGoalInput.fill('strength');
    await expect(editGoalInput).toHaveValue(/strength/, { timeout: 10000 });

    const editPlanButton = page.getByTestId('edit-plan-button');
    await expect(editPlanButton).toBeVisible({ timeout: 10000 });
    await editPlanButton.click(); // editing begins

    // edited plan feedback dialog shows up
    const dimmedBackground = page.getByTestId('dimmed-screen');
    await dimmedBackground.waitFor({ timeout: 15000 });
    await expect(dimmedBackground).toBeVisible();
    const editedPlanFeedbackContainer = page.getByTestId(
      'edit-success-container'
    );
    await editedPlanFeedbackContainer.waitFor();
    await expect(editedPlanFeedbackContainer).toBeVisible();
    const dismissButton = page.getByTestId('dismiss-button');
    await dismissButton.waitFor();
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // checking if the edited plan dialog disappeared
    await expect(editedPlanFeedbackContainer).not.toBeVisible();
    await expect(dimmedBackground).not.toBeVisible();
    await expect(dismissButton).not.toBeVisible();

    // goal should be edited to have text strength
    await goalTextElement.waitFor();
    await expect(goalTextElement).toBeVisible();
    await expect(goalTextElement).toHaveText(/strength/i);
  });
});

test.describe.serial(`Manages diet's gender field`, () => {
  test('edits the user gender field', async ({ page }) => {
    await page.goto('/dashboard/plans');
    await expect(page).toHaveURL('/dashboard/plans', { timeout: 15000 });
    
    const viewPlanButton = page.getByTestId('view-plan-button').last(); // getting the last view plan button
    const planId = await viewPlanButton.getAttribute('data-plan-id');
    await viewPlanButton.waitFor();
    await expect(viewPlanButton).toBeVisible();
    await viewPlanButton.click();

    expect(page).toHaveURL(`/dashboard/plans/${planId}`, { timeout: 15000 }); // navigate to that plan's route

    const genderTextElement = page.getByTestId('gender-text');
    await genderTextElement.waitFor();
    await expect(genderTextElement).toBeVisible();
    await expect(genderTextElement).toHaveText(/male/i);

    const threeDotsMenuButton = page.getByTestId('three-dots-menu-button');
    const editButton = page.getByTestId('edit-button');

    await threeDotsMenuButton.waitFor();
    await expect(threeDotsMenuButton).toBeVisible();
    await threeDotsMenuButton.click();

    await expect(editButton).toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-in
    await editButton.click();

    await expect(editButton).not.toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-out
    await expect(genderTextElement).not.toBeVisible({ timeout: 10000 });

    const genderDropdown = page.getByTestId('male-selector-dropdown');
    await genderDropdown.waitFor();
    await expect(genderDropdown).toBeVisible();
    await expect(genderDropdown).toHaveText(/male/i);
    await genderDropdown.click(); // opens the dropdown
    const maleOption = page.getByTestId('male-option');
    const femaleOption = page.getByTestId('female-option');
    await expect(maleOption).toBeVisible({ timeout: 10000 });
    await expect(femaleOption).toBeVisible({ timeout: 10000 });
    await femaleOption.click(); // selects gender now as female
    const genderDropdownFemale = page.getByTestId('female-selector-dropdown');
    await expect(genderDropdownFemale).toHaveText('Female', { timeout: 10000 }); // expect that the text changed to female

    const editPlanButton = page.getByTestId('edit-plan-button');
    await expect(editPlanButton).toBeVisible({ timeout: 10000 });
    await editPlanButton.click(); // editing begins

    // edited plan feedback dialog shows up
    const dimmedBackground = page.getByTestId('dimmed-screen');
    await dimmedBackground.waitFor({ timeout: 15000 });
    await expect(dimmedBackground).toBeVisible();
    const editedPlanFeedbackContainer = page.getByTestId(
      'edit-success-container'
    );
    await editedPlanFeedbackContainer.waitFor();
    await expect(editedPlanFeedbackContainer).toBeVisible();
    const dismissButton = page.getByTestId('dismiss-button');
    await dismissButton.waitFor();
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // checking if the edited plan dialog disappeared
    await expect(editedPlanFeedbackContainer).not.toBeVisible();
    await expect(dimmedBackground).not.toBeVisible();
    await expect(dismissButton).not.toBeVisible();

    // after edit, gender element should have 'female' text
    await genderTextElement.waitFor();
    await expect(genderTextElement).toBeVisible();
    await expect(genderTextElement).toHaveText(/female/i);
  });
});

test.describe.serial(`Manages diet plan's dietary restrictions field`, () => {
  test('edits the dietary restrictions field', async ({ page }) => {
    await page.goto('/dashboard/plans');
    await expect(page).toHaveURL('/dashboard/plans', { timeout: 15000 });

    const viewPlanButton = page.getByTestId('view-plan-button').last(); // getting the last view plan button
    const planId = await viewPlanButton.getAttribute('data-plan-id');
    await viewPlanButton.waitFor();
    await expect(viewPlanButton).toBeVisible();
    await viewPlanButton.click();

    expect(page).toHaveURL(`/dashboard/plans/${planId}`, { timeout: 15000 }); // navigate to that plan's route

    // checking if the restriction container is visible and empty
    const dietRestrictionsContainer = page.getByTestId(
      'dietary_restrictions_container'
    );
    await dietRestrictionsContainer.waitFor();
    await expect(dietRestrictionsContainer).toBeVisible();
    const noRestrictionsText = page.getByTestId('no-restrictions-added-text');
    await expect(noRestrictionsText).toBeVisible();
    await expect(noRestrictionsText).toHaveText('No restrictions were added');

    const threeDotsMenuButton = page.getByTestId('three-dots-menu-button');
    const editButton = page.getByTestId('edit-button');

    await threeDotsMenuButton.waitFor();
    await expect(threeDotsMenuButton).toBeVisible();
    await threeDotsMenuButton.click();

    await expect(editButton).toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-in
    await editButton.click();

    await expect(editButton).not.toHaveClass(/opacity-100/, { timeout: 15000 }); // edit button fades-out
    await expect(dietRestrictionsContainer).not.toBeVisible({ timeout: 10000 });
    await expect(noRestrictionsText).not.toBeVisible({ timeout: 10000 });

    // editing dietary restrictions
    const editRestrictionsInput = page.getByTestId('edit-restrictions-input');
    await editRestrictionsInput.waitFor();
    await expect(editRestrictionsInput).toBeVisible();
    await editRestrictionsInput.clear();
    await editRestrictionsInput.fill('shrimp');
    await page.keyboard.down('Enter'); // submits the shrimp restriction
    const restrictionShowcaseContainer = page.getByTestId(
      'restrictions-showcase-container'
    );
    await restrictionShowcaseContainer.waitFor();
    await expect(restrictionShowcaseContainer).toBeVisible();
    const shrimpRestriction = page.getByTestId('shrimp-restriction');
    await shrimpRestriction.waitFor(); // waits for the DOM node to be attached to the DOM tree
    await expect(shrimpRestriction).toBeVisible(); // waits for the element to be actually visible (css-wise)
    await expect(shrimpRestriction).toHaveText(/shrimp/);

    const editPlanButton = page.getByTestId('edit-plan-button');
    await expect(editPlanButton).toBeVisible({ timeout: 10000 });
    await editPlanButton.click(); // editing begins

    // edited plan feedback dialog shows up
    const dimmedBackground = page.getByTestId('dimmed-screen');
    await dimmedBackground.waitFor();
    await expect(dimmedBackground).toBeVisible();
    const editedPlanFeedbackContainer = page.getByTestId(
      'edit-success-container'
    );
    await editedPlanFeedbackContainer.waitFor();
    await expect(editedPlanFeedbackContainer).toBeVisible();
    const dismissButton = page.getByTestId('dismiss-button');
    await dismissButton.waitFor();
    await expect(dismissButton).toBeVisible();
    await dismissButton.click();

    // checking if the edited plan dialog disappeared
    await expect(editedPlanFeedbackContainer).not.toBeVisible();
    await expect(dimmedBackground).not.toBeVisible();
    await expect(dismissButton).not.toBeVisible();

    // dietary restrictions should now have shrimp as a restriction
    await expect(dietRestrictionsContainer).toBeVisible({ timeout: 10000 });
    const submittedShrimpRestriction = page.getByTestId(
      'submitted-shrimp-text'
    );
    await expect(submittedShrimpRestriction).toBeVisible({ timeout: 10000 });
  });
});

test.describe.serial(`Manages diet plan's deletion action`, () => {
  test('deletes the diet plan successfully', async ({ page }) => {
    await page.goto('/dashboard/plans');
    await expect(page).toHaveURL('/dashboard/plans', { timeout: 15000 });
    
    const deletePlanButton = page.getByTestId('delete-plan-button').last(); // getting the last delete plan button
    const planId = await deletePlanButton.getAttribute('data-plan-id');
    await deletePlanButton.waitFor();
    await expect(deletePlanButton).toBeVisible();
    await deletePlanButton.click();

    // security check to delete the diet plan shows up
    const dimmedBackground = page.getByTestId('dimmed-screen');
    await expect(dimmedBackground).toBeVisible({ timeout: 10000 });
    const AreYouSureToDeleteContainer = page.getByTestId(
      'are-you-sure-delete-container'
    );
    await AreYouSureToDeleteContainer.waitFor();
    await expect(AreYouSureToDeleteContainer).toBeVisible({ timeout: 10000 });
    const AreYouSureToDeleteHeader = page.getByTestId(
      'are-you-sure-delete-header'
    );
    await expect(AreYouSureToDeleteHeader).toBeVisible({ timeout: 10000 });
    await dimmedBackground.waitFor();
    const yesDeleteButton = page.getByTestId('yes-button');
    await yesDeleteButton.waitFor();
    await expect(yesDeleteButton).toBeVisible({ timeout: 10000 });

    await yesDeleteButton.click();

    await expect(AreYouSureToDeleteContainer).not.toBeVisible({
      timeout: 10000,
    });
    await expect(AreYouSureToDeleteHeader).not.toBeVisible({ timeout: 10000 });
    await expect(dimmedBackground).not.toBeVisible({ timeout: 10000 });
    await expect(yesDeleteButton).not.toBeVisible({ timeout: 10000 });

    const planTypeHeader = page.getByTestId('plan-type-header');
    await planTypeHeader.waitFor();
    await expect(planTypeHeader).toBeVisible();
    await expect(planTypeHeader).toHaveText('Currently viewing diet plans');
  });
});