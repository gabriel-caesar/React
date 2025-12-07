'use client';

import React, {
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { workoutFormDataType, workoutFormRawData } from '@/public/plan_metadata/workout-formdata';
import { dietFormDataType, dietFormRawData } from '@/public/plan_metadata/diet-formdata';
import { GoTriangleLeft, GoTriangleRight } from 'react-icons/go';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { sections_workout } from '@/public/plan_metadata/sections-workout';
import { RiResetLeftLine } from "react-icons/ri";
import { sections_diet } from '@/public/plan_metadata/sections-diet';
import { aiChatContext } from '../chat-structure';
import { sectionType } from '@/app/lib/definitions';
import { IoMdClose } from 'react-icons/io';
import { Orbitron } from 'next/font/google';
import { uniqueId } from '@/app/actions/utils';
import styles from '../../../../css/animations.module.css';
import scrollbars from '../../../../css/dashboard.module.css';
import animations from '../../../../css/animations.module.css';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function Sections() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  const [sectionIndex, setSectionIndex] = useState<number>(0); // indexes what section is being rendered
  const [inputError, setInputError] = useState<boolean>(false); // enables the error for a given input
  const [allowance, setAllowance] = useState<boolean>(false); // enables the arrow if the input is valid

  // context from chat-structure.tsx
  const {
    planType,
    setPlanType,
    setIsSuggest,
    setDietFormData,
    dietFormData,
    setWorkoutFormData,
    workoutFormData,
    missingValues,
    setMissingValues,
    generatingPlan,
  } = useAIChatContext();
  const isDiet = planType === 'diet';
  const currentSection = isDiet ? sections_diet : sections_workout;

  useEffect(() => {
    if (!missingValues) setSectionIndex(0);
  }, [generatingPlan]); // restoring the first page of the form

  return (
    <div
      className='flex items-end justify-between relative'
      id='content-wrapper'
    >
      <button
        type='button'
        id='reset-form-button'
        aria-label='reset-form-button'
        className='group top-1 left-1 text-lg absolute active:brightness-50 hover:text-red-400 hover:cursor-pointer transition-all'
        onClick={() => {
          if (!generatingPlan) {
            // resets the form and the plan form data states
            setPlanType('');
            setDietFormData(dietFormRawData);
            setWorkoutFormData(workoutFormRawData);
          }
        }}
      >
        <RiResetLeftLine />
        <div
          id='reset-form-caption'
          className='absolute text-white whitespace-nowrap left-1/2 -translate-x-1/2 -bottom-6 bg-neutral-700 rounded-lg px-2 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
        >
          Reset form
        </div>
      </button>
      <button
        type='button'
        id='close-form-button'
        aria-label='close-form-button'
        className='top-1 right-1 text-lg absolute active:text-red-500 hover:brightness-50 hover:cursor-pointer transition-all'
        onClick={() => {
          if (!generatingPlan) setIsSuggest(false);
        }}
      >
        <IoMdClose />
      </button>
      <button
        id='go-left-button'
        aria-label='go-left-button'
        type='button'
        className={`
          text-3xl rounded-md border-1 mr-2 transition-all
          ${sectionIndex === 0 ? 'text-neutral-500' : 'text-red-500 hover:cursor-pointer hover:brightness-70 active:text-white  active:scale-105'}
        `}
        onClick={() => {
          if (!generatingPlan) {
            if (sectionIndex !== 0) setSectionIndex((prev) => prev - 1);
            setInputError(false);
            setMissingValues([]);
          }
        }}
      >
        <GoTriangleLeft />
      </button>
      <SectionContent
        currentSection={planType === 'diet' ? sections_diet[sectionIndex] : sections_workout[sectionIndex]}
        setSectionIndex={setSectionIndex}
        formData={planType === 'diet' ? dietFormData as dietFormDataType : workoutFormData as workoutFormDataType}
        setFormData={
          planType === 'diet'
          ? setDietFormData as React.Dispatch<SetStateAction<dietFormDataType>>
          : setWorkoutFormData as React.Dispatch<SetStateAction<workoutFormDataType>>
        }
        inputError={inputError}
        setInputError={setInputError}
        missingValues={missingValues}
        generatingPlan={generatingPlan}
        setAllowance={setAllowance}
      />
      <button
        id='go-right-button'
        aria-label='go-right-button'
        type='button'
        className={`
          text-3xl rounded-md border-1 transition-all ml-2
          ${sectionIndex === currentSection.length - 1 || !allowance ? 'text-neutral-500' : 'text-red-500 hover:cursor-pointer hover:brightness-70 active:text-white active:scale-105'}
        `}
        onClick={() => {
          if (!generatingPlan) {
            if (allowance) {
              if (sectionIndex !== sections_diet.length - 1)
                setSectionIndex((prev) => prev + 1);
              setInputError(false);
              setMissingValues([]);
            }
          }
        }}
      >
        <GoTriangleRight />
      </button>
    </div>
  );
}

