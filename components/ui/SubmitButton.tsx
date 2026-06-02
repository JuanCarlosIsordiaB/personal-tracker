'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  children: React.ReactNode
  disabled?: boolean
  accent?: string
}

export function SubmitButton({
  children,
  disabled,
  accent = '#2A6FDB',
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  const isDisabled = disabled || pending

  return (
    <button
      type="submit"
      disabled={isDisabled}
      style={{
        width: '100%',
        border: 'none',
        borderRadius: 15,
        padding: '15px',
        marginTop: 4,
        background: isDisabled ? '#E9ECF1' : accent,
        color: isDisabled ? '#949BA6' : '#fff',
        fontSize: 16,
        fontWeight: 700,
        fontFamily: 'inherit',
        cursor: isDisabled ? 'default' : 'pointer',
        letterSpacing: -0.2,
        transition: 'background .15s',
      }}
    >
      {pending ? 'Guardando...' : children}
    </button>
  )
}
