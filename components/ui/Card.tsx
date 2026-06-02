import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  pad?: number
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, className, pad = 18, onClick, style }: CardProps) {
  const base: React.CSSProperties = {
    background: '#FFFFFF',
    borderRadius: 22,
    padding: pad,
    boxShadow: '0 1px 2px rgba(20,28,45,0.04), 0 6px 20px -8px rgba(20,28,45,0.08)',
    border: '0.5px solid #EEF1F5',
    ...(onClick ? { cursor: 'pointer' } : {}),
    ...style,
  }

  if (onClick) {
    return (
      <div onClick={onClick} style={base} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div style={base} className={className}>
      {children}
    </div>
  )
}
