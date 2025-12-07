import { GiMountaintop, GiPotato } from 'react-icons/gi';
import { TbVectorTriangle } from 'react-icons/tb';
import { LuSalad } from 'react-icons/lu';
import { IoIosMale, IoIosFemale } from 'react-icons/io';
import { FaRunning } from 'react-icons/fa';
import { BsPersonWalking } from "react-icons/bs";

export const sections_diet = [
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
        error: 'Please, enter only words'
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
        error: 'Try something like 80kg or 176lb'
      },
    ]
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
        error: `Try something like 180cm or 5'11"`
      }
    ]
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
        error: 'Only numbers and 10+ age are allowed'
      }
    ]
  },
  {
    prop: 'activity_level',
    title: 'Choose your activity level',
    buttons: [
      {
        id: 'couch-potato-button',
        name: 'Couch Potato',
        icon: <GiPotato className='ml-2' />
      },
      {
        id: 'intermediate-button',
        name: 'Intermediate',
        icon: <BsPersonWalking className='ml-2' />
      },
      {
        id: 'very-active-button',
        name: 'Very Active',
        icon: <FaRunning className='ml-2' />
      }
    ]
  },
  {
    prop: 'number_of_meals',
    title: 'How many meals a day you are looking for?',
    inputs: [
      {
        regex: /^[1-9]([0-9])?$/i,
        id: 'number-of-meals-input',
        placeholder: '5...',
        style: 'mt-6',
        error: 'Only numbers are allowed'
      }
    ]
  },
  {
    prop: 'meal_timing_hours',
    title: `How'd like your break between meals?`,
    buttons: [
      {
        id: 'three-hours-button',
        name: '3 Hours',
      },
      {
        id: 'four-hours-button',
        name: '4 Hours',
      },
      {
        id: 'five-hours-button',
        name: '5 Hours',
      },
    ],
    inputs: [
      {
        regex: /^[1-9]([0-9])?(\shour(s)?)?$/i,
        id: 'other-time-input',
        label: 'Other timeframe',
        placeholder: 'Other...',
        error: `Enter only numbers (optional: followed with "hours" or "hour")`
      }
    ]
  },
  {
    prop: 'duration_weeks',
    title: 'For how many weeks you pretend to follow this diet?',
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
    prop: 'dietary_restrictions',
    title: 'What are your diet restrictions including allergies?',
    desc: 'Type what you don\'t prefer to eat, don\'t forget to include your allergies and click return to add your choices. You can add how many you want.',
    inputs: [
      {
        id: 'restrictions-input',
        label: 'Restrictions',
        placeholder: 'Shrimp...',
      }
    ]
  },
  {
    prop: 'want_supplements',
    title: 'Would like supplements with your diet plan?',
    desc: 'Includes, but not limited to, protein powder, vitamins and creatine.',
    buttons: [
      {
        id: 'yes-button',
        name: 'Yes',
      },
      {
        id: 'no-button',
        name: 'No',
      }
    ]
  },
  {
    prop: 'daily_caloric_intake',
    title: 'What is the projection of your daily caloric intake?',
    desc: 'If you don\'t have a goal for your daily caloric intake, you can leave Diversus come up with one for you, which will be based on your previous answers.',
    buttons: [
      {
        id: 'leave-to-ai-button',
        name: 'Leave it to Diversus'
      }
    ],
    inputs: [
      {
        regex: /^[0-9]{2,5}(\scal)?$/i,
        id: 'caloric-intake-input',
        placeholder: '3000...',
        label: 'Caloric intake',
        error: `Only numbers are allowed`
      }
    ]
  },
  {
    prop: 'user_notes',
    title: 'Additional information',
    desc: 'Is there anything else you would like me to know in order to make this diet plan be the best for you?',
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