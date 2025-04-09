import { beforeEach, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import userEvent from '@testing-library/user-event';

describe('Footer file', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('renders the copyright text', () => {
    expect(screen.getByTestId('footer-text')).toBeInTheDocument();

    screen.debug();
  });

  it('expects the anchor to work when clicked', async () => {
    const href = vi.fn(); // mock href
    const user = userEvent.setup(); // set the user up
    const anchor = screen.getByTestId('github-href'); // get the <a>
    anchor.href = href(); // assign a mock href to <a>

    await user.click(anchor); // click <a>

    expect(href).toHaveBeenCalled(); // expect the anchor to have worked upon click
  })
});
