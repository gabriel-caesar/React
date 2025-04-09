import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar';

describe('Navbar file', () => {

  beforeEach(() => {
    render(<Navbar />);
  })

  it('renders the BoxCart logo', () => {
    expect(screen.getByText(/boxcart/i)).toBeInTheDocument();
  });

  it('renders the box cart button', () => {
    expect(screen.getByRole('button', { name: /shopping-cart/i })).toBeInTheDocument();
  });

  it('clicks the box cart button successfully', async () => {
    const onClick = vi.fn(); // mocking onClick with a utility function
    const user = userEvent.setup(); // setting up the user
    const cartButton = screen.getByRole('button', { name: /shopping-cart/i }); // getting the button
    cartButton.onClick = onClick(); // assigning the onClick function

    await user.click(cartButton); // clicking the button

    expect(onClick).toHaveBeenCalled(); // check if the function was called upon click

  });
});
