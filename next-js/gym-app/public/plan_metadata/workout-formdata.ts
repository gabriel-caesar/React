export const workoutFormRawData = {
  plan_type: '',
  goal: '',
  gender: '',
  current_weight: '',
  height: '',
  age: 0,
  experience_level: '',
  duration_weeks: 0,
  number_of_workout_days: 0,
  user_notes: '',
  daily_workouts: [
    {
      day: 0,
      workout_name: '',
      workout_duration_minutes: 0, // up to this hour, but not past it
      exercises: [
        {
          exercise_name: '',
          equipment: '',
          sets: 0,
          reps: 0,
          rest_seconds: 0,
          estimated_calories_burned: 0,
          progression: {
            type: '',
            increment_value: 0,
            frequency: '',
          },
          exercise_notes: '',
        }
      ],
      total_exercises: 0,
      total_estimated_calories_burned: 0,
    },
  ],
  weekly_totals: {
    total_calories_burned: 0,
    total_sets: 0,
    total_exercises: 0,
  },
  general_notes: '',
};

export type workoutFormDataType = {
  plan_type: string,
  goal: string,
  gender: string,
  current_weight: string,
  height: string,
  age: number | string,
  experience_level: string,
  duration_weeks: number | string,
  number_of_workout_days: number | string,
  user_notes: string,
  daily_workouts: dailyWorkoutsType[],
  weekly_totals: {
    total_calories_burned: number,
    total_sets: number,
    total_exercises: number
  },
  general_notes: string,
}

export type dailyWorkoutsType = {
  day: number,
  workout_name: string,
  workout_duration_minutes: number,
  exercises: exerciseType[],
  total_exercises: number,
  total_estimated_calories_burned: number
}

export type exerciseType = {
  exercise_name: string,
  equipment: string,
  sets: number,
  reps: number,
  rest_seconds: number,
  estimated_calories_burned: number,
  progression: {
    type: string,
    increment_value: number,
    frequency: string,
  },
  exercise_notes: string
}