function SectionContent({
  currentSection,
  setSectionIndex,
  formData,
  setFormData,
  inputError,
  setInputError,
  missingValues,
  generatingPlan,
  setAllowance,
}: {
  currentSection: sectionType;
  setSectionIndex: React.Dispatch<SetStateAction<number>>;
  formData: workoutFormDataType | dietFormDataType;
  setFormData: React.Dispatch<SetStateAction<dietFormDataType>> | React.Dispatch<SetStateAction<workoutFormDataType>>;
  inputError: boolean;
  setInputError: React.Dispatch<SetStateAction<boolean>>;
  missingValues: string[];
  generatingPlan: boolean;
  setAllowance: React.Dispatch<SetStateAction<boolean>>;
}) {
  // shortening the prop getter
  const prop = currentSection.prop;

  // handles the dieraty restrictions
  const isArray = prop === 'dietary_restrictions';
  const [arrayOfRestrictions, setArrayOfRestrictions] = useState<
    { id: string; restriction: string }[] | []
  >((formData as dietFormDataType).dietary_restrictions);
  const [restriction, setRestriction] = useState<string>('');
  const [wiggle, setWiggle] = useState<boolean>(false); // used to persist the wiggle animation across consecutive wrong submissions
  const errorRef = useRef<HTMLDivElement | null>(null);
  const missingRef = useRef<HTMLDivElement | null>(null);

  // adds one more restriction to the array
  function handleRestriction(value: string) {
    if (!value.length) return; // if the user tries to submit a blank string
    const restrictionId = uniqueId();
    const newRestriction = {
      id: restrictionId,
      restriction: value.toLowerCase(),
    };
    const updatedArray = [...arrayOfRestrictions, newRestriction];
    setArrayOfRestrictions(updatedArray);
    setFormData((prev: any) => ({ ...prev, [prop]: updatedArray }));
    setRestriction('');
  }

  // removes one restriction from the array
  function handleRemoveRestriction(id: string) {
    const updatedArray = arrayOfRestrictions.filter((x) => x.id !== id);
    setFormData((prev: any) => ({ ...prev, [prop]: updatedArray }));
    setArrayOfRestrictions(updatedArray);
  }

  function handleInput(
    e: React.ChangeEvent<HTMLInputElement>,
    regex: RegExp | null
  ) {
    const value = e.target.value;
    const validator = regex;
    setFormData((prev: any) => ({ ...prev, [prop]: value.trim() })); // updating the form data as user types
    if (validator && validator.test(String(value))) {
      setAllowance(true);
    } else setAllowance(false);
  }

  function handleTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormData((prev: any) => ({ ...prev, [prop]: e.target.value.trim() })); // updating the form data as user types
  }

  function handleButtonSelection(name: string) {
    setFormData((prev: any) => ({ ...prev, [prop]: name.toLowerCase() })); // updating the form data as user selects an option
    setSectionIndex((prev) => prev + 1);
    setInputError(false);
  }

  function handleNext(input: {
    regex?: RegExp;
    style?: string;
    label?: string;
    id: string;
    placeholder: string;
  }) {
    const validator = input.regex || null;
    const value = formData[prop as keyof (dietFormDataType | workoutFormDataType)];

    if (validator && validator.test(String(value))) {
      setSectionIndex((prev) => prev + 1);
      setInputError(false);
    } else {
      setWiggle(!wiggle); // forces useEffect to trigger
      setInputError(true);
    }
  }

  useEffect(() => {
    if (!errorRef.current) return;
    const el = errorRef.current;
    // remove animation class
    el.classList.remove(styles.wiggle_input);
    void el.offsetWidth; // force reflow
    // add animation class again
    el.classList.add(styles.wiggle_input);
  }, [wiggle]);

  useEffect(() => {
    if (!missingRef.current) return;
    const el = missingRef.current;
    // remove animation class
    el.classList.remove(styles.wiggle_input);
    void el.offsetWidth; // force reflow
    // add animation class again
    el.classList.add(styles.wiggle_input);
  }, [wiggle]);

  useEffect(() => {
    // watches for what section the form is in so it toggles the allowance to move forward
    const regex = currentSection.inputs ? currentSection.inputs[0].regex : undefined;
    if (prop === 'dietary_restrictions' || prop === 'daily_caloric_intake' || prop === 'user_notes')
      setAllowance(true);
    else if (
      // if the user goes back on the form, we validate the value against its regex again
      regex?.test(formData[prop as keyof (dietFormDataType | workoutFormDataType)] as string)
    )
      setAllowance(true);
    else setAllowance(false);
  }, [prop]);

  return generatingPlan ? (
    <div
      id='generating-plan-wrapper'
      className='flex flex-col justify-center items-center py-15'
    >
      <AiOutlineLoading3Quarters className={`${animations.loading} text-4xl`} />
      <h1 id='generating-header' className='mt-3'>
        Generating...
      </h1>
    </div>
  ) : (
    <div className='w-3/4' id='section-content-wrapper'>
      <h3
        id='section-header'
        aria-label='section-header'
        className={`${orbitron.className} text-center`}
        style={{ letterSpacing: '0.1rem' }}
      >
        {currentSection.title}
      </h3>

      {currentSection.desc && (
        <p
          id='description-container'
          className='text-neutral-300 text-center text-sm my-6'
        >
          {currentSection.desc}
        </p>
      )}

      {currentSection.buttons && (
        <div
          id='buttons-container'
          className='my-6 flex flex-col items-center justify-center'
        >
          {currentSection.buttons.map((button) =>
            prop === 'generate' ? (
              <button
                key={prop}
                type='submit'
                onClick={() => setWiggle(!wiggle)}
                className={`
                  bg-[linear-gradient(45deg,#525252_50%,#737373)] border-neutral-500 
                  flex items-center justify-center text-lg text-neutral-200 shadow-md 
                  rounded-lg px-2 border-1 w-full transition-all duration-200  
                  hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500
                `}
              >
                Generate
              </button>
            ) : (
              <button
                className={`
                  ${
                    formData[prop as keyof (dietFormDataType | workoutFormDataType)] ===
                    button.name.toLowerCase()
                      ? 'bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-red-300 hover:text-black hover:border-black'
                      : 'bg-[linear-gradient(45deg,#525252_50%,#737373)] border-neutral-500 hover:text-red-500 hover:border-red-500'
                  }
                  ${currentSection.buttons && currentSection.buttons.length > 1 && 'mb-3'}
                  flex items-center justify-center text-lg text-neutral-200 shadow-md 
                  rounded-lg px-2 border-1 w-full transition-all duration-200  
                  hover:cursor-pointer hover:scale-105 
                `}
                key={button.id}
                id={button.id}
                aria-label={button.id}
                type='button'
                onClick={() => handleButtonSelection(button.name)}
              >
                {button.name}
                {button.icon && button.icon}
              </button>
            )
          )}
        </div>
      )}

      {currentSection.textareas &&
        currentSection.textareas.map(txtarea => (
          <div
            id='textareas-container'
            key={txtarea.id}
            className='flex flex-col items-center justify-center'
          >
            <label htmlFor={txtarea.id}>{txtarea.label}</label>
            <textarea
              id={txtarea.id}
              placeholder={txtarea.placeholder}
              onChange={(e) =>
                handleTextarea(e)
              }
              className={`${txtarea.style} ${scrollbars.scrollbar_chat} resize-none w-full focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800`}
              rows={5}
              autoFocus
            ></textarea>
          </div>
        ))}

      {currentSection.inputs &&
        currentSection.inputs.map((input) => (
          <div
            id='inputs-container'
            key={input.id}
            className='flex flex-col items-center justify-center'
          >
            <label htmlFor={input.id}>{input.label}</label>
            {isArray ? (
              <input
                value={restriction}
                onChange={(e) => setRestriction(e.target.value)}
                type='text'
                id={input.id}
                aria-label={input.id}
                placeholder={input.placeholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleRestriction(restriction);
                  }
                }}
                className={`${input.style} focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800`}
                autoFocus
              />
            ) : (
              <input
                value={
                  // if the selection match any button name, don't pre-fill the input
                  currentSection.buttons?.some(
                    (btn) =>
                      btn.name.toLowerCase() ===
                      formData[prop as keyof (dietFormDataType | workoutFormDataType)]
                  )
                    ? ''
                    : String(formData[prop as keyof (dietFormDataType | workoutFormDataType)])
                }
                type='text'
                id={input.id}
                aria-label={input.id}
                placeholder={input.placeholder}
                onChange={(e) =>
                  handleInput(e, input.regex ? input.regex : null)
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNext(input);
                  }
                }}
                className={`${input.style} focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800`}
                autoFocus={!currentSection.buttons ? true : false}
              />
            )}
            {input.error && inputError && (
              <div
                ref={errorRef}
                id='input-error-container'
                aria-label='input-error-container'
                className={`
                  rounded-lg px-2 bg-red-500 mt-3 text-center
                  ${wiggle && styles.wiggle_input}
                `}
              >
                {input.error}
              </div>
            )}
          </div>
        ))}

      {isArray && arrayOfRestrictions && arrayOfRestrictions.length > 0 && (
        <div
          id='diet-restriction-container'
          className='max-h-40 overflow-y-auto overflow-x-hidden bg-[linear-gradient(45deg,#525252_50%,#656565)] rounded-lg border-1 border-neutral-500 flex flex-wrap gap-2 p-2 mt-3'
        >
          {arrayOfRestrictions?.map((obj) => {
            return (
              <div
                key={obj.id}
                className='flex items-center justify-between rounded-lg bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 text-center px-2 w-fit'
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
      )}

      {missingValues && missingValues.length > 0 && (
        <div
          ref={missingRef}
          id='missing-values-error-container'
          aria-label='missing-values-error-container'
          className={`
            bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300
            rounded-lg px-2 mt-3 text-center overflow-y-auto overflow-x-hidden max-h-40
            ${wiggle && styles.wiggle_input} ${scrollbars.missing_values_scrollbar}
          `}
        >
          <h1
            id='missing-fields-header'
            aria-label='missing-fields-header'
            className='text-2xl text-neutral-800 mb-3'
          >
            Missing fields:
          </h1>
          {missingValues.map((value, i) => {
            const formatted =
              value === 'goal'
                ? 'Goal'
                : value === 'gender'
                  ? 'Gender'
                  : value === 'current_weight'
                    ? 'Current Weight'
                    : value === 'height'
                      ? 'Height'
                      : value === 'age'
                        ? 'Age'
                        : value === 'activity_level'
                          ? 'Activity Level'
                          : value === 'number_of_meals'
                            ? 'Number of Meals'
                            : value === 'meal_timing'
                              ? 'Meal Timing'
                              : value === 'duration_weeks'
                                ? 'Duration in Weeks'
                                : value === 'want_supplements'
                                  ? 'Supplements'
                                  : value === 'daily_caloric_intake'
                                    ? 'Daily Caloric Intake'
                                    : '';
            return (
              <p
                key={value}
                id='missing-value'
                aria-label='missing-value'
                className='text-center'
              >
                &bull; {formatted} {i === missingValues.length - 1 ? '.' : ';'}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
