import PlansCard from '@/app/ui/dashboard/plans/plans-card';
import { getUser } from '@/app/actions/auth';
import { auth } from '@/app/actions/credential-handler';
import { Metadata } from 'next';
import { getUserDietPlans, getUserWorkoutPlans } from '@/app/actions/plans';
import { dietPlanType, workoutPlanType } from '@/app/lib/definitions';

export const metadata: Metadata = {
  title: 'Plans',
};

export default async function Page() {
  // getting user credentials
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');
  const user = await getUser(email); // server side user fetch
  const userId = user ? user.id : '';

  // getting plans
  const dietPlans = await getUserDietPlans(userId);
  const workoutPlans = await getUserWorkoutPlans(userId);

  // converting the date type to string
  dietPlans.forEach(plan => {
    for (const prop in plan) {
      if (prop === 'created_date') {
        plan[prop] = plan[prop].toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }) as any
      }

      if (prop === 'last_edit_date') {
        plan[prop] = plan[prop].toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }) as any
      }
    }
  })

  // converting the date type to string
  workoutPlans.forEach(plan => {
    for (const prop in plan) {
      if (prop === 'created_date') {
        plan[prop] = plan[prop].toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }) as any
      }

      if (prop === 'last_edit_date') {
        plan[prop] = plan[prop].toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'America/New_York',
        }) as any
      }
    }
  })

  return (
    <div className='flex justify-center items-center w-full px-2 py-20'>
      <PlansCard dietPlans={dietPlans as dietPlanType[]} workoutPlans={workoutPlans as workoutPlanType[]} />
    </div>
  );
}
