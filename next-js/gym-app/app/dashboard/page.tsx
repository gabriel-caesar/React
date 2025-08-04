import { auth, signOut } from '@/app/actions/credential-handler';
import { ArrowUp, Power } from 'lucide-react';
import { getUser } from '@/app/actions/auth';
import styles from '../css/dashboard.module.css'
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {

  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  const user = await getUser(email);

  return (
    <div>

      <div
        id='main-panel'
        className='flex flex-col items-center justify-center h-screen w-screen'
      >
        <div id='chat-panel' className='border-2 border-red-500 w-1/2'>
          <h1
            id='greetings-header'
            className='text-4xl text-center font-bold'
          >
            Hello {user?.firstname}
          </h1>
          <div>

          </div>
        </div>

        <form action="" className='flex w-1/2'>
          <textarea 
            className='rounded-md bg-neutral-600 focus-within:outline-none w-full px-5'
            placeholder='Enter your message...'
          >
          </textarea>
          <button className='rounded-lg bg-neutral-600 w-15 flex items-center justify-center ml-10'>
            <ArrowUp className='text-red-500'/>
          </button>
        </form>

      </div>

      <form 
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
      className=''
      >

        <button
          className={`${styles.red_shadow} flex items-center justify-center text-center rounded-md text-2xl w-50 p-2 bg-white text-black hover:cursor-pointer hover:text-red-400 hover:scale-110 transition-all duration-300 mt-2`}
        >
          Sign Out
          <Power className='ml-5'/>
        </button>

      </form>

    </div>
  )
}