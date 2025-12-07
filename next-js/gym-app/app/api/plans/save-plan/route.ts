'use server';

import { savePlan, savePlanInMessage } from '@/app/actions/plans';
import { dietFormDataType } from '@/public/plan_metadata/diet-formdata';
import { workoutFormDataType } from '@/public/plan_metadata/workout-formdata';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    formData,
    isDiet,
    userId,
    messageId
  } : { 
    formData: dietFormDataType | workoutFormDataType;
    isDiet: boolean;
    userId: string;
    messageId: string;
  } = await req.json();

  try {
    await savePlan(formData, isDiet, userId); // saves the plan in the database
    await savePlanInMessage(messageId); // updates the message bubble with the saved flag in the database
    return NextResponse.json({ success: true })
  } catch (error) {
    throw new Error(`Couldn't initiate plan saving from API call. ${error}`)
  }
}
