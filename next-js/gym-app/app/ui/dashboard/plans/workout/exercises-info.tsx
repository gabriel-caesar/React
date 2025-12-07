import { SetStateAction, useState } from 'react';
import { LuExpand, LuShrink } from 'react-icons/lu';
import { workoutPlanType } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import WorkoutAccordion from './accordion';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function ExercisesInfo({
  workoutPlan,
  editing,
  setEditing,
}: {
  workoutPlan: workoutPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [toggleAllAccordions, setToggleAllAccordions] =
    useState<boolean>(false);
  const daily_workouts = workoutPlan.daily_workouts;

  return (
    <div id='meals-info-container'>
      <h1
        id='meals-info-header'
        aria-label='meals-info-header'
        className={`${orbitron.className} text-xl w-full text-center`}
        style={{ letterSpacing: '0.1rem' }}
      >
        Exercises Information
      </h1>

      <div
        id='toggle-accordions-wrapper'
        className='w-full flex justify-end items-center mt-4 mb-6'
      >
        <button
          id='toggle-accordions-button'
          aria-label='toggle-accordions-button'
          className={`
            ${toggleAllAccordions && 'text-red-400 scale-105'}
            group relative rounded-md p-2 bg-neutral-700 shadow-md flex
            hover:cursor-pointer hover:text-red-400 hover:scale-105 active:scale-95
            justify-start items-center text-white w-fit border-1 border-neutral-500 transition-all duration-300
          `}
          onClick={() => setToggleAllAccordions(!toggleAllAccordions)}
        >
          {toggleAllAccordions ? <LuShrink /> : <LuExpand />}
          <div
            id={`toggle-accordions-caption`}
            aria-label={`toggle-accordions-caption`}
            className='absolute text-white whitespace-nowrap left-1/2 -translate-x-1/2 -bottom-6 bg-neutral-700 rounded-lg px-2 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
          >
            {toggleAllAccordions ? 'Collapse all' : 'Expand all'}
          </div>
        </button>
      </div>

      <div id='sections-content-wrapper' className='mt-4'>
        {daily_workouts.map((day, i) => {
          return (
            <div
              id='day-container'
              key={day.workout_name}
              className={`${i !== daily_workouts.length - 1 && 'mb-4'}`}
            >
              <WorkoutAccordion
                data={day}
                toggleAllAccordions={toggleAllAccordions}
                index={i}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
