'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { AddTripSheet } from '@/components/forms/AddTripSheet'

interface ViajesClientProps {
  children: React.ReactNode
  totalDays: number
  totalCost: string
  nViajes: number
  quarterId: string
  festivosMap: [string, string][]
}

export function ViajesClient({
  children,
  totalDays,
  totalCost,
  nViajes,
  quarterId,
  festivosMap,
}: ViajesClientProps) {
  const [showAdd, setShowAdd] = useState(false)
  const fMap = new Map(festivosMap)

  return (
    <>
      {/* summary + add button */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 22,
          padding: 16,
          boxShadow: '0 1px 2px rgba(20,28,45,0.04), 0 6px 20px -8px rgba(20,28,45,0.08)',
          border: '0.5px solid #EEF1F5',
          marginBottom: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: '#949BA6', fontWeight: 600 }}>
            {nViajes} viaje{nViajes !== 1 ? 's' : ''} · {quarterId.replace('-', ' · ')}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 760,
              color: '#181B21',
              letterSpacing: -0.5,
              marginTop: 2,
              fontVariantNumeric: 'tabular-nums',
              whiteSpace: 'nowrap',
            }}
          >
            {totalDays} días · {totalCost}
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            border: 'none',
            background: '#2A6FDB',
            color: '#fff',
            borderRadius: 12,
            height: 40,
            padding: '0 14px',
            fontSize: 14,
            fontWeight: 680,
            fontFamily: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Icon name="plus" size={17} color="#fff" stroke={2.4} />
          Viaje
        </button>
      </div>

      {children}

      <AddTripSheet
        open={showAdd}
        onClose={() => setShowAdd(false)}
        festivosMap={fMap}
      />
    </>
  )
}
