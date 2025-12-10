'use server'

import { dietPlanType, workoutPlanType } from '@/app/lib/definitions';
import { dietFormDataType, dietFormRawData } from '@/public/plan_metadata/diet-formdata';
import { workoutFormDataType } from '@/public/plan_metadata/workout-formdata';
import { unsavePlanFromMessage } from './chat';
import postgres from 'postgres';
import { dietGeneralInfo, workoutGeneralInfo } from './schemas';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function savePlan(formData: dietFormDataType | workoutFormDataType, isDiet: boolean, userId: string) {
  const date: string = new Date().toLocaleString('sv-SE');
  try {

    const defaultPlan = isDiet ? await sql<dietPlanType[]>`
      SELECT * FROM diet_plans
      WHERE default_plan = TRUE;
    ` : await sql<workoutFormDataType[]>`
      SELECT * FROM workout_plans
      WHERE default_plan = TRUE;
    `
    if (isDiet) {
      await sql`
        INSERT INTO diet_plans
        (
          id,
          created_date,
          last_edit_date,
          goal,
          user_id,
          plan_type,
          gender,
          current_weight,
          height,
          activity_level,
          number_of_meals,
          meal_timing_hours,
          duration_weeks,
          want_supplements,
          daily_caloric_intake,
          dietary_restrictions,
          meals,
          daily_totals,
          weekly_summary,
          hydration,
          supplements,
          general_notes,
          age,
          default_plan,
          user_notes
        )
        VALUES
        (
          ${(formData as dietFormDataType).id},
          ${date},
          ${date},
          ${(formData as dietFormDataType).goal},
          ${userId},
          ${(formData as dietFormDataType).plan_type},
          ${(formData as dietFormDataType).gender},
          ${(formData as dietFormDataType).current_weight},
          ${(formData as dietFormDataType).height},
          ${(formData as dietFormDataType).activity_level},
          ${(formData as dietFormDataType).number_of_meals},
          ${(formData as dietFormDataType).meal_timing_hours},
          ${(formData as dietFormDataType).duration_weeks},
          ${(formData as dietFormDataType).want_supplements},
          ${(formData as dietFormDataType).daily_caloric_intake},
          ${sql.json((formData as dietFormDataType).dietary_restrictions)},
          ${sql.json((formData as dietFormDataType).meals)},
          ${sql.json((formData as dietFormDataType).daily_totals)},
          ${sql.json((formData as dietFormDataType).weekly_summary)},
          ${sql.json((formData as dietFormDataType).hydration)},
          ${sql.json((formData as dietFormDataType).supplements)},
          ${(formData as dietFormDataType).general_notes},
          ${(formData as dietFormDataType).age},
          ${defaultPlan[0] ? false : true},
          ${(formData as dietFormDataType).user_notes}
        );
      `
    } else {
      await sql`
        INSERT INTO workout_plans
        (
          id,
          created_date,
          last_edit_date,
          goal,
          user_id,
          plan_type,
          gender,
          current_weight,
          height,
          experience_level,
          duration_weeks,
          number_of_workout_days,
          daily_workouts,
          weekly_totals,
          general_notes,
          age,
          default_plan,
          user_notes
        )
        VALUES
        ( 
          ${(formData as workoutFormDataType).id},
          ${date},
          ${date},
          ${(formData as workoutFormDataType).goal},
          ${userId},
          ${(formData as workoutFormDataType).plan_type},
          ${(formData as workoutFormDataType).gender},
          ${(formData as workoutFormDataType).current_weight},
          ${(formData as workoutFormDataType).height},
          ${(formData as workoutFormDataType).experience_level},
          ${(formData as workoutFormDataType).duration_weeks},
          ${(formData as workoutFormDataType).number_of_workout_days},
          ${sql.json((formData as workoutFormDataType).daily_workouts)},
          ${sql.json((formData as workoutFormDataType).weekly_totals)},
          ${(formData as workoutFormDataType).general_notes},
          ${(formData as workoutFormDataType).age},
          ${defaultPlan[0] ? false : true},
          ${(formData as workoutFormDataType).user_notes}
        );
      `
    }

  } catch (error) {
    throw new Error(`Couldn't save plan. ${error}`)
  }
}

export async function savePlanInMessage(id: string) {
  try {
    await sql`
      UPDATE messages
      SET plan_saved = TRUE
      WHERE id = ${id}
    `
  } catch (error) {
    throw new Error(`Couldn't save plan in the message bubble. ${error}`)
  }
}

export async function getUserDietPlans(userId: string) {
  try {
    const allPlans = await sql<dietPlanType[]>`
      SELECT * FROM diet_plans
      WHERE user_id = ${userId}
    `
    return allPlans
  } catch (error) {
    throw new Error(`Couldn't get user diet plans. ${error}`)
  }
}

export async function getUserWorkoutPlans(userId: string) {
  try {
    const allPlans = await sql<workoutPlanType[]>`
      SELECT * FROM workout_plans
      WHERE user_id = ${userId}
    `
    return allPlans
  } catch (error) {
    throw new Error(`Couldn't get user diet plans. ${error}`)
  }
}

export async function deletePlan(id: string, table: 'diet_plans' | 'workout_plans') {
  try {
    table === 'diet_plans' ? await sql`
      DELETE FROM diet_plans
      WHERE id = ${id};
    ` : await sql`
      DELETE FROM workout_plans
      WHERE id = ${id};
    `
    unsavePlanFromMessage(id); // unsaves the plan from the message bubble it was first saved with
  } catch (error) {
    throw new Error(`Couldn't delete plan. ${error}`)
  }
}

