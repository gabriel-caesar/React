import { workoutPlanType } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import { SetStateAction } from 'react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export function WorkoutDetailsInfo({
  workoutPlan,
  editing,
  setEditing,
}: {
  workoutPlan: workoutPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {

  // markdown styles
  const proseStyles = `
    prose prose-p:text-neutral-300 prose-headings:text-neutral-300 
    prose-li:text-neutral-300 prose-strong:text-neutral-300 
    prose-code:text-blue-400  prose-a:text-blue-400
    prose-blockquote:bg-slate-700 prose-blockquote:w-fit
    prose-blockquote:rounded-tr-md prose-blockquote:pr-6
    prose-blockquote:text-neutral-400 prose-blockquote:rounded-br-md
    marker:text-red-400 prose-th:text-neutral-300 prose-td:text-neutral-300
  `;

  return (
    <div id='details-info-container'>
      <h1
        id='details-info-header'
        aria-label='details-info-header'
        className={`${orbitron.className} text-xl w-full text-center`}
        style={{ letterSpacing: '0.1rem' }}
      >
        Details Information
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        id='weekly-totals-container'
        className='mt-4'
      >
        <h3
          id='weekly-totals-header'
          aria-label='weekly-totals-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          Weekly totals
        </h3>

        <div
          id='weekly-totals-content'
          className='rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px]'
        >
          <p
            id='total-calories-burned-text'
            aria-label='total-calories-burned-text'
            className='text-neutral-300 mb-2'
          >
            <strong className='text-red-400'>Total calories burned:</strong> {workoutPlan.weekly_totals.total_calories_burned}cal
          </p>

          <p
            id='total-sets-text'
            aria-label='total-sets-text'
            className='text-neutral-300 mb-2'
          >
            <strong className='text-red-400'>Total number of sets:</strong> {workoutPlan.weekly_totals.total_sets}
          </p>

          <p
            id='total-exercises-text'
            aria-label='total-exercises-text'
            className='text-neutral-300'
          >
            <strong className='text-red-400'>Total number of exercises:</strong> {workoutPlan.weekly_totals.total_exercises}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        id='general-notes-container'
        className='mt-4'
      >
        <h3
          id='general-notes-header'
          aria-label='general-notes-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          General notes
        </h3>

        <div
          id='general-notes-content'
          className={`${proseStyles} w-full rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px] mb-2`}
        >
          <Markdown remarkPlugins={[remarkGfm]}>
            {workoutPlan.general_notes}
          </Markdown>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        id='general-notes-container'
        className='mt-4'
      >
        <h3
          id='general-notes-header'
          aria-label='general-notes-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          User notes
        </h3>

        <div
          id='general-notes-content'
          className={`${workoutPlan.user_notes && proseStyles} w-full rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px] mb-2`}
        >
          {workoutPlan.user_notes ? (
            <Markdown remarkPlugins={[remarkGfm]}>
              {workoutPlan.user_notes}
            </Markdown>
          ) : (
            <p className='text-neutral-600 text-center'>
              No notes were provided
            </p>
          )}
        </div>
      </motion.div>

    </div>
  )
}