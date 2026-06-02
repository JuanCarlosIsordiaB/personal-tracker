'use client'

import React, { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  maxH?: number
}

export function Sheet({ open, onClose, title, children, maxH = 0.9 }: SheetProps) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
      const t = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!mounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15,20,30,0.32)',
          opacity: closing ? 0 : 1,
          transition: 'opacity .28s ease',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />

      {/* sheet */}
      <div
        className="sheet-content"
        style={{
          position: 'relative',
          background: '#F3F5F8',
          borderRadius: '26px 26px 0 0',
          maxHeight: `${maxH * 100}vh`,
          display: 'flex',
          flexDirection: 'column',
          transform: closing ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform .3s cubic-bezier(.2,.85,.25,1)',
          animation: closing ? 'none' : 'sheetIn .34s cubic-bezier(.2,.85,.25,1)',
          boxShadow: '0 -8px 40px rgba(15,20,30,0.18)',
        }}
      >
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 9 }}>
          <div
            style={{
              width: 38,
              height: 5,
              borderRadius: 99,
              background: '#D2D7DF',
            }}
          />
        </div>

        {/* header */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 20px 4px',
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 720,
                color: '#181B21',
                letterSpacing: -0.4,
              }}
            >
              {title}
            </div>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: '#E9ECF1',
                width: 30,
                height: 30,
                borderRadius: 99,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="x" size={16} color="#59616E" stroke={2.2} />
            </button>
          </div>
        )}

        <div style={{ overflowY: 'auto', padding: '6px 20px 32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
