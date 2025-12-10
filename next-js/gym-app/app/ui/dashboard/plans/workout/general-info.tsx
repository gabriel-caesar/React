import {
  SetStateAction,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { editWorkoutGeneralInfo } from '@/app/actions/plans';
import { capitalizeInitial } from '@/app/actions/utils';
import { workoutPlanType } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import { motion } from 'framer-motion';
import animations from '../../../../css/animations.module.css';
import Dropdown from '@/app/ui/dropdown';

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
    capitalizeInitial(workoutPlan.experience_level)
  );
  const [state, editGeneralInfoAction, isPending] = useActionState(
    editWorkoutGeneralInfo,
    undefined
  ); // form action
  // input states for editing
  const [planGoal, setPlanGoal] = useState<string>(
    capitalizeInitial(workoutPlan.goal)
  );
  const [gender, setGender] = useState<string>(
    capitalizeInitial(workoutPlan.gender)
  );
  const [currentWeight, setCurrentWeight] = useState<string>(
    capitalizeInitial(workoutPlan.current_weight)
  );
  const [height, setHeight] = useState<string>(
    capitalizeInitial(workoutPlan.height)
  );
  const [age, setAge] = useState<string>(workoutPlan.age as string);
  const [numberOfWorkoutDays, setNumberOfWorkoutDays] = useState<string>(
    workoutPlan.number_of_workout_days as string
  );
  const [duration, setDuration] = useState<string>(
    workoutPlan.duration_weeks as string
  );

  const [wiggle, setWiggle] = useState<boolean>(false); // used to persist the wiggle animation across consecutive wrong submissions
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  const generalInfoData = [
    'goal',
    'gender', // dropdown
    'current_weight',
    'height',
    'age',
    'experience_level', // dropdown
    'number_of_workout_days',
    'duration_weeks',
  ];

  useEffect(() => {
    if (!errorRef.current) return;
    const el = errorRef.current;
    // remove animation class
    el.classList.remove(animations.wiggle_input);
    void el.offsetWidth; // force reflow
    // add animation class again
    el.classList.add(animations.wiggle_input);
  }, [wiggle]);

  useEffect(() => {
    if (!state?.errors) return;
    setWiggle(!wiggle);
  }, [isPending]);

  return (
    <form id='general-info-container' action={editGeneralInfoAction}>
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
              ) : data === 'gender' ? (
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
                    {capitalizeInitial(gender)}
                  </motion.p>
                ) : (
                  <Dropdown
                    options={['Male', 'Female']}
                    selector={gender}
                    setSelector={setGender}
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
                  {capitalizeInitial(
                    String(workoutPlan[data as keyof unknown])
                  )}
                </motion.p>
              ) : (
                <>
                  <motion.input
                    disabled={isPending}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    type='text'
                    id={`edit-${data}-input`}
                    name={data}
                    placeholder={
                      data.includes('_')
                        ? placeholder
                        : data
                            .split('')
                            .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                            .join('') + '...'
                    }
                    value={
                      data === 'goal'
                        ? planGoal
                        : data === 'current_weight'
                          ? currentWeight
                          : data === 'height'
                            ? height
                            : data === 'age'
                              ? age
                              : data === 'number_of_workout_days'
                                ? numberOfWorkoutDays
                                : duration
                    }
                    onChange={(e) =>
                      data === 'goal'
                        ? setPlanGoal(e.target.value)
                        : data === 'current_weight'
                          ? setCurrentWeight(e.target.value)
                          : data === 'height'
                            ? setHeight(e.target.value)
                            : data === 'age'
                              ? setAge(e.target.value)
                              : data === 'number_of_workout_days'
                                ? setNumberOfWorkoutDays(e.target.value)
                                : setDuration(e.target.value)
                    }
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
                      {state.errors[data as keyof typeof state.errors]}
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
            id='edit-button'
            aria-label='edit-button'
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
        <input
          type='text'
          className='hidden'
          name='experience_level'
          id='experience-level-hidden-input'
          value={experienceLevel.toLowerCase()}
          readOnly
        />
      )}
      {editing && (
        <input
          type='text'
          className='hidden'
          name='gender'
          id='gender-hidden-input'
          value={gender.toLowerCase()}
          readOnly
        />
      )}
      {editing && (
        <input
          type='text'
          className='hidden'
          name='plan_id'
          id='plan-id-input'
          value={workoutPlan.id}
          readOnly
        />
      )}
    </form>
  );
}
