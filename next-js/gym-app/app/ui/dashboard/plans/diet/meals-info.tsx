'use client';

import { dietPlanType } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';
import { SetStateAction } from 'react';
import { TbSeparator } from 'react-icons/tb';
import { motion } from 'framer-motion';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function MealsInfo({
  dietPlan,
  editing,
  setEditing,
}: {
  dietPlan: dietPlanType;
  editing: boolean;
  setEditing: React.Dispatch<SetStateAction<boolean>>;
}) {
  const meals = dietPlan.meals;

  return (
    <div id='meals-info-container'>
      <h1
        id='meals-info-header'
        aria-label='meals-info-header'
        className={`${orbitron.className} text-xl w-full text-center`}
        style={{ letterSpacing: '0.1rem' }}
      >
        Meals Information
      </h1>

      <div id='sections-content-wrapper' className='mt-4'>
        {meals.length > 0 ? (
          meals.map((meal, i) => {
            return (
              <div
                id='meal-container'
                key={meal.meal_name}
                className={`${i !== meals.length - 1 && 'mb-4'}`}
              >
                <div
                  id='meal-name-time-container'
                  className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2'
                >
                  <h2
                    id='meal-time-header'
                    aria-label='meal-time-header'
                    className='text-xl'
                  >
                    {meal.meal_time}
                  </h2>
                  <TbSeparator className='mx-2 text-red-400' />
                  <h1
                    id='meal-name-header'
                    aria-label='meal-name-header'
                    className='text-xl'
                  >
                    {meal.meal_name}
                  </h1>
                </div>
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  id='meal-items-container'
                  className='rounded-lg bg-neutral-800 shadow-lg p-2 md:grid md:grid-cols-2 md:gap-2'
                >
                  {meal.items.length > 0 ? (
                    meal.items.map((item, i) => {
                      return (
                        <motion.li
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: i / 10 + 0.2 }}
                          key={item.name}
                          className={`
                            text-[16px] mb-4 border-b-1 pb-2
                            md:rounded-lg md:shadow-lg md:border-1 md:p-2 md:bg-neutral-700 w-full h-full border-neutral-500
                          `}
                          id='meal-item-text'
                          aria-label='meal-item-text'
                        >
                          <h3
                            id='item-name-header'
                            aria-label='item-name-header'
                            className='text-lg mb-2'
                          >
                            {`${i + 1}. ${item.name}`}
                          </h3>
                          <p
                            id='item-weight-text'
                            aria-label='item-weight-text'
                            className='text-neutral-400'
                          >
                            Weight: {item.weight_g}g
                          </p>
                          <p
                            id='item-protein-text'
                            aria-label='item-protein-text'
                            className='text-neutral-400'
                          >
                            Protein: {item.protein_g}g
                          </p>
                          <p
                            id='item-carbs-text'
                            aria-label='item-carbs-text'
                            className='text-neutral-400'
                          >
                            Carbs: {item.carbs_g}g
                          </p>
                          <p
                            id='item-fats-text'
                            aria-label='item-fats-text'
                            className='text-neutral-400'
                          >
                            Fats: {item.fats_g}g
                          </p>
                          <p
                            id='item-calories-text'
                            aria-label='item-calories-text'
                            className='text-red-400'
                          >
                            Calories: {item.calories}cal
                          </p>
                        </motion.li>
                      );
                    })
                  ) : (
                    <li className='text-center text-neutral-400 text-[16px]'>
                      No items available
                    </li>
                  )}
                  <div id='meal-totals-wrapper' className='md:col-1'>
                    <h3
                      id='meal-totals-header'
                      aria-label='meal-totals-header'
                      className={`text-[18px] mt-4 text-start w-full`}
                    >
                      Meal totals
                    </h3>

                    <table
                      id='meal-totals-table'
                      aria-label='meal-totals-table'
                      className='text-[16px] table-auto mt-2 overflow-hidden rounded-lg bg-neutral-600 w-full shadow-md'
                    >
                      <thead>
                        <tr>
                          <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-400'>
                            Calories
                          </th>
                          <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-400'>
                            Carbs
                          </th>
                          <th className='p-2 text-center border-b-1 border-r-1 text-red-400 border-neutral-400'>
                            Fats
                          </th>
                          <th className='p-2 text-center border-b-1 md:border-r-1 text-red-400 border-neutral-400'>
                            Protein
                          </th>
                          <th className='p-2 text-center border-b-1 text-red-400 border-neutral-400 hidden md:table-cell'>
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='p-2 text-center border-r-1 border-neutral-400'>
                            {meal.meal_totals.calories}cal
                          </td>
                          <td className='p-2 text-center border-r-1 border-neutral-400'>
                            {meal.meal_totals.carbs_g}g
                          </td>
                          <td className='p-2 text-center border-r-1 border-neutral-400'>
                            {meal.meal_totals.fats_g}g
                          </td>
                          <td className='p-2 text-center md:border-r-1 border-neutral-400'>
                            {meal.meal_totals.protein_g}g
                          </td>
                          <td className='p-2 text-center hidden md:table-cell'>
                            {meal.meal_totals.weight_g}g
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.ul>
              </div>
            );
          })
        ) : (
          <p className='text-center text-neutral-400 text-[16px]'>
            No meals were created
          </p>
        )}
      </div>
    </div>
  );
}
