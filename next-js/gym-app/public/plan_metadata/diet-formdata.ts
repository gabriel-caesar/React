export const dietFormRawData = {
  plan_type: '',
  goal: '',
  gender: '',
  current_weight: '',
  height: '',
  age: 0,
  activity_level: '',
  number_of_meals: 0,
  meal_timing_hours: 0,
  duration_weeks: 0,
  want_supplements: false,
  daily_caloric_intake: 0,
  dietary_restrictions: [],
  user_notes: '',
  meals: [
    {
      meal_name: '',
      meal_time: '',
      items: [
        {
          name: '',
          weight_g: 0,
          protein_g: 0,
          carbs_g: 0,
          fats_g: 0,
          calories: 0,
        },
      ],
      meal_totals: {
        protein_g: 0,
        carbs_g: 0,
        fats_g: 0,
        calories: 0,
        weight_g: 0,
      },
    },
  ],
  daily_totals: {
    protein_g: 0,
    carbs_g: 0,
    fats_g: 0,
    calories: 0,
    weight_g: 0,
  },
  weekly_summary: {
    expected_change: '',
    notes: '',
  },
  hydration: {
    water_intake_liters: 0,
    notes: '',
  },
  supplements: [
    {
      name: '',
      dosage: '',
      timing: '',
    },
  ],
  general_notes: '',
};

export type dietFormDataType = {
  plan_type: string,
  goal: string,
  gender: string,
  current_weight: string,
  height: string,
  age: number | string,
  activity_level: string,
  number_of_meals: number | string,
  meal_timing_hours: number | string,
  duration_weeks: number | string,
  want_supplements: boolean | string,
  daily_caloric_intake: number | string,
  dietary_restrictions: { id: string; restriction: string }[],
  user_notes: string,
  meals: mealType[],
  daily_totals: {
    protein_g: number,
    carbs_g: number,
    fats_g: number,
    calories: number,
    weight_g: number
  },
  weekly_summary: {
    expected_change: string,
    notes: string,
  },
  hydration: {
    water_intake_liters: number,
    notes: string
  },
  supplements: {
    name: string,
    dosage: string,
    timing: string,
  }[],
  general_notes: string
}

export type mealType = {
  meal_name: string,
  meal_time: string,
  items: {
    name: string,
    weight_g: number,
    protein_g: number,
    carbs_g: number,
    fats_g: number,
    calories: number,
  }[],
  meal_totals: {
    protein_g: number,
    carbs_g: number,
    fats_g: number,
    calories: number,
    weight_g: number
  }
}
