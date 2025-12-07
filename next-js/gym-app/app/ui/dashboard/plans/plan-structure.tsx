'use client';

import { dietPlanType, workoutPlanType } from '@/app/lib/definitions';
import { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import SectionTogglerButton from './section-toggler-button';
import DietGeneralInfo from './diet/general-info';
import DietDetailsInfo from './diet/details-info';
import MealsInfo from './diet/meals-info';
import WorkoutGeneralInfo from './workout/general-info';
import { WorkoutDetailsInfo } from './workout/details-info';
import ExercisesInfo from './workout/exercises-info';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import animations from '../../../css/animations.module.css';
import { useRouter } from 'next/navigation';

export default function PlanStructure({
  dietPlan,
  workoutPlan,
}: {
  dietPlan: dietPlanType;
  workoutPlan: workoutPlanType;
}) {
  const [openThreeDotsMenu, setOpenThreeDotsMenu] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [toggler, setToggler] = useState<string>('general');
  const [utilityLoader, setUtilityLoader] = useState<boolean>(false);
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const editButtonRef = useRef<HTMLButtonElement | null>(null);
  const areYouSureRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const planBeingDisplayed = dietPlan ? dietPlan : workoutPlan; // figuring out which plan is being asked for
  const dietSections = ['general', 'meal', 'detail']; // used for the diet plan section toggler
  const workoutSections = ['general', 'exercises', 'detail']; // used for the workout plan section toggler

  async function handleDelete() {
    setUtilityLoader(true);
    const planTable =
      planBeingDisplayed === dietPlan ? 'diet_plans' : 'workout_plans';
    try {
      const call = await fetch(`/api/plans/delete-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planBeingDisplayed.id,
          type: planTable,
        }),
      });

      const response = await call.json();
      if (response.success) router.push('/dashboard/plans');
    } catch (error) {
      throw new Error(
        `Couldn't start plan deletion through front-end. ${error}`
      );
    } finally {
      setUtilityLoader(false);
      setAreYouSure(false);
    }
  }

  async function handleSetDefault() {
    setUtilityLoader(true);
    const planTable =
      planBeingDisplayed === dietPlan ? 'diet_plans' : 'workout_plans';
    try {
      await fetch(`/api/plans/set-default`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planBeingDisplayed.id,
          type: planTable,
        }),
      });
    } catch (error) {
      throw new Error(
        `Couldn't set plan as default through front-end. ${error}`
      );
    } finally {
      setUtilityLoader(false);
    }
  }

  // if the user clicks out of the three dots button, close it
  useEffect(() => {
    const handleClickOff = (e: MouseEvent) => {
      if (
        editButtonRef.current &&
        !editButtonRef.current.contains(e.target as Node)
      ) {
        setOpenThreeDotsMenu(false);
      }
    };

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    };
  }, [openThreeDotsMenu]);

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
      className='
        md:w-3/4 xl:w-1/2
        border-1 border-neutral-400 relative
        text-2xl w-full p-2 rounded-lg bg-[linear-gradient(45deg,#525252_50%,#737373)]
      '
      id='plan-structure-wrapper'
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
          className='border border-neutral-500 fixed top-1/4 z-10 left-1/2 -translate-x-1/2 p-6 rounded-lg bg-neutral-800 shadow-lg text-[16px] flex flex-col justify-center items-center'
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
                <span className='text-red-400'>delete</span> this plan?
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

      <div id='three-dots-menu-container' className='absolute top-2 right-2'>
        <button
          ref={editButtonRef}
          id='three-dots-menu-button'
          aria-label='three-dots-menu-button'
          className={`
            ${openThreeDotsMenu && 'bg-neutral-800'}
            border border-transparent rounded-lg p-1 text-lg transition-all duration-300
            hover:cursor-pointer hover:scale-105 hover:border-neutral-800 hover:bg-neutral-700 active:scale-95
          `}
          onClick={() => setOpenThreeDotsMenu(!openThreeDotsMenu)}
        >
          <BsThreeDots />
        </button>

        <div
          id='utility-buttons-container'
          className={`
            absolute right-0 top-full transition-all 
            ${!planBeingDisplayed.default_plan && 'w-31'} flex flex-col justify-start items-end
            rounded-lg p-2 bg-neutral-800 text-[16px] shadow-md
            ${openThreeDotsMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}  
          `}
        >
          {utilityLoader ? (
            <div className='py-2 flex flex-col w-full h-full justify-center items-center'>
              <AiOutlineLoading3Quarters
                className={`${animations.loading} text-2xl`}
              />
              <h1 id='generating-header' className='mt-3'>
                Loading...
              </h1>
            </div>
          ) : (
            <>
              <button
                id='edit-button'
                aria-label='edit-button'
                className={`
              transition-all active:scale-95 hover:bg-neutral-600 rounded-lg p-1 mb-1
              text-center hover:text-red-400 hover:cursor-pointer hover:scale-105
            ${openThreeDotsMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}  
          `}
                onClick={() => {
                  setEditing(!editing);
                  setOpenThreeDotsMenu(false);
                }}
              >
                Edit
              </button>
              <button
                id='delete-button'
                aria-label='delete-button'
                className={`
              transition-all active:scale-95 hover:bg-neutral-600 rounded-lg p-1 mb-1
              text-center hover:text-red-400 hover:cursor-pointer hover:scale-105
            ${openThreeDotsMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}  
          `}
                onClick={(e) => {
                  e.stopPropagation();
                  setAreYouSure(true);
                }}
              >
                Delete
              </button>
              {!planBeingDisplayed.default_plan && (
                <button
                  id='set-default-button'
                  aria-label='set-default-button'
                  className={`
                transition-all active:scale-95 hover:bg-neutral-600 rounded-lg p-1
                text-center hover:text-red-400 hover:cursor-pointer hover:scale-105
              ${openThreeDotsMenu ? 'opacity-100' : 'opacity-0 pointer-events-none'}  
            `}
                  onClick={() => handleSetDefault()}
                >
                  Set as default
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div
        id='logo-wrapper'
        className='w-full flex justify-center items-center'
      >
        <img
          src='/logo_clean_white.png'
          alt='brand_logo'
          className='w-40 h-40 object-cover border-3 shadow-2xl rounded-full'
        />
      </div>

      <div
        id='info-toggler-container'
        className='rounded-lg shadow-lg bg-neutral-800 border-neutral-500 border p-2 my-4 w-[200px] mx-auto flex justify-around items-center'
      >
        {planBeingDisplayed === dietPlan
          ? dietSections.map((s) => {
              return (
                <SectionTogglerButton
                  toggler={toggler}
                  setToggler={setToggler}
                  name={s}
                  key={s}
                />
              );
            })
          : workoutSections.map((s) => {
              return (
                <SectionTogglerButton
                  toggler={toggler}
                  setToggler={setToggler}
                  name={s}
                  key={s}
                />
              );
            })}
      </div>

      {planBeingDisplayed === dietPlan ? (
        toggler === 'general' ? (
          <DietGeneralInfo
            dietPlan={dietPlan}
            editing={editing}
            setEditing={setEditing}
          />
        ) : toggler === 'meal' ? (
          <MealsInfo
            dietPlan={dietPlan}
            editing={editing}
            setEditing={setEditing}
          />
        ) : (
          <DietDetailsInfo
            dietPlan={dietPlan}
            editing={editing}
            setEditing={setEditing}
          />
        )
      ) : toggler === 'general' ? (
        <WorkoutGeneralInfo
          workoutPlan={workoutPlan}
          editing={editing}
          setEditing={setEditing}
        />
      ) : toggler === 'exercises' ? (
        <ExercisesInfo
          workoutPlan={workoutPlan}
          editing={editing}
          setEditing={setEditing}
        />
      ) : (
        <WorkoutDetailsInfo
          workoutPlan={workoutPlan}
          editing={editing}
          setEditing={setEditing}
        />
      )}
    </div>
  );
}
