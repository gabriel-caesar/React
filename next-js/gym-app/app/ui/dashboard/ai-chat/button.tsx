'use client'

// button used to select what plan the user wants to build
export function Button({ text, className } : { text: string, className: string }) {
  return (
    <button
      arial-label={`${text}-button`}
      className={`text-xl w-full rounded-md bg-red-400 p-2 hover:cursor-pointer hover:bg-red-500 hover:text-neutral-800 transition-all duration-200 ${className}`}
    >
      {text}
    </button>
  )
}