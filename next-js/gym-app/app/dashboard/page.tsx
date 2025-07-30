import { auth, signOut } from '@/credential-handler';
import { Power } from 'lucide-react';
import { getUser } from '@/auth';
import styles from '../css/dashboard.module.css'

export default async function Page() {

  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  const user = await getUser(email);

  return (
    <div>
      HELLO {user?.firstname} {user?.lastname}
      <form action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}>

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