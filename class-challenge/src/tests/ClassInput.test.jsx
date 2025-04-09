import { beforeEach, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react'; // (@) defines a scope of testing libraries which react is one of then
import { userEvent } from '@testing-library/user-event';
import ClassInput from '../components/ClassInput';

describe('User Interactions Test', () => {
  // setting up 'mock user' so that we can mock its interactions with the page
  const user = userEvent.setup();

  // it needs to be declared globally to be used down in the test functions
  let editButton;

  beforeEach(() => {
    render(<ClassInput />);
    editButton = screen.getByTestId('0');
  });

  it('Creates a snapshot for comparisons', () => {
    // snapshot running great, capturing the current HTML
    // output as a file to compare with future snapshots
    const { container } = render(<ClassInput />);
    expect(container).toMatchSnapshot();
  });

  it('Is the button text changing from (Submit) to (Resubmit)?', async () => {
    // awaiting user interaction (click the button)
    await user.click(editButton);

    // awaits the button 'Submit' to turn into 'Resubmit'
    const updatedButton = await screen.findByText(/resubmit/i);

    // expecting the button text to match Resubmit
    expect(editButton.textContent).toMatch(/resubmit/i);

    screen.debug(editButton);

    expect(updatedButton).toBeInTheDocument();
  });

  it('Is input showing the first task of the (todos) array?', async () => {
    // awaiting user interaction (click the button)
    await user.click(editButton);

    expect(
      screen.getByDisplayValue('Just some demo tasks')
    ).toBeInTheDocument();
  });

  it('Mocks a user creating a new task', async () => {
    await user.type(
      screen.getByPlaceholderText('enter your todo...'),
      'This is a test task'
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    // showing debug log to reflect changes
    screen.debug();
  });
});
