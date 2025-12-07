'use server';

import { setPlanAsDefault } from '@/app/actions/plans';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    id,
    type
  } : { 
    id: string,
    type: 'diet_plans' | 'workout_plans'
  } = await req.json();

  try {
    await setPlanAsDefault(id, type);
    return NextResponse.json({ success: true })
  } catch (error) {
    throw new Error(`Couldn't set plan as default from API call. ${error}`)
  }
}
