import { Conversation, Message, User } from '@/app/lib/definitions';
import { dietFormDataType } from '@/public/plan_metadata/diet-formdata';
import { workoutFormDataType } from '@/public/plan_metadata/workout-formdata';
import { Dispatch, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

// creates the user chat bubble dynamically
export function createChatBubble(
  prompt: string | null,
  setPrompt: Dispatch<SetStateAction<string>> | null,
  setLocalMessages: Dispatch<SetStateAction<Message[]>>,
  conversationId: string,
  sentDate: string,
  isUser: boolean,
  formData?: dietFormDataType | workoutFormDataType | null
): Message {
  setPrompt?.('');
  const uuid = uuidv4();

  const newMessageObj: Message = {
    message_content: prompt as string,
    role: isUser ? 'user' : 'assistant',
    sent_date: sentDate,
    id: uuid,
    conversation_id: conversationId,
    form_data: formData,
    plan_saved: false,
  };

  setLocalMessages((prev) => [...prev, newMessageObj]);

  return newMessageObj;
}

export async function submitPrompt(
  localMessages: Message[],
  setLocalMessages: Dispatch<SetStateAction<Message[]>>,
  setIsAIWriting: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<string>>,
  setPrompt: Dispatch<SetStateAction<string>>,
  setIsSuggest: Dispatch<SetStateAction<boolean>>,
  conversation: Conversation | null,
  prompt: string,
  user: User | undefined,
  formData?: dietFormDataType | workoutFormDataType
) {
  // don't submit if input is empty
  if (prompt.length === 0) return;

  const date: string = new Date().toLocaleString('sv-SE');

  setIsAIWriting(true); // blocking user to send more messages

  setResponse('...'); // thinking feedback

  // conversation id is available based on if props conversation exists
  const conversationId = conversation ? (conversation as Conversation).id : '';

  const userChatBubble = createChatBubble(
    prompt ? prompt : '',
    setPrompt,
    setLocalMessages,
    conversationId,
    date,
    true,
    null
  ); // creates the user bubble chat

  const aiChatBubble = createChatBubble(
    '',
    setPrompt,
    setLocalMessages,
    conversationId,
    date,
    false,
    formData ? formData : null
  ); // creates the ai bubble chat

  // most up to date local messages array, so backend doesn't receive outdated messages
  const updatedLocalMessages = [...localMessages, aiChatBubble, userChatBubble];

  try {
    // placeholders
    let interpreterResponse: Response;
    let interpreterData = { interpretation: '' };

    // only call this API if there is no valid diet form data
    if (!formData) {
      interpreterResponse = await fetch(`/api/chat/interpreter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          localMessages: updatedLocalMessages,
        }),
      });
      interpreterData = await interpreterResponse.json();
    }

    // save messages on DB
    // fetch the conversation data and send to the api call
    // fetching the chat API to return the AI response
    const call = await fetch(`/api/chat/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        user: user,
        date: date,
        localMessages: updatedLocalMessages,
        signal: formData
          ? JSON.stringify(formData)
          : interpreterData.interpretation,
      }),
    });

    // reading the stream from the API call
    const stream = call.body?.getReader();
    if (!stream) {
      throw new Error('No stream from server');
    }

    // UTF-8 decoder
    const decoder = new TextDecoder();

    // this cleans the (...) before inserting the response
    setResponse('');

    // response to send back to API and save it to DB as role === 'ai'
    let fullResponse: string = '';

    // while stream is not fully read
    while (true) {
      const { done, value } = await stream.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true }); // decoding the strings from the stream while done is false

      setResponse((prev) => (prev += text)); // appending the text with the streaming effect
      fullResponse += text; // response to be bounced back to the API call
    }

    setIsSuggest(
      interpreterData.interpretation === 'suggest' && !formData ? true : false
    );

    // this call will bounce back the AI response to be saved on the DB
    // since we can't save the streaming state of the AI response
    // we await it to be fully streamed to then send it back to the DB
    // send to save-ai-message API to query for data in the db
    if (fullResponse !== '') {
      aiChatBubble.message_content = fullResponse;
      const call = await fetch(`/api/chat/save-ai-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiChatBubble: aiChatBubble,
          userChatBubble: userChatBubble,
          existingConversation: conversation,
        }),
      });

      const data = await call.json();
      // that means no conversation was created, so cease the function
      if (data.message) return;

      return data;
    }
  } catch (error) {
    throw new Error(`Couldn't process AI response. ${error}`);
  } finally {
    setIsAIWriting(false);
  }
}

export async function generatePlan(
  formData: dietFormDataType | workoutFormDataType,
  isDiet: boolean
) {
  // base check for missing fields
  const missingFields = [];
  for (const prop in formData) {
    const data =
      formData[prop as keyof (dietFormDataType | workoutFormDataType)];
    if (prop === 'dietary_restrictions') break; // finish loop in this prop if is a diet form
    if (prop === 'user_notes') break;
    if (!data) {
      missingFields.push(prop);
    }
  }
  if (missingFields.length > 0) return missingFields;

  // converting the data types accordingly
  if (isDiet) {
    const {
      age,
      number_of_meals,
      meal_timing_hours,
      duration_weeks,
      want_supplements,
      daily_caloric_intake,
    } = formData as dietFormDataType;
    (formData as dietFormDataType).want_supplements =
      want_supplements === 'yes' ? true : false;
    (formData as dietFormDataType).daily_caloric_intake = parseInt(
      daily_caloric_intake as string
    );
    (formData as dietFormDataType).meal_timing_hours = parseInt(
      meal_timing_hours as string
    );
    (formData as dietFormDataType).number_of_meals = parseInt(
      number_of_meals as string
    );
    (formData as dietFormDataType).duration_weeks = parseInt(
      duration_weeks as string
    );
    (formData as dietFormDataType).age = parseInt(age as string);
  } else {
    const { age, duration_weeks, number_of_workout_days } =
      formData as workoutFormDataType;
    (formData as workoutFormDataType).number_of_workout_days = parseInt(
      number_of_workout_days as string
    );
    (formData as workoutFormDataType).duration_weeks = parseInt(
      duration_weeks as string
    );
    (formData as workoutFormDataType).age = parseInt(age as string);
  }

  // MAIN CALL THAT WILL GENERATE THE PLAN
  const call = await fetch(`/api/chat/interpreter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: JSON.stringify(formData),
      localMessages: [],
    }),
  });

  // returning the json form data
  const data = await call.json();
  return data;
}
