'use client'

import { Conversation } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import animations from '../../../css/animations.module.css'
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useRouter } from 'next/navigation';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function ManagePanel({ conversations } : { conversations: Conversation[] }) {

  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const areYouSureRef = useRef<HTMLDivElement | null>(null);
  const [utilityLoader, setUtilityLoader] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<string>('');
  const router = useRouter();

  async function handleDelete() {
    setUtilityLoader(true);
    try {
      const call = await fetch(`/api/chat/delete-conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: idToDelete
        }),
      });

      const response = await call.json();
      if (response.success) router.push('/dashboard/manage-conversations');
    } catch (error) {
      throw new Error(
        `Couldn't start conversation deletion through front-end. ${error}`
      );
    } finally {
      setUtilityLoader(false);
      setAreYouSure(false);
    }
  }

  // if the user clicks out of are you sure container, close it
  useEffect(() => {
    const handleClickOff = (e: MouseEvent) => {
      if (
        areYouSureRef.current &&
        !areYouSureRef.current.contains(e.target as Node)
      ) {
        setAreYouSure(false);
      }
    };

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    };
  }, [areYouSure]);

  return (
    <div
      id='manage-panel-container'
      className='flex flex-col justify-start items-center rounded-lg w-full lg:w-3/4 p-2 bg-[linear-gradient(45deg,#525252_50%,#737373)] border border-neutral-500 relative'
    >
      {areYouSure && (
        <div
          id='dimmed-screen'
          className='fixed inset-0 w-screen h-screen z-9 bg-black/70'
        ></div>
      )}
      {areYouSure && (
        <div
          ref={areYouSureRef}
          id='are-you-sure-delete-container'
          className='border border-neutral-500 fixed top-1/4 z-10 left-1/2 -translate-x-1/2 p-6 rounded-lg bg-neutral-800 shadow-lg text-[16px] flex flex-col justify-center items-center w-11/12 md:w-[550px]'
        >
          {utilityLoader ? (
            <div className='py-2 flex flex-col w-full h-full justify-center items-center'>
              <AiOutlineLoading3Quarters
                className={`${animations.loading} text-2xl`}
              />
              <h1 id='generating-header' className='mt-3'>
                Deleting...
              </h1>
            </div>
          ) : (
            <>
              <h1
                id='are-you-sure-delete-header'
                aria-label='are-you-sure-delete-header'
                className='text-center mb-6'
              >
                Are you sure you want to{' '}
                <span className='text-red-400'>delete</span> this conversation?
              </h1>

              <div
                id='buttons-container'
                className='flex justify-center items-center'
              >
                <button
                  id='yes-button'
                  aria-label='yes-button'
                  className='flex items-center justify-center text-lg text-neutral-200
                  shadow-md mr-4 bg-[linear-gradient(45deg,#525252_50%,#737373)]
                  rounded-lg px-2 border-1 border-neutral-500 w-full transition-all duration-200  
                  hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500'
                  onClick={() => handleDelete()}
                >
                  Yes
                </button>
                <button
                  id='no-button'
                  aria-label='no-button'
                  className='flex items-center justify-center text-lg text-neutral-200
              shadow-md mr-4 bg-[linear-gradient(45deg,#525252_50%,#737373)]
              rounded-lg px-2 border-1 border-neutral-500 w-full transition-all duration-200  
              hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500'
                  onClick={() => setAreYouSure(false)}
                >
                  No
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <h1 
        id='manage-conversations-header'
        aria-label='manage-conversations-header'
        className={`${orbitron.className} text-xl text-center my-4`}
        style={{
          letterSpacing: '0.3rem',
        }}
      >
        Manage your conversations
      </h1>

      <table
        id='conversations-table'
        aria-label='conversations-table'
        className={`
          ${conversations.length <= 0 && 'hidden'}
          w-full table-auto rounded-lg bg-[linear-gradient(45deg,#1a1a1a_50%,#606060)] shadow-2xl overflow-hidden  
        `}
      >
        <thead className='bg-neutral-700 rounded-t-lg'>
          <tr>
            <th className='border-b-1 text-center px-2 border-r-1 border-neutral-500 p-2'>Title</th>
            <th className='border-b-1 text-center px-2 border-r-1 border-neutral-500 md:table-cell hidden'>Created on</th>
            <th className='border-b-1 text-center px-2 border-r-1 border-neutral-500 md:table-cell hidden'>Last message</th>
            <th className='border-b-1 text-center px-2 border-r-1 border-neutral-500'>
              <div className='flex justify-center items-center w-full h-full'>
                <FaCog className='text-xl' />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {conversations.length > 0 && (
            conversations.map(c => {
              const lastMessageDate = new Date(c.last_message_date + ' UTC');
              const lastMessageDateFiltered = lastMessageDate.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).split(',').join(' at');

              const createdDate = new Date(c.created_date + ' UTC');
              const createdDateFiltered = createdDate.toLocaleString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }).split(',').join(' at');

              return (
                <tr
                  key={c.id}
                >
                  <td className='text-center border-r-1 border-neutral-500 p-2'>
                    {c.title}
                  </td>
                  <td className='text-center border-r-1 border-neutral-500 p-2 md:table-cell hidden'>
                    {createdDateFiltered}
                  </td>
                  <td className='text-center border-r-1 border-neutral-500 p-2 md:table-cell hidden'>
                    {lastMessageDateFiltered}
                  </td>
                  <td className='text-center border-r-1 border-neutral-500 p-2'>
                    <div
                      id='buttons-container'
                      className='flex items-center justify-center'
                    >
                      <Link
                        href={`/dashboard/${c.id}`}
                        id='view-conversation-button'
                        aria-label='view-conversation-button'
                        type='button'
                        className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500 mr-2'
                      >
                        View
                      </Link>
                      <button
                        id='delete-conversation-button'
                        aria-label='delete-conversation-button'
                        type='button'
                        onClick={(e) => {
                          e.stopPropagation();
                          setIdToDelete(c.id);
                          setAreYouSure(true);
                        }}
                        className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>

    </div>
  )
}