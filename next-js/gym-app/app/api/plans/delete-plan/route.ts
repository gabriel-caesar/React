'use server';

import { getBaseUrl } from '@/app/actions/chat';
import { deletePlan } from '@/app/actions/plans';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    id,
    type
  } : { 
    id: string,
    type: 'diet_plans' | 'workout_plans'
  } = await req.json();

  const baseURL = await getBaseUrl();

  try {
    await deletePlan(id, type);
    return NextResponse.json({ success: true })
  } catch (error) {
    throw new Error(`Couldn't delete plan from API call. ${error}`)
  }
}
