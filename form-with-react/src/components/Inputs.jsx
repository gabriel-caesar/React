import { useState } from 'react'

export function Input({ 
  label,
  type,
  onChange,
  value,
 }) {

  return (
    <label>
      {label}
      <input
      value={value} 
      type={type} 
      onChange={onChange}
      maxLength={40}
      required
      />
    </label>
  )
}

export function TextArea({
  onChange,
  label,
  value,
  placeholder
}) {
  return (
    <label>
    {label}
      <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows='5'
      minLength={20}
      maxLength={200}
      required
      />
    </label>
  )
}