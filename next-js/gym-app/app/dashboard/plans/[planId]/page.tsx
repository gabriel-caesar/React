import { dietPlanType, workoutPlanType } from '@/app/lib/definitions';
import { Metadata } from 'next';
import PlanStructure from '@/app/ui/dashboard/plans/plan-structure';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const metadata: Metadata = {
  title: 'My plan',
};

export default async function Page({ params }: { params: Promise<{ planId: string }> }) {
  // getting the URL endpoint as the conversation id
  const endpoint = await params;
  const planId = endpoint.planId;
  
  // querying the database for diet plans
  const dietPlanQuery = await sql<dietPlanType[]>`
    SELECT * FROM diet_plans
    WHERE id = ${planId};
  `;

  // querying the database for workout plans
  const workoutPlanQuery = await sql<workoutPlanType[]>`
    SELECT * FROM workout_plans
    WHERE id = ${planId};
  `;

  return(
    <div
      id='main-plan-panel'
      className='w-full flex items-center justify-center px-2 py-15'
    >
      <PlanStructure dietPlan={dietPlanQuery[0]} workoutPlan={workoutPlanQuery[0]} />
    </div>
  )
}