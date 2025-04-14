import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';

describe('Navbar file', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it('renders the BoxCart logo', () => {
    expect(screen.getByText(/boxcart/i)).toBeInTheDocument();
  });

  it('renders the box cart button', () => {
    expect(
      screen.getByRole('button', { name: /shopping-cart-button/i })
    ).toBeInTheDocument();
  });
});
