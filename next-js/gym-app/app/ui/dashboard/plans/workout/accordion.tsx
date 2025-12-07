'use client';

import { dailyWorkoutsType } from '@/public/plan_metadata/workout-formdata';
import { useEffect, useRef, useState } from 'react';
import { IoChevronDownSharp } from 'react-icons/io5';
import { TbSeparator } from 'react-icons/tb';
import { motion } from 'framer-motion';

export default function WorkoutAccordion({
  data,
  toggleAllAccordions,
  index
}: {
  data: dailyWorkoutsType;
  toggleAllAccordions: boolean;
  index: number;
}) {
  const [openAccordion, setOpenAccordion] = useState<boolean>(false);
  const ulRef = useRef<HTMLUListElement | null>(null); // used to calculate the scroll height for the drawer animation
  const [ulScrollHeight , setUlScrollHeight] = useState<number>(0);

  // calculate scroll height in mount
  useEffect(() => {
    setUlScrollHeight(ulRef.current?.scrollHeight || 0)
  }, [])

  // calculate scroll height if data changed
  useEffect(() => {
    setUlScrollHeight(ulRef.current?.scrollHeight || 0)
  }, [data, openAccordion])

  // collapse or expand all accordions
  useEffect(() => {
    setOpenAccordion(toggleAllAccordions);
  }, [toggleAllAccordions]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 + (index / 10) }}
      id='accordion-wrapper'
      className='w-full flex flex-col justify-center items-center'
    >
      <div
        id='day-toggler-wrapper'
        className='flex w-full justify-between items-center mb-2'
      >
        <div
          id='day-and-name-container'
          className='
          text-white w-fit border-1 border-neutral-500
            rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center 
          '
        >
          <h2
            id='day-name-header'
            aria-label='day-name-header'
            className='text-xl'
          >
            Day {data.day}
          </h2>
          <TbSeparator className='mx-2 text-red-400' />
          <h1 id='day-name-header' aria-label='day-name-header' className='text-xl'>
            <p className='hidden min-[535px]:block'>{data.workout_name}</p>
            <p className='min-[535px]:hidden'>
              {data.workout_name.slice(0, 10) + '...'}
            </p>
          </h1>
        </div>
        <button
          id='toggle-accordion-button'
          aria-label='toggle-accordion-button'
          className={`
            ${openAccordion && 'scale-105 bg-neutral-500 text-red-400'} transition-all duration-300
            hover:cursor-pointer hover:scale-105 hover:text-red-400 active:scale-95 
            rounded-md p-2 bg-neutral-700 shadow-md text-center border-1 border-neutral-500
          `}
          onClick={() => setOpenAccordion(!openAccordion)}
        >
          <IoChevronDownSharp
            className={`${openAccordion && '-rotate-180'} transition-all duration-300`}
          />
        </button>
      </div>

      <ul
        id='meal-items-container'
        ref={ulRef}
        style={{
          height: openAccordion ? ulScrollHeight + 8 : 0,
          opacity: openAccordion ? 1 : 0,
        }}
        className={`
          transition-all duration-600 pb-2
          w-full rounded-lg bg-neutral-800 shadow-lg p-2 text-[16px]
        `}
      >
        <div
          id='ul-content-container'
          className={`
            transition-all border-b-1 border-neutral-500 pb-4
            ${openAccordion ? 'duration-1500 opacity-100' : 'opacity-0 pointer-events-none duration-100'}
          `}
        >
          <p
            id='workout-duration-text'
            aria-label='workout-duration-text'
          >
            <span className='text-red-400'>Duration:</span> {data.workout_duration_minutes} min.
          </p>

          <p
            id='total-exercises-text'
            aria-label='total-exercises-text'
          >
            <span className='text-red-400'>Exercises:</span> {data.total_exercises}.
          </p>

          <p
            id='total_estimated_calories_burned-text'
            aria-label='total_estimated_calories_burned-text'
          >
            <span className='text-red-400'>Calories burned:</span> {data.total_estimated_calories_burned}cal.
          </p>
        </div>

        <div
          id='exercises-container'
          className={`
            ${openAccordion ? 'duration-1500 opacity-100' : 'opacity-0 pointer-events-none duration-100'}
            w-full text-[16px] mt-4 md:grid md:grid-cols-2 md:gap-2 transition-all
          `}
        >
          {data.exercises.map((ex, i) => {
            return (
            <div
              key={ex.exercise_name}
              id='exercises-content-container'
              className={`
                ${i === data.exercises.length - 1 && 'border-b-0'}
                pb-4 md:mb-0 md:border-1 md:rounded-lg md:bg-neutral-600 md:shadow-lg 
                p-2 border-neutral-400 mb-4 w-full flex flex-col items-start justify-start border-b-1
              `}
            >
              <h3
                id='exercise-name'
                aria-label='exercise-name'
              >
                {ex.exercise_name}
              </h3>
              <p
                id='equipment'
                aria-label='equipment'
                className='text-neutral-400'
              >
                Equipment: {ex.equipment}
              </p>
              <p
                id='sets'
                aria-label='sets'
                className='text-neutral-400'
              >
                Sets: {ex.sets}
              </p>
              <p
                id='reps'
                aria-label='reps'
                className='text-neutral-400'
              >
                Reps: {ex.reps}
              </p>
              <p
                id='rest_seconds'
                aria-label='rest_seconds'
                className='text-neutral-400'
              >
                Rest: {ex.rest_seconds} seconds
              </p>
              <p
                id='estimated_calories_burned'
                aria-label='estimated_calories_burned'
                className='text-red-400'
              >
                Calories burned: {ex.estimated_calories_burned} cals
              </p>
              <div
                id='progression-container'
                className='border-1 border-neutral-300 rounded-lg bg-neutral-800 p-2 shadow-md mt-2'
              >
                <p
                  id='exercise_notes'
                  aria-label='exercise_notes'
                  className='text-neutral-400'
                >
                  <span className='text-white'>Notes:</span> {ex.exercise_notes}
                </p>
              </div>
            </div>
            )
          })}
        </div>

      </ul>
    </motion.div>
  );
}
// export type exerciseType = {
//   exercise_name: string,
//   equipment: string,
//   sets: number,
//   reps: number,
//   rest_seconds: number,
//   estimated_calories_burned: number,
//   progression: {
//     type: string,
//     increment_value: number,
//     frequency: string,
//   },
//   exercise_notes: string
// }

// export type dailyWorkoutsType = {
//   day: number,
//   workout_name: string,
//   workout_duration_minutes: number,
//   exercises: exerciseType[],
//   total_exercises: number,
//   total_estimated_calories_burned: number
// }



