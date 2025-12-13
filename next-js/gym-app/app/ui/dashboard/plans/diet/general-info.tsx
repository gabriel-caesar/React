'use client';

import { capitalizeInitial, uniqueId } from '@/app/actions/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { SetStateAction, useActionState, useEffect, useRef, useState } from 'react';
import { dietPlanType } from '@/app/lib/definitions';
import { IoMdClose } from 'react-icons/io';
import { Orbitron } from 'next/font/google';
import { motion } from 'framer-motion';
import scrollbars from '../../../../css/dashboard.module.css';
import animations from '../../../../css/animations.module.css';
import Dropdown from '../../../dropdown';
import { editDietGeneralInfo } from '@/app/actions/plans';
import { v4 } from 'uuid';

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

  // action state
  const [state, editDietGeneralInfoAction, isPending] = useActionState(editDietGeneralInfo, undefined);

  // error handlers for wiggle animation
  const [wiggle, setWiggle] = useState<boolean>(false);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  // edit data states
  const [activityLevel, setActivityLevel] = useState<string>(
    dietPlan.activity_level
  );
  const [wantSupplements, setWantSupplements] = useState<string>(
    dietPlan.want_supplements ? 'Yes' : 'No'
  );
  const [arrayOfRestrictions, setArrayOfRestrictions] = useState<
    { restriction: string; id: string }[]
  >(dietPlan.dietary_restrictions);
  const [restriction, setRestriction] = useState<string>('');
  const [planGoal, setPlanGoal] = useState<string>(dietPlan.goal);
  const [gender, setGender] = useState<string>(dietPlan.gender);
  const [age, setAge] = useState<string | number>(dietPlan.age);
  const [height, setHeight] = useState<string>(dietPlan.height);
  const [currentWeight, setCurrentWeight] = useState<string>(
    dietPlan.current_weight
  );
  const [numberOfMeals, setNumberOfMeals] = useState<string | number>(
    dietPlan.number_of_meals
  );
  const [mealTiming, setMealTiming] = useState<string | number>(
    dietPlan.meal_timing_hours
  );
  const [duration, setDuration] = useState<string | number>(dietPlan.duration_weeks);
  const [caloricIntake, setCaloricIntake] = useState<string | number>(dietPlan.daily_caloric_intake);

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
    'gender', // dropdown
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
  
  useEffect(() => {
    if (!errorRef.current) return;
    const el = errorRef.current;
    el.classList.remove(animations.wiggle_input);
    void el.offsetWidth;
    el.classList.add(animations.wiggle_input);
  }, [wiggle])

  useEffect(() => {
    if (!state?.errors) return;
    setWiggle(!wiggle)
  }, [isPending])

  return (
    <form id='general-info-container' action={editDietGeneralInfoAction}>
      <h1
        id='general-info-header'
        data-testid='general-info-header'
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
                    {capitalizeInitial(activityLevel)}
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
                    data-testid='dietary_restrictions_container'
                    className='text-[16px] w-full flex flex-wrap gap-2 items-center justify-start rounded-md mt-2 bg-neutral-800 p-2 border-1 border-neutral-400 shadow-md'
                  >
                    {dietPlan[data].length > 0 ? (
                      dietPlan[data].map(
                        (r: { restriction: string; id: string }, index) => {
                          return (
                            <p key={r.id} data-testid={`submitted-${r.restriction}-text`}>
                              {capitalizeInitial(r.restriction) +
                                (index !== dietPlan[data].length - 1
                                  ? ','
                                  : '.')}
                            </p>
                          );
                        }
                      )
                    ) : (
                      <p className='text-sm' data-testid='no-restrictions-added-text'>No restrictions were added</p>
                    )}
                  </div>
                ) : (
                  <>
                    <motion.input
                      type='text'
                      value={restriction}
                      onChange={(e) => e.target.value.length <= 16 && setRestriction(e.target.value)}
                      placeholder='Restrictions...'
                      id='edit-restrictions-input'
                      data-testid='edit-restrictions-input'
                      aria-label='edit-restrictions-input'
                      className='text-[16px] w-full focus-within:outline-none px-2 p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // prevents form submission by pressing enter
                          if (restriction.length > 0)
                            handleRestriction(restriction); // adds the restriction to the array of restrictions
                        }
                      }}
                    />
                    <div
                      id='restrictions-showcase-container'
                      data-testid='restrictions-showcase-container'
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
                              data-testid={`${obj.restriction}-restriction`}
                              aria-label='restriction-name'
                              className='mr-2'
                            >
                              {obj.restriction}
                            </p>
                            <button
                              type='button'
                              id='remove-restriction'
                              data-testid='remove-restriction'
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
              ) : (data === 'gender' && editing) ? (
                <Dropdown 
                  selector={gender}
                  setSelector={setGender}
                  options={['Male', 'Female']}
                  style='w-full'
                />
              ) : !editing ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  id={`${data}-text`}
                  data-testid={`${data}-text`}
                  aria-label={`${data}-text`}
                  className={`border-b-1 border-neutral-500 text-[16px] mt-2 w-full flex flex-col items-start justify-start ${i % 2 !== 0 ? 'md:items-end md:justify-end' : 'md:items-start md:justify-start'}`}
                >
                  {capitalizeInitial(String(dietPlan[data as keyof unknown]))}
                </motion.p>
              ) : (
                <>
                  <motion.input
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    disabled={isPending}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    type='text'
                    id={`edit-${data}-input`}
                    data-testid={`edit-${data}-input`}
                    name={data}
                    placeholder={
                      data.includes('_')
                        ? placeholder
                        : capitalizeInitial(data)
                    }
                    value={data === 'goal'
                          ? planGoal
                          : data === 'current_weight'
                            ? currentWeight
                            : data === 'height'
                              ? height
                              : data === 'age'
                                ? age
                                : data === 'number_of_meals'
                                  ? numberOfMeals
                                  : data === 'meal_timing_hours'
                                    ? mealTiming
                                      : data === 'daily_caloric_intake'
                                        ? caloricIntake
                                        : duration}
                    onChange={(e) => data === 'goal'
                          ? setPlanGoal(e.target.value)
                          : data === 'current_weight'
                            ? setCurrentWeight(e.target.value)
                            : data === 'height'
                              ? setHeight(e.target.value)
                              : data === 'age'
                                ? setAge(e.target.value)
                                : data === 'number_of_meals'
                                  ? setNumberOfMeals(e.target.value)
                                    : data === 'meal_timing_hours'
                                      ? setMealTiming(e.target.value)
                                      : data === 'daily_caloric_intake'
                                        ? setCaloricIntake(e.target.value)
                                        : setDuration(e.target.value)}
                    className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800 text-[16px] w-full'
                  />
                  {state?.errors?.[data as keyof typeof state.errors] && (
                    <p
                      className={`text-[16px] bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 rounded-lg w-full text-center px-2 py-1 text-white mt-2 ${
                        wiggle && animations.wiggle_input
                      }`}
                      id='name-error-text'
                      aria-label='name-error-text'
                    >
                      {state?.errors?.[data as keyof typeof state.errors]}
                    </p>
                  )}
                </>
              )}
            </motion.section>
          );
        })}
      </div>
      {editing && (
        <div
          id='buttons-container'
          className='mt-8 flex flex-col md:flex-row w-full justify-center items-center'
        >
          <button
            type='button'
            id='cancel-edit-button'
            aria-label='cancel-edit-button'
            onClick={() => setEditing(false)}
            className={`
              ${isPending && 'hidden'}
              md:bg-[linear-gradient(-45deg,#101010_50%,#606060)] md:w-1/4 md:mr-2 bg-[linear-gradient(45deg,#101010_50%,#606060)]
              border-neutral-500 border text-[16px] w-full p-2 rounded-lg mb-2 md:mb-0 hover:cursor-pointer hover:text-red-400 
              hover:scale-105 active:scale-95 transition-all
            `}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isPending}
            id='edit-plan-button'
            data-testid='edit-plan-button'
            aria-label='edit-plan-button'
            className={`
              md:w-1/4 w-full p-2 rounded-lg transition-all flex items-center justify-center border text-[16px]
              ${
                isPending
                  ? 'bg-[linear-gradient(45deg,#202020_50%,#656565)] text-neutral-500 hover:cursor-not-allowed'
                  : 'bg-[linear-gradient(45deg,#101010_50%,#606060)] border-neutral-500 hover:text-red-400 hover:scale-105 active:scale-95 hover:cursor-pointer'
              }
            `}
          >
            {isPending ? (
              <>
                Editing{' '}
                <AiOutlineLoading3Quarters
                  strokeWidth={1.5}
                  className={`${animations.loading} ml-2`}
                />
              </>
            ) : (
              'Edit'
            )}
          </button>
        </div>
      )}
      {editing && (
        <>
          <input 
            type='text'
            className='hidden'
            id='gender-hidden-input'
            name='gender'
            value={gender}
            readOnly
          />
          <input 
            type='text'
            className='hidden'
            id='activity-level-hidden-input'
            name='activity_level'
            value={activityLevel}
            readOnly
          />
          <input 
            type='text'
            className='hidden'
            id='want-supplements-hidden-input'
            name='want_supplements'
            value={wantSupplements}
            readOnly
          />
          <input
            type='text'
            className='hidden'
            name='plan_id'
            id='plan-id-input'
            value={dietPlan.id}
            readOnly
          />
          {arrayOfRestrictions.map(res => {
            return (
              <input
                key={res.id}
                type='text'
                className='hidden'
                name='dietary_restrictions'
                id={`restrictions-${res.restriction}`}
                value={res.restriction}
                readOnly
              />
            )
          })}
        </>
      )}
    </form>
  );
}
