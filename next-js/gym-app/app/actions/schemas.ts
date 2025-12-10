import z from 'zod';
import { uniqueId } from './utils';

export const workoutGeneralInfo = z.object({
  plan_id: z.string(),
  goal: z.string().trim().min(5, 'Goal not valid').toLowerCase(),
  gender: z.string().toLowerCase(),
  current_weight: z
    .string()
    .regex(
      /^\d{2,3}(\.\d{1,2})?\s?(kg|lb)$/i,
      'Try something like 80kg or 176lb'
    ),
  height: z
    .string()
    .regex(
      /^([0-9]\'[0-9]{1,2}\"|[0-9]{2,3}cm)$/i,
      `Try something like 180cm or 5'11"`
    ),
  age: z.coerce
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  experience_level: z.string().toLowerCase(),
  number_of_workout_days: z
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  duration_weeks: z.coerce
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
});

export const dietGeneralInfo = z.object({
  plan_id: z.string(),
  goal: z.string().trim().min(5, 'Goal not valid').toLowerCase(),
  gender: z.string().toLowerCase(),
  current_weight: z
    .string()
    .regex(
      /^\d{2,3}(\.\d{1,2})?\s?(kg|lb)$/i,
      'Try something like 80kg or 176lb'
    ),
  height: z
    .string()
    .regex(
      /^([0-9]\'[0-9]{1,2}\"|[0-9]{2,3}cm)$/i,
      `Try something like 180cm or 5'11"`
    ),
  age: z.coerce
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  activity_level: z.string().toLowerCase(),
  number_of_meals: z
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  meal_timing_hours: z
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  duration_weeks: z
    .string()
    .regex(/^[1-9]([0-9])?$/i, 'Only numbers and 2 digits are allowed')
    .transform((val) => Number(val)),
  want_supplements: z.string().toLowerCase(),
  daily_caloric_intake: z
    .string()
    .regex(/^[1-9]([0-9]){1,3}?$/i, 'Only numbers and 4 digits are allowed')
    .transform((val) => Number(val)),
  dietary_restrictions: z.array(
    z.string().transform((val) => ({ restriction: val, id: uniqueId() }))
  ),
});

const MAX_FILE_SIZE = 5000000; // 5million
const COMPATIBLE_FILE_TYPES = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/webp',
]; // acceptable image formats
export const profileSchema = z.object({
  user_id: z.string(),
  firstname: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]{4,}$/i, 'Only letters are allowed (4 letters min.)'),
  lastname: z
    .string()
    .trim()
    .regex(/^[a-zA-Z\s]{4,}$/i, 'Only letters are allowed (4 letters min.)'),
  profile_picture: z
    .instanceof(File)
    .refine((file) => {
      // No file selected (ghost file)
      if (file.size === 0) return true;

      return file.size <= MAX_FILE_SIZE;
    }, 'Image is too heavy, try another one')
    .refine((file) => {
      // No file selected (ghost file)
      if (file.size === 0) return true;

      return COMPATIBLE_FILE_TYPES.includes(file.type);
    }, 'Image type not compatible, try ".jpeg", ".jpg", ".png" or ".webp"')
    .optional(),
});
