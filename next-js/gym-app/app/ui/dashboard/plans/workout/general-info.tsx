import { workoutPlanType } from '@/app/lib/definitions';
import { SetStateAction, useState } from 'react';
import { motion } from 'framer-motion';
import Dropdown from '@/app/ui/dropdown';
import { Orbitron } from 'next/font/google';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function WorkoutGeneralInfo({
  workoutPlan,
  editing,
  setEditing,
}: {
  workoutPlan: workoutPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [experienceLevel, setExperienceLevel] = useState<string>(
    workoutPlan.experience_level.split('')
      .map((l, i) => (i === 0 ? l.toUpperCase() : l))
      .join('')
  );
  const [planGoal, setPlanGoal] = useState<string>('');

  const generalInfoData = [
    'goal',
    'gender',
    'current_weight',
    'height',
    'age',
    'experience_level', // dropdown
    'number_of_workout_days',
    'duration_weeks',
  ];

  return (
    <div id='general-info-container'>
      <h1
        id='general-info-header'
        aria-label='general-info-header'
        className={`${orbitron.className} text-xl w-full text-center`}
        style={{ letterSpacing: '0.1rem' }}
      >
        General Information
      </h1>

      <div
        id='sections-content-wrapper'
        className='md:grid md:grid-cols-2 gap-4 pb-4'
      >
        {generalInfoData.map((data, i) => {
          const placeholder =
            data === 'current_weight'
              ? 'Current weight...'
              : data === 'number_of_workout_days'
                ? 'Workout days...'
                : data === 'duration_weeks'
                  ? 'Duration in weeks...'
                  : '';

          return (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: i / 10 + 0.2 }}
              id={`${data}-section`}
              className={`mt-4 flex flex-col items-start justify-start ${i % 2 !== 0 ? 'md:items-end md:justify-end' : 'md:items-start md:justify-start'}`}
              key={data}
            >
              <label
                htmlFor={`${!editing ? `${data}-text` : `edit-${data}-input`}`}
                id={`${data}-label`}
                aria-label={`${data}-label`}
                className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-red-400 w-fit border-1 border-neutral-500 mb-2 text-[16px] mt-8'
              >
                {data
                  .split('')
                  .map((l, i) => {
                    if (i === 0) {
                      return l.toUpperCase();
                    } else if (l === '_') {
                      l = ' ';
                      return l;
                    } else {
                      return l;
                    }
                  })
                  .join('')}
              </label>

              {data === 'experience_level' ? (
                !editing ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    id={`${data}-text`}
                    aria-label={`${data}-text`}
                    className={`border-b-1 border-neutral-500 text-[16px] mt-2 w-full flex flex-col items-start justify-start ${i % 2 !== 0 ? 'md:items-end md:justify-end' : 'md:items-start md:justify-start'}`}
                  >
                    {experienceLevel}
                  </motion.p>
                ) : (
                  <Dropdown
                    options={['Newbie', 'Intermediate', 'Very experienced']}
                    selector={experienceLevel}
                    setSelector={setExperienceLevel}
                    style='w-full'
                  />
                )
              ) : !editing ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  id={`${data}-text`}
                  aria-label={`${data}-text`}
                  className={`border-b-1 border-neutral-500 text-[16px] mt-2 w-full flex flex-col items-start justify-start ${i % 2 !== 0 ? 'md:items-end md:justify-end' : 'md:items-start md:justify-start'}`}
                >
                  {String(workoutPlan[data as keyof unknown])
                    .split('')
                    .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                    .join('')}
                </motion.p>
              ) : (
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  type='text'
                  id={`edit-${data}-input`}
                  placeholder={
                    data.includes('_')
                      ? placeholder
                      : data
                          .split('')
                          .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                          .join('') + '...'
                  }
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800 text-[16px] w-full'
                />
              )}
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
