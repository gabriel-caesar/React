// mocking signup function
jest.mock('../../auth', () => ({
  signup: jest.fn(async (_state: FormState | undefined, _formData: FormData) => {
    // receiving empty fields on purpose
    const validatedFields = await SignUpSchema.safeParseAsync({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    // obviously the validation will fail, so return the ZodErrors
    if (!validatedFields.success) {
      return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to sign up user.',
    };
    }
  }),
  getUser: jest.fn( // bypassing the database query
    (email: string): Promise<User | undefined> => Promise.resolve(undefined)
  ),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetStartedForm from './getstarted-form';
import '@testing-library/jest-dom';
import { FormState, SignUpSchema, User } from '../lib/definitions';

describe('Get Started Form', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    render(<GetStartedForm />);
  });

  it('renders all inputs successfuly', () => {
    expect(
      screen.getByPlaceholderText('Enter your first name')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your last name')
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter your password')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Confirm your password')
    ).toBeInTheDocument();
  });

  it('checks for invalid feedback', async () => {
    const registerButton = screen.getByRole('button', { name: 'Register' });

    expect(registerButton).toBeInTheDocument();

    await user.click(registerButton);

    // notice how findBy awaits the change to happen
    const firstNameError = (await screen.findByTestId('first-name-error'));
    const lastNameError = (await screen.findByTestId('last-name-error'));
    const emailError = (await screen.findByTestId('email-error'));
    // using findAllBy to get multiple error elements
    const passError = (await screen.findAllByTestId('pass-error'));
    const confirmPassError = (await screen.findByTestId('confirm-pass-error'));

    expect(firstNameError).toBeInTheDocument();
    expect(firstNameError).toHaveTextContent('* First name must be at least 2 characters long');
    
    expect(lastNameError).toBeInTheDocument();
    expect(lastNameError).toHaveTextContent('* Last name must be at least 2 characters long');

    // existent email check fails on the E2E test
    expect(emailError).toBeInTheDocument();
    expect(emailError).toHaveTextContent('* Please enter a valid email');

    // pass returns an array, so I loop through 
    // it and test each one of the elements
    const errorMessages = [
        'Be at least 8 characters long',
        'Contain at least one letter',
        'Contain at least one number',
        'Contain at least one special character',
      ];
    for (let i = 0; i < passError.length; i++) {
      expect(passError[i]).toBeInTheDocument();
      expect(passError[i]).toHaveTextContent(errorMessages[i]);
    }

    expect(confirmPassError).toBeInTheDocument();
    expect(confirmPassError).toHaveTextContent('* Be at least 8 characters long');
  });
});
