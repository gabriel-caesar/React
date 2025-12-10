'use client';

import { dietPlanType, workoutPlanType } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import Link from 'next/link';
import { FaCog, FaDumbbell } from 'react-icons/fa';
import {
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircleOutline,
} from 'react-icons/io';
import PlanTypeToggler from './plan-type-toggler';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import animations from '../../../css/animations.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaBowlFood } from 'react-icons/fa6';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function PlansCard({
  dietPlans,
  workoutPlans,
}: {
  dietPlans: dietPlanType[];
  workoutPlans: workoutPlanType[];
}) {
  const plans = ['diet', 'workout']; // used for the plan toggler
  const [planToggler, setPlanToggler] = useState<string>('diet');
  const areYouSureRef = useRef<HTMLDivElement | null>(null);
  const [areYouSure, setAreYouSure] = useState<boolean>(false);
  const [planInfoToDelete, setPlanInfoToDelete] = useState<{
    id: string;
    type: string;
  }>({ id: '', type: '' });
  
  const [utilityLoader, setUtilityLoader] = useState<boolean>(false);
  const router = useRouter();

  async function handleDelete() {
    setUtilityLoader(true);
    const planTable =
      planInfoToDelete.type === 'diet' ? 'diet_plans' : 'workout_plans';
    try {
      const call = await fetch(`/api/plans/delete-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: planInfoToDelete.id,
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
      id='plans-card-container'
      className='
        flex flex-col items-center justify-start rounded-md border-1 border-neutral-400
        bg-[linear-gradient(45deg,#525252_50%,#737373)] p-2 w-full lg:w-3/4 relative
      '
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
          className='border border-neutral-500 fixed top-1/4 z-10 left-1/2 -translate-x-1/2 p-6 rounded-lg bg-neutral-800 shadow-lg text-[16px] flex flex-col justify-center items-center w-11/12 md:w-[550px]'
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

      <h1
        id='plans-header'
        aria-label='plans-header'
        className={`${orbitron.className} text-xl text-center my-2`}
        style={{
          letterSpacing: '0.3rem',
        }}
      >
        Your Plans
      </h1>

      <div
        id='toggler-container'
        className='rounded-lg shadow-lg bg-neutral-800 border-neutral-500 border p-2 mt-4 w-[200px] mx-auto flex justify-around items-center'
      >
        {plans.map((plan) => {
          return (
            <PlanTypeToggler
              toggler={planToggler}
              setToggler={setPlanToggler}
              name={plan}
              key={plan}
            />
          );
        })}
      </div>

      <h3
        id='plan-type-header'
        aria-label='plan-type-header'
        className='my-4 text-neutral-400'
      >
        Currently viewing{' '}
        <span className='text-red-400/70'>
          {planToggler === 'diet' ? 'diet' : 'workout'}
        </span>{' '}
        plans
      </h3>

      <table
        id='plans-table-table'
        aria-label='plans-table-table'
        className={`
          ${
            (workoutPlans.length <= 0 && planToggler === 'workout' || 
              dietPlans.length == 0 && planToggler === 'diet') && 
              'hidden'
          } 
          w-full table-auto rounded-lg bg-[linear-gradient(45deg,#1a1a1a_50%,#606060)] shadow-2xl overflow-hidden
        `}
      >
        <thead className='bg-neutral-700 rounded-t-lg'>
          <tr>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-r-1 border-neutral-500 p-2`}
            >
              Goal
            </th>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-r-1 border-neutral-500 hidden md:table-cell`}
            >
              {planToggler === 'diet' ? 'Meals' : 'Exercises'}
            </th>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-r-1 border-neutral-500 hidden md:table-cell`}
            >
              Created on
            </th>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-r-1 border-neutral-500 hidden md:table-cell`}
            >
              Last Edited
            </th>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-r-1 border-neutral-500 sm`}
            >
              Default
            </th>
            <th
              className={`${dietPlans.length > 0 && 'border-b-1'} text-center px-2 border-neutral-500`}
            >
              <div className='flex justify-center items-center w-full h-full'>
                <FaCog className='text-xl' />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {dietPlans.length > 0 && planToggler === 'diet'
            ? dietPlans.map((plan) => {
                const lastEditDate = new Date(plan.last_edit_date + ' UTC');
                const lastEditDateFiltered = lastEditDate.toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).split(',').join(' at');

                const createdDate = new Date(plan.created_date + ' UTC');
                const createdDateFiltered = createdDate.toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).split(',').join(' at');
                return (
                  <tr key={plan.id}>
                    <td className='text-center border-r-1 border-neutral-500 p-2'>
                      {plan.goal
                        .split('')
                        .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                        .join('')}
                    </td>
                    <td
                      className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'
                      key={plan.number_of_meals}
                    >
                      {plan.number_of_meals}
                    </td>
                    <td className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'>
                      {createdDateFiltered}
                    </td>
                    <td className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'>
                      {lastEditDateFiltered}
                    </td>
                    <td className='text-center align-middle text-xl p-2'>
                      <div className='flex justify-center items-center w-full h-full'>
                        {plan.default_plan ? (
                          <IoMdCheckmarkCircleOutline className='text-green-500' />
                        ) : (
                          <IoMdCloseCircleOutline />
                        )}
                      </div>
                    </td>
                    <td className='border-neutral-500 border-l-1 p-2'>
                      <div
                        id='buttons-container'
                        className='flex items-center justify-center'
                      >
                        <Link
                          href={`/dashboard/plans/${plan.id}`}
                          id='view-plan-button'
                          aria-label='view-plan-button'
                          type='button'
                          className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500 mr-2'
                        >
                          View
                        </Link>
                        <button
                          id='delete-plan-button'
                          aria-label='delete-plan-button'
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlanInfoToDelete({ id: plan.id, type: 'diet' });
                            setAreYouSure(true);
                          }}
                          className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            : workoutPlans.length > 0 &&
              workoutPlans.map((plan) => {

                const lastEditDate = new Date(plan.last_edit_date + ' UTC');
                const lastEditDateFiltered = lastEditDate.toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).split(',').join(' at');

                const createdDate = new Date(plan.created_date + ' UTC');
                const createdDateFiltered = createdDate.toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }).split(',').join(' at');

                return (
                  <tr key={plan.id} className=''>
                    <td className='text-center border-r-1 border-neutral-500 p-2'>
                      {plan.goal
                        .split('')
                        .map((l, i) => (i === 0 ? l.toUpperCase() : l))
                        .join('')}
                    </td>
                    <td
                      className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'
                      key={plan.weekly_totals.total_exercises}
                    >
                      {plan.weekly_totals.total_exercises}
                    </td>
                    <td className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'>
                      {createdDateFiltered}
                    </td>
                    <td className='text-center border-r-1 border-neutral-500 hidden md:table-cell p-2'>
                      {lastEditDateFiltered}
                    </td>
                    <td className='text-center align-middle text-xl p-2'>
                      <div className='flex justify-center items-center w-full h-full'>
                        {plan.default_plan ? (
                          <IoMdCheckmarkCircleOutline className='text-green-500' />
                        ) : (
                          <IoMdCloseCircleOutline />
                        )}
                      </div>
                    </td>
                    <td className='border-neutral-500 border-l-1 p-2'>
                      <div
                        id='buttons-container'
                        className='flex items-center justify-center'
                      >
                        <Link
                          href={`/dashboard/plans/${plan.id}`}
                          id='view-plan-button'
                          aria-label='view-plan-button'
                          type='button'
                          className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500 mr-2'
                        >
                          View
                        </Link>
                        <button
                          id='delete-plan-button'
                          aria-label='delete-plan-button'
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlanInfoToDelete({
                              id: plan.id,
                              type: 'workout',
                            });
                            setAreYouSure(true);
                          }}
                          className='text-sm rounded-lg py-1 px-2 bg-transparent hover:bg-neutral-700 hover:text-red-400 hover:cursor-pointer active:scale-95 transition-all border-1 border-neutral-500'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
        </tbody>
      </table>

      {dietPlans.length === 0 && planToggler === 'diet' ? (
        <div
          id='no-diet-plans-added-container'
          className='w-full flex flex-col justify-center items-center mt-3'
        >
          <h3 className='text-xl text-center'>No diet plans added yet</h3>
          <FaBowlFood className='text-neutral-400 text-6xl my-4' />
          <p className='text-neutral-400 text-center'>
            To add a plan go to the{' '}
            <a
              href='/dashboard'
              className='underline text-red-400/70 hover:text-red-400 hover:cursor-pointer transition-all'
            >
              dashboard
            </a>{' '}
            talk with Diversus and fill the plan form
          </p>
        </div>
      ) : workoutPlans.length === 0 && planToggler === 'workout' && (
        <div
          id='no-workout-plans-added-container'
          className='w-full flex flex-col justify-center items-center mt-3'
        >
          <h3 className='text-xl text-center'>No workout plans added yet</h3>
          <FaDumbbell className='text-neutral-400 text-6xl my-4' />
          <p className='text-neutral-400 text-center'>
            To add a plan go to the{' '}
            <a
              href='/dashboard'
              className='underline text-red-400/70 hover:text-red-400 hover:cursor-pointer transition-all'
            >
              dashboard,
            </a>{' '}
            talk with Diversus and fill the plan form
          </p>
        </div>
      )}
    </div>
  );
}
