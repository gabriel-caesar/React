import { beforeEach, describe, it, vi } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductItem from '../components/ProductItem';

describe('ProductItem Component', () => {
  const mockItem = {
    id: 0,
    title: 'string',
    price: 0.1,
    description: 'string',
    category: 'string',
    image: 'http://example.com',
  };

  const mockCart = [{ name: 'name', count: 1 }];

  const mockIncrement = vi.fn();
  const mockDecrement = vi.fn();
  const mockHandleBuyAction = vi.fn();

  beforeEach(() => {
    render(
      <ProductItem
        item={mockItem}
        cart={mockCart}
        increment={mockIncrement}
        decrement={mockDecrement}
        handleBuyAction={mockHandleBuyAction}
      />
    );
  });

  it('expects the card buy button to render', () => {
    expect(screen.getByRole('button', { name: /buy/i })).toBeInTheDocument();
  });

  it('clicks the buy button', async () => {
    const user = userEvent.setup();
    
    await user.click(screen.getByRole('button', { name: 'Buy' }));

    expect(mockHandleBuyAction).toHaveBeenCalledWith(mockItem);
  })
});
