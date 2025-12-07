import { BsPersonWalking } from 'react-icons/bs';
import { GiChicken, GiMountaintop } from 'react-icons/gi';
import { IoIosFemale, IoIosMale, IoMdStarOutline } from 'react-icons/io';
import { LuSalad } from 'react-icons/lu';
import { RiStairsLine } from 'react-icons/ri';
import { TbVectorTriangle } from 'react-icons/tb';

export const sections_workout = [
  {
    prop: 'goal',
    title: 'Choose your goal',
    buttons: [
      {
        id: 'bulking-button',
        name: 'Bulking',
        icon: <GiMountaintop className='ml-2' />,
      },
      {
        id: 'hypertrophy-button',
        name: 'Hypertrophy',
        icon: <TbVectorTriangle className='ml-2 rotate-180' />,
      },
      {
        id: 'weight-loss-button',
        name: 'Weight loss',
        icon: <LuSalad className='ml-2' />,
      },
    ],
    inputs: [
      {
        regex: /[a-z\s]+/i,
        label: 'Other goal',
        id: 'other-goal-input',
        placeholder: 'Other...',
        error: 'Please, enter only words',
      },
    ],
  },
  {
    prop: 'gender',
    title: 'What is your gender?',
    buttons: [
      {
        id: 'male-button',
        name: 'Male',
        icon: <IoIosMale className='ml-2' />,
      },
      {
        id: 'female-button',
        name: 'Female',
        icon: <IoIosFemale className='ml-2' />,
      },
    ],
  },
  {
    prop: 'current_weight',
    title: 'What is your weight in kilograms or pounds?',
    inputs: [
      {
        regex: /^\d{2,3}(\.\d{1,2})?\s?(kg|lb)$/i,
        id: 'current-weight-input',
        placeholder: 'Weight...',
        style: 'mt-6',
        error: 'Try something like 80kg or 176lb',
      },
    ],
  },
  {
    prop: 'height',
    title: 'What is your height in cm or feet?',
    inputs: [
      {
        regex: /^([0-9]\'[0-9]{1,2}\"|[0-9]{2,3}cm)$/i,
        id: 'height-input',
        placeholder: 'Height...',
        style: 'mt-6',
        error: `Try something like 180cm or 5'11"`,
      },
    ],
  },
  {
    prop: 'age',
    title: 'How old are you?',
    inputs: [
      {
        regex: /^[1-9][0-9]$/i,
        id: 'age-input',
        placeholder: 'Age...',
        style: 'mt-6',
        error: 'Only numbers and 10+ age are allowed',
      },
    ],
  },
  {
    prop: 'experience_level',
    title: 'Choose your experience level',
    buttons: [
      {
        id: 'newbie-button',
        name: 'Newbie',
        icon: <GiChicken className='ml-2' />,
      },
      {
        id: 'intermediate-button',
        name: 'Intermediate',
        icon: <RiStairsLine className='ml-2' />,
      },
      {
        id: 'very-experienced-button',
        name: 'Very Experienced',
        icon: <IoMdStarOutline className='ml-2' />,
      },
    ],
  },
  {
    prop: 'duration_weeks',
    title: 'For how many weeks you pretend to follow this workout routine?',
    inputs: [
      {
        regex: /^[1-9]([0-9])?(\sweek(s)?)?$/i,
        id: 'plan-duration-input',
        placeholder: '4...',
        style: 'mt-6',
        error: `Enter only numbers (optional: followed with "weeks" or "week")`
      }
    ]
  },
  {
    prop: 'number_of_workout_days',
    title: 'How many days you plan to workout?',
    inputs: [
      {
        regex: /^[1-9]([0-9])?$/i,
        id: 'number_of_workout_days-input',
        placeholder: '5...',
        style: 'mt-6',
        error: 'Only numbers are allowed'
      }
    ]
  },
  {
    prop: 'user_notes',
    title: 'Additional information',
    desc: 'Is there anything else you would like me to know in order to make this workout routine be the best for you?',
    textareas: [
      {
        label: 'Notes',
        id: 'user-notes-textarea',
        placeholder: 'Notes...',
        style: 'mt-6',
      }
    ]
  },
  {
    prop: 'generate',
    title: 'Now let Diversus take it from here, click the button to start the plan generation.',
    buttons: [
      {
        id: 'generate-plan-button',
        name: 'Generate'
      }
    ]
  }
];
