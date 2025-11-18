// replacing the auth import to avoid crashing
// when Jest wants to pull data from 'node_modules/next-auth'
jest.mock('../../app/actions/auth', () => ({
  authenticate: jest.fn((prevState, _formData) => {
    return 'Invalid credentials.'; // to test invalid credentials
  }),
}));

// mocking path name
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

// mocking the api fetch from the original component
// basically installing a fake fetch function so the component can run and the tests don’t explode.
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ conversations: [] }),
  })
) as jest.Mock;

import SideBar from '@/app/ui/dashboard/sidebar/sidebar-wrapper'
import userEvent from '@testing-library/user-event';
import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

describe('Side bar menu', () => {

  // mocked user
  const user = {
    firstname: 'Gabriel',
    lastname: '',
    email: '',
    has_diet_plan: false,
    has_workout_plan: false,
    id: '',
    password: '',
  }

  const userForEvents = userEvent.setup();

  beforeEach(async () => {
    // using act since right after the fetch function, the component uses a setter function
    await act(async () => {
      render(<SideBar user={user} />)
    })
  })

  it('side menu opens and closes', async () => {

    const threeBarsButton = screen.getByTestId('three-bars-menu');
    const SideBarPanel = screen.getByTestId('sidebar-panel');

    expect(threeBarsButton).toBeInTheDocument();
    expect(SideBarPanel).toHaveClass('w-0'); // side menu is closed
    expect(SideBarPanel).toBeInTheDocument();
    
    await userForEvents.click(threeBarsButton);
    
    expect(SideBarPanel).not.toHaveClass('w-0'); // side menu is opened
    
    await userForEvents.click(threeBarsButton);

    expect(SideBarPanel).toHaveClass('w-0'); // side menu is closed

  })

  it('highlights the correct tab based on pathname', async () => {

    const dashboardLink = screen.getByTestId('dashboard-tablink');
    const plansLink = screen.getByTestId('plans-tablink');
    const profileLink = screen.getByTestId('profile-tablink');

    expect(dashboardLink).toBeInTheDocument();
    expect(plansLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();

    expect(dashboardLink).toHaveAttribute('href','/dashboard');
    expect(plansLink).toHaveAttribute('href', '/dashboard/plans');
    expect(profileLink).toHaveAttribute('href', '/dashboard/profile');

    await userForEvents.click(dashboardLink);
    expect(dashboardLink).toHaveClass('bg-neutral-900');

    await userForEvents.click(plansLink);
    expect(plansLink).toHaveClass('bg-neutral-900');

    await userForEvents.click(profileLink);
    expect(profileLink).toHaveClass('bg-neutral-900');

  })

})