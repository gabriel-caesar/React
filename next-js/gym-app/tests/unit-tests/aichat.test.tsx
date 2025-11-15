// mocking next navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: () => '/dashboard',
  }),

  usePathname: () => ({}),
}));

import {
  createAIChatBubble,
  createUserChatBubble,
} from '@/app/actions/frontend-ui/ai-chat';
import { aiChatContext } from '@/app/ui/dashboard/ai-chat/chat-structure';
import { getByRole, render, screen } from '@testing-library/react';
import { RefObject } from 'react';
import InputForm from '@/app/ui/dashboard/ai-chat/input-form';
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

  const introBubbleContent = `Hello ${mockedValues.user.firstname}, to get started you can tell me what are your fitness goals and I will help you achieve it, but that needs to be essentially something related to either workout or a diet.`;

  beforeEach(() => {
    render(
      <aiChatContext.Provider value={mockedValues}>
        <Panel />
        <InputForm />
      </aiChatContext.Provider>
    );
  });

  it('renders the bot introduction bubble succesfully', () => {
    const introBubble = screen.getByTestId('greeting-ai-chat-bubble');
    expect(introBubble).toBeInTheDocument();
    expect(introBubble).toHaveTextContent(introBubbleContent);
  });

  it('tests the ai and user message flow', async () => {
    const userInput = screen.getByRole('textbox');
    const sendMessageButton = screen.getByRole('button', { name: 'send-message-button' });
    const panelDiv = { current: screen.getByTestId('chat-panel') }; // mocking the panel div ref
    const prompt = 'Hello, computer'; // user prompt
    const aiMessageContent = `Hello, ${mockedValues.user.firstname}`;

    createUserChatBubble(
      prompt,
      null,
      panelDiv as RefObject<HTMLDivElement | null>,
      null
    ); // mocking user's message
    createAIChatBubble(
      panelDiv as RefObject<HTMLDivElement | null>,
      aiMessageContent
    ); // mocking ai's response

    const userMessage = screen.getByLabelText('user-chat-bubble'); // getting the fresh user message
    // getting the fresh ai response
    const arrayOfResponses = screen.getAllByLabelText('ai-chat-bubble');
    const aiResponse = arrayOfResponses[arrayOfResponses.length - 1]; // getting the last ai response (the first was the greeting)

    // expectations...
    expect(panelDiv).toBeInTheDocument();
    expect(userInput).toBeInTheDocument();
    expect(sendMessageButton).toBeInTheDocument();
    expect(userMessage).toBeInTheDocument();
    expect(userMessage).toHaveTextContent('Hello, computer');
    expect(aiResponse).toBeInTheDocument();
    expect(aiResponse).toHaveTextContent('Hello, Gabriel');
  });
});
