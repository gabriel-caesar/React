import { beforeEach, describe, it } from 'vitest';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '../routes/HomePage';

describe('HomePage file', () => {

  beforeEach(() => {
    render(<HomePage />);
  })

  it('tests the RIGHT arrow of the carousel', async () => {
    const user = userEvent.setup();
    const rightButton = await screen.findByRole('button', { name: /slideRightButton/i });
    screen.debug();
    await user.click(rightButton);

    expect(await screen.findByText('Mens Casual Premium Slim Fit T-Shirts')).toBeInTheDocument();
  })

  it('tests the LEFT arrow of the carousel', async () => {
    const user = userEvent.setup();
    const leftButton = await screen.findByRole('button', { name: /slideLeftButton/i });

    await user.click(leftButton);

    expect(await screen.findByText('Mens Casual Premium Slim Fit T-Shirts')).toBeInTheDocument();
  })

  it('tests the search bar', async () => { // testing the search bar
    const user = userEvent.setup();
    const userNameField = screen.getByPlaceholderText('Search for a product to box...');
    
    await user.type(userNameField, 'acer')

    expect(await screen.findByText('Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin')).toBeVisible()
  });
})
