'use client'

import { dietPlanType } from '@/app/lib/definitions';
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

export default function DietDetailsInfo({
  dietPlan,
  editing,
  setEditing,
}: {
  dietPlan: dietPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {

  // markdown styles
  const proseStyles = `
    prose prose-p:text-neutral-300 prose-headings:text-neutral-300 prose
    prose-li:text-neutral-300 prose-strong:text-neutral-300 
    prose-code:text-blue-400  prose-a:text-blue-400 max-w-none
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
        id="daily-totals-wrapper"
        className='mt-8'
      >
        <h3
          id='daily-totals-header'
          aria-label='daily-totals-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px]'
        >
          Daily totals
        </h3>

        <table
          id='daily-totals-table'
          aria-label='daily-totals-table'
          className='text-[16px] table-auto mt-2 overflow-hidden rounded-lg bg-neutral-800 w-full shadow-md'
        >
          <thead>
            <tr>  
              <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-500'>Calories</th>
              <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-500'>Carbs</th>
              <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-500'>Fats</th>
              <th className='p-2 text-center border-b-1 md:border-r-1 text-red-400 border-neutral-500'>Protein</th>
              <th className='p-2 text-center border-b-1 text-red-400 border-neutral-500 hidden md:table-cell'>Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='p-2 text-center border-r-1 border-neutral-500'>{dietPlan.daily_totals.calories}cal</td>
              <td className='p-2 text-center border-r-1 border-neutral-500'>{dietPlan.daily_totals.carbs_g}g</td>
              <td className='p-2 text-center border-r-1 border-neutral-500'>{dietPlan.daily_totals.fats_g}g</td>
              <td className='p-2 text-center md:border-r-1 border-neutral-500'>{dietPlan.daily_totals.protein_g}g</td>
              <td className='p-2 text-center hidden md:table-cell'>{dietPlan.daily_totals.weight_g}g</td>
            </tr>
          </tbody>
        </table>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        id='weekly-summary-container'
        className='mt-4'
      >
        <h3
          id='weekly-summary-header'
          aria-label='weekly-summary-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          Weekly summary
        </h3>

        <div
          id='weekly-summary-content'
          className='rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px]'
        >
          <p
            id='expected-change-text'
            aria-label='expected-change-text'
            className='text-neutral-300 mb-2'
          >
            <strong className='text-red-400'>Expected change:</strong> {dietPlan.weekly_summary.expected_change}
          </p>

          <p
            id='notes-text'
            aria-label='notes-text'
            className='text-neutral-300'
          >
            <strong className='text-red-400'>Notes:</strong> {dietPlan.weekly_summary.notes}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        id='hydration-container'
        className='mt-4'
      >

        <h3
          id='hydration-header'
          aria-label='hydration-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          Hydration
        </h3>

        <div
          id='hydration-content'
          className='rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px]'
        >
          <p
            id='water-intake-text'
            aria-label='water-intake-text'
            className='text-neutral-300 mb-2'
          >
            <strong className='text-red-400'>Water intake:</strong> {dietPlan.hydration.water_intake_liters} liters.
          </p>

          <p
            id='notes-text'
            aria-label='notes-text'
            className='text-neutral-300'
          >
            <strong className='text-red-400'>Notes:</strong> {dietPlan.hydration.notes}
          </p>
        </div>

      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        id='supplements-container'
        className='mt-4'
      >

        <h3
          id='supplements-header'
          aria-label='supplements-header'
          className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
        >
          Supplements
        </h3>

        <ul
          id='supplements-content'
          className={`
            ${dietPlan.supplements.length > 0 ? 'md:grid md:grid-cols-2 gap-2' : 'text-center'}
            rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px]
          `}
        >
          {dietPlan.supplements.length > 0 ? (
            dietPlan.supplements.map((sup, i) => {
              return (
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: i / 10 + 0.2 }}
                  key={sup.name}
                  id='supplement-text'
                  aria-label='supplement-text'
                  className={`
                    ${i !== dietPlan.supplements.length - 1 && 'border-b-1 pb-2 mb-4'}
                    text-[16px] 
                    md:rounded-lg md:shadow-lg md:border-1 md:p-2 md:bg-neutral-700 w-full h-full border-neutral-500
                  `}
                >
                  <h3
                    id='name-header'
                    aria-label='name-header'
                    className='text-lg mb-2'
                  >
                    {`${i + 1}. ${sup.name}`}
                  </h3>

                  <p
                    id='dosage-text'
                    aria-label='dosage-text'
                    className='text-neutral-300'
                  >
                    <span className='text-red-400'>Dosage:</span> {sup.dosage}
                  </p>

                  <p
                    id='timing-text'
                    aria-label='timing-text'
                    className='text-neutral-300'
                  >
                    <span className='text-red-400'>Timing:</span> {sup.timing}
                  </p>
                </motion.li>
              )
            })
          ) : (
            <p className='text-center text-neutral-400'>
              No supplements provided
            </p>
          )}
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        id='general-notes-container'
        className='mt-4 w-full'
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
            {dietPlan.general_notes}
          </Markdown>
        </div>

      </motion.div>

      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
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
            className={`${dietPlan.user_notes && proseStyles} w-full rounded-lg shadow-md border border-neutral-600 bg-neutral-800 p-2 text-[16px] mb-2`}
          >
            {dietPlan.user_notes ? (
              <Markdown remarkPlugins={[remarkGfm]}>
                {dietPlan.user_notes}
              </Markdown>
            ) : (
              <p className='text-neutral-400 text-center'>
                No notes were provided
              </p>
            )}
          </div>
        </motion.div>
    </div>
  )
}