import { aiChatContext } from '@/app/ui/dashboard/ai-chat/chat-structure';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Panel from '@/app/ui/dashboard/ai-chat/panel';
import '@testing-library/jest-dom';

describe('AI chat panel', () => {

  // mocking the context values
  const mockedValues = {
    response: '',
    setResponse: () => {},
    chatPanelRef: { current: document.createElement('div') },
    user: {
      firstname: 'Gabriel',
      lastname: '',
      email: '',
      has_diet_plan: false,
      has_workout_plan: false,
      id: '',
      password: '',
    },
    conversation: {
      id: '',
      title: '',
      last_message_date: '',
      created_date: '',
      user_id: '',
    },
    messages: [],
  };

  beforeEach(() => {
    render(
      <aiChatContext.Provider value={mockedValues}>
        <Panel />
      </aiChatContext.Provider>
    );
  });

  it('renders the bot introduction bubble succesfully', () => {
    const introBubble = screen.getByLabelText('ai-chat-bubble');
    expect(introBubble).toBeInTheDocument();
  });
});
