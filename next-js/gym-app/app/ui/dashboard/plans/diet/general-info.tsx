'use client';
import { dietPlanType } from '@/app/lib/definitions';
import { motion } from 'framer-motion';
import { Orbitron } from 'next/font/google';
import { SetStateAction, useState } from 'react';
import Dropdown from '../../../dropdown';
import { uniqueId } from '@/app/actions/utils';
import { IoMdClose } from 'react-icons/io';
import scrollbars from '../../../../css/dashboard.module.css';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function DietGeneralInfo({
  dietPlan,
  editing,
  setEditing,
}: {
  dietPlan: dietPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [planGoal, setPlanGoal] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>(
    dietPlan.activity_level
      .split('')
      .map((l, i) => (i === 0 ? l.toUpperCase() : l))
      .join('')
  );
  const [wantSupplements, setWantSupplements] = useState<string>(
    dietPlan.want_supplements ? 'Yes' : 'No'
  );
  const [restriction, setRestriction] = useState<string>('');
  const [arrayOfRestrictions, setArrayOfRestrictions] = useState<
    { restriction: string; id: string }[]
  >(dietPlan.dietary_restrictions);

  // removes one restriction from the array
  function handleRemoveRestriction(id: string) {
    const updatedArray = arrayOfRestrictions.filter((x) => x.id !== id);
    setArrayOfRestrictions(updatedArray);
  }

  // adds one more restriction to the array
  function handleRestriction(value: string) {
    if (!value.length) return; // if the user tries to submit a blank string
    const restrictionId = uniqueId();
    const newRestriction = {
      id: restrictionId,
      restriction: value,
    };
    const updatedArray = [...arrayOfRestrictions, newRestriction];
    setArrayOfRestrictions(updatedArray);
    setRestriction('');
  }

  const generalInfoData = [
    'goal',
    'gender',
    'current_weight',
    'height',
    'age',
    'activity_level', // dropdown
    'number_of_meals',
    'meal_timing_hours',
    'duration_weeks',
    'want_supplements', // dropdown
    'daily_caloric_intake',
    'dietary_restrictions', // input+array
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
              : data === 'number_of_meals'
                ? 'Number of meals...'
                : data === 'meal_timing_hours'
                  ? 'Meal timing...'
                  : data === 'duration_weeks'
                    ? 'Duration in weeks...'
                    : data === 'daily_caloric_intake'
                      ? '3000...'
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
              {data === 'activity_level' ? (
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
                    {activityLevel}
                  </motion.p>
                ) : (
                  <Dropdown
                    options={['Couch potato', 'Intermediate', 'Very active']}
                    selector={activityLevel}
                    setSelector={setActivityLevel}
                    style='w-full'
                  />
                )
              ) : data === 'want_supplements' ? (
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
                    {wantSupplements}
                  </motion.p>
                ) : (
                  <Dropdown
                    options={['Yes', 'No']}
                    selector={wantSupplements}
                    setSelector={setWantSupplements}
                    style='w-full'
                  />
                )
              ) : data === 'dietary_restrictions' ? (
                !editing ? (
                  <div
                    id='dietary_restrictions_container'
                    className='text-[16px] w-full flex flex-wrap gap-2 items-center justify-start rounded-md mt-2 bg-neutral-800 p-2 border-1 border-neutral-400 shadow-md'
                  >
                    {dietPlan[data].length > 0 ? (
                      dietPlan[data].map(
                        (r: { restriction: string; id: string }, index) => {
                          return (
                            <p key={r.id}>
                              {r.restriction
                                .split('')
                                .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                                .join('') + (index !== dietPlan[data].length - 1 ? ',' : '.')}
                            </p>
                          );
                        }
                      )
                    ) : (
                      <p className='text-sm'>No restrictions were added</p>
                    )}
                  </div>
                ) : (
                  <>
                    <motion.input
                      type='text'
                      value={restriction}
                      onChange={(e) => setRestriction(e.target.value)}
                      placeholder='Restrictions...'
                      id='edit-restrictions-input'
                      aria-label='edit-restrictions-input'
                      className='text-[16px] w-full focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (restriction.length > 0)
                            handleRestriction(restriction); // adds the restriction to the array of restrictions
                        }
                      }}
                    />
                    <div
                      id='restrictions-showcase-container'
                      aria-label='restrictions-showcase-container'
                      className={`
                        ${arrayOfRestrictions.length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                        ${scrollbars.scrollbar_chat} max-h-40 overflow-y-auto overflow-x-hidden bg-neutral-800 
                        rounded-lg border-1 border-neutral-500 flex flex-wrap gap-2 p-2 mt-3 transition-all duration-300
                      `}
                    >
                      {arrayOfRestrictions?.map((obj) => {
                        return (
                          <div
                            key={obj.id}
                            className={`flex items-center justify-between rounded-lg bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 text-center px-2 w-fit text-[16px]`}
                          >
                            <p
                              id='restriction-name'
                              aria-label='restriction-name'
                              className='mr-2'
                            >
                              {obj.restriction}
                            </p>
                            <button
                              type='button'
                              id='remove-restriction'
                              aria-label='remove-restriction'
                              className='p-1 text-md hover:brightness-50 hover:cursor-pointer transition-all'
                              onClick={() => handleRemoveRestriction(obj.id)}
                            >
                              <IoMdClose />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
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
                  {String(dietPlan[data as keyof unknown])
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
