import { auth } from '@/app/actions/credential-handler';
import { ArrowUp } from 'lucide-react';
import { getUser } from '@/app/actions/auth';
import styles from '../css/dashboard.module.css';

export default async function Page() {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  const user = await getUser(email);

  return (
    <>

      <div
        id='main-panel'
        className='flex flex-col items-center justify-center h-screen w-full'
      >
        <div id='chat-panel' className='w-1/2 mb-20'>
          <h1 id='greetings-header' className='text-4xl text-center font-bold'>
            Hello {user?.firstname}
          </h1>
          <div></div>
        </div>

        <form
          action=''
          className={`flex w-185 rounded-lg bg-neutral-600 relative ${styles.regular_shadow}`}
        >
          <textarea
            className={`${styles.scrollbar} bg-transparent focus-within:outline-none p-5 w-160 resize-none transition-all duration-300`}
            placeholder='Enter your message...'
          ></textarea>
          <button
            className={`rounded-full bg-neutral-900 w-15 h-15 flex items-center justify-center ml-10 absolute right-4 top-4 hover:cursor-pointer hover:text-red-500 transition-all duration-300 ${styles.red_shadow}`}
          >
            <ArrowUp />
          </button>
        </form>
      </div>
    </>
  );
}
