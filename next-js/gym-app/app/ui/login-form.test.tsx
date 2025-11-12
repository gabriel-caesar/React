// replacing the auth import to avoid crashing
// when Jest wants to pull data from 'node_modules/next-auth'
jest.mock('../actions/auth', () => ({
  authenticate: jest.fn((prevState, _formData) => {
    return 'Invalid credentials.'; // to test invalid credentials
  }),
}));

// useSearchParams isn't working with Jest, so I mock it
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: () => '/dashboard',
  }),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './login-form';
import '@testing-library/jest-dom';

// testing the login form component
describe('LoginForm', () => {
  // setting up userEvent
  const user = userEvent.setup();

  // rendering the component before each test
  beforeEach(() => {
    render(<LoginForm />);
  });

  it('renders Login to your account header', () => {
    expect(screen.getByText(/login to your account/i)).toBeInTheDocument();
  });

  it('renders all inputs successfuly', async () => {
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders an error feedback for wrong credentials', async () => {
    const loginButton = screen.getByRole('button', { name: 'Log In' });

    expect(loginButton).toBeInTheDocument();

    await user.click(loginButton);

    const error = screen.getByTestId('errorElement')

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent('* Invalid credentials.');

    // tests that return a successful authentication will be done with E2E testing

  });

  it('renders the get started button and checks for the right href', async () => {
    const getStartedButton = screen.getByRole('link', { name: 'Get Started' });
    
    expect(getStartedButton).toBeInTheDocument();

    // since it is a Link component, we just check if it passes the right href (unit test)
    expect(getStartedButton).toHaveAttribute('href', '/get-started');
  })
});