export async function setPlanAsDefault(id: string, table: 'diet_plans' | 'workout_plans') {
  try { 
    
    const allPlans = table === 'diet_plans' ? await sql`
      SELECT COUNT(*) FROM diet_plans WHERE default_plan = TRUE;
    ` : await sql`SELECT COUNT(*) FROM workout_plans WHERE default_plan = TRUE;`

    // if there is at least one plan set to default in the table
    if (allPlans[0].count > 0) {
      // getting the old default plan
      const oldDefaultPlanId = table === 'diet_plans' ? await sql<{ id: string }[]>`
        SELECT id FROM diet_plans
        WHERE default_plan = TRUE;
      ` : await sql<{ id: string }[]>`
        SELECT id FROM workout_plans
        WHERE default_plan = TRUE;
      `

      // removing the default from the old plan
      table === 'diet_plans' ? await sql`
        UPDATE diet_plans
        SET default_plan = FALSE
        WHERE id = ${oldDefaultPlanId[0].id};
      ` : await sql`
        UPDATE workout_plans
        SET default_plan = FALSE
        WHERE id = ${oldDefaultPlanId[0].id};
      `
      // updating the old default plan last_edit_date
      await updateLastEditDate(oldDefaultPlanId[0].id, table);
    }
    
    // adding the default to the new plan
    const plan = table === 'diet_plans' ? await sql<{ id: string }[]>`
      UPDATE diet_plans
      SET default_plan = TRUE
      WHERE id = ${id} RETURNING id;
    ` : await sql`
      UPDATE workout_plans
      SET default_plan = TRUE
      WHERE id = ${id} RETURNING id;
    `
    // updating the new default plan last_edit_date
    await updateLastEditDate(id, table);
    return plan[0].id ? plan[0].id : '' 
  } catch (error) {
    throw new Error(`Couldn't set plan as default. ${error}`)
  }
}

export async function updateLastEditDate(id: string, table: 'diet_plans' | 'workout_plans') {
  const date: string = new Date().toLocaleString('sv-SE'); // date for created_date and last_edit_date
  try { 
    table === 'diet_plans' ? await sql`
      UPDATE diet_plans
      SET last_edit_date = ${date}
      WHERE id = ${id};
    ` : await sql`
      UPDATE workout_plans
      SET last_edit_date = ${date}
      WHERE id = ${id};
    `
  } catch (error) {
    throw new Error(`Couldn't update plan last_edit_date. ${error}`)
  }
}

export async function getPlansCount(userId: string) {
  try {
    const dietPlansCount = await sql<{ count: string }[]>`
      SELECT COUNT(*) FROM diet_plans
      WHERE user_id = ${userId};
    `
    const workoutPlansCount = await sql<{ count: string }[]>`
      SELECT COUNT(*) FROM workout_plans
      WHERE user_id = ${userId};
    `

    const total = parseInt(dietPlansCount[0].count) + parseInt(workoutPlansCount[0].count);
    return total;
  } catch (error) {
    throw new Error(`Couldn't get plans count for the user. ${error}`);
  }
}

export async function editWorkoutGeneralInfo(prevState: any, formData: FormData) {
  const validatedFields = workoutGeneralInfo.safeParse(Object.fromEntries(formData.entries()));

  // if the parsing wasn't successful, return the errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    plan_id,
    goal,
    gender,
    current_weight,
    height,
    age,
    experience_level,
    number_of_workout_days,
    duration_weeks
  } = validatedFields.data;

  try {
    await sql`
      UPDATE workout_plans
      SET 
        goal = ${goal},
        gender = ${gender},
        current_weight = ${current_weight},
        height = ${height},
        age = ${age},
        experience_level = ${experience_level},
        number_of_workout_days = ${number_of_workout_days},
        duration_weeks = ${duration_weeks}
      WHERE id = ${plan_id};
    `
    updateLastEditDate(plan_id, 'workout_plans');
  } catch (error) {
    throw new Error(`Couldn't update the workout plan's general info. ${error}`)
  }

  redirect(`/dashboard/plans/${plan_id}?edit_success=true`);
}

export async function editDietGeneralInfo(prevState: any, formData: FormData) {
  const validatedFields = dietGeneralInfo.safeParse({
    ...Object.fromEntries(formData.entries()),
    dietary_restrictions: formData.getAll('dietary_restrictions')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  };

  const {
    plan_id,
    goal,
    gender,
    current_weight,
    height,
    age,
    activity_level,
    number_of_meals,
    meal_timing_hours,
    duration_weeks,
    want_supplements,
    daily_caloric_intake,
    dietary_restrictions
  } = validatedFields.data;

  try {
    await sql`
      UPDATE diet_plans
      SET
        goal = ${goal},
        gender = ${gender},
        current_weight = ${current_weight},
        height = ${height},
        age = ${age},
        activity_level = ${activity_level},
        number_of_meals = ${number_of_meals},
        meal_timing_hours = ${meal_timing_hours},
        duration_weeks = ${duration_weeks},
        want_supplements = ${want_supplements === 'yes' ? true : false},
        daily_caloric_intake = ${daily_caloric_intake},
        dietary_restrictions = ${sql.json(dietary_restrictions ?? '')}
      WHERE id = ${plan_id};
    `
    updateLastEditDate(plan_id, 'diet_plans'); // updates the edit date
  } catch (error) {
    throw new Error(`Couldn't update the diet plan's general info. ${error}`)
  }
  redirect(`/dashboard/plans/${plan_id}?edit_success=true`);
}