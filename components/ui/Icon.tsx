import React from 'react'

export type IconName =
  | 'home'
  | 'calendar'
  | 'trips'
  | 'wallet'
  | 'plane'
  | 'bed'
  | 'food'
  | 'extra'
  | 'plus'
  | 'chevR'
  | 'chevL'
  | 'chevD'
  | 'check'
  | 'clock'
  | 'alert'
  | 'spark'
  | 'camera'
  | 'pin'
  | 'arrow'
  | 'edit'
  | 'flag'
  | 'x'
  | 'trash'

interface IconProps {
  name: IconName
  size?: number
  color?: string
  stroke?: number
  className?: string
}

export function Icon({ name, size = 22, color = 'currentColor', stroke = 1.9, className }: IconProps) {
  const p = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const paths: Record<IconName, React.ReactNode> = {
    home: <path {...p} d="M3 10.5 12 3l9 7.5M5.5 9v11h13V9" />,
    calendar: (
      <g {...p}>
        <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
        <path d="M3.5 9h17M8 2.5v4M16 2.5v4" />
      </g>
    ),
    trips: (
      <g {...p}>
        <path d="M3.5 19h17" />
        <path d="M5 15.5 9 14l3.5-6c.5-1 1.6-1.4 2.5-1 .9.4 1.2 1.5.7 2.5L13 14l5-1.3c1-.2 1.8.3 2 1.2.2.9-.4 1.6-1.3 1.9L5.5 19" />
      </g>
    ),
    wallet: (
      <g {...p}>
        <rect x="3" y="5.5" width="18" height="14" rx="3" />
        <path d="M3 9.5h18M16.5 14h1.5" />
      </g>
    ),
    plane: <path {...p} d="M3 13.5 8 12l3.2-5.6c.45-.9 1.5-1.3 2.3-.9.8.4 1.1 1.4.65 2.3L11.5 13l4.8-1.3c.9-.2 1.6.3 1.8 1.1.2.8-.4 1.5-1.2 1.7L5 17" />,
    bed: (
      <g {...p}>
        <path d="M3 7v11M3 12h18v6M21 18v-4a3 3 0 0 0-3-3h-7v4" />
        <path d="M6.5 11.5a1.5 1.5 0 1 0 0-.01" />
      </g>
    ),
    food: (
      <g {...p}>
        <path d="M6 3v8M9 3v8M7.5 11v10M7.5 3v3M16 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4m0-9v18" />
      </g>
    ),
    extra: (
      <g {...p}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M9.5 10a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5M12 17h.01" />
      </g>
    ),
    plus: <path {...p} d="M12 5v14M5 12h14" />,
    chevR: <path {...p} d="M9 5l7 7-7 7" />,
    chevL: <path {...p} d="M15 5l-7 7 7 7" />,
    chevD: <path {...p} d="M5 9l7 7 7-7" />,
    check: <path {...p} d="M5 12.5l4.5 4.5L19 6.5" />,
    clock: (
      <g {...p}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </g>
    ),
    alert: (
      <g {...p}>
        <path d="M12 3.5 21 19H3L12 3.5Z" />
        <path d="M12 10v4M12 16.5h.01" />
      </g>
    ),
    spark: <path {...p} d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />,
    camera: (
      <g {...p}>
        <rect x="3" y="6.5" width="18" height="13" rx="3" />
        <circle cx="12" cy="13" r="3.5" />
        <path d="M8 6.5l1.2-2h5.6L16 6.5" />
      </g>
    ),
    pin: (
      <g {...p}>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </g>
    ),
    arrow: <path {...p} d="M5 12h14M13 6l6 6-6 6" />,
    edit: (
      <g {...p}>
        <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
        <path d="M14 6l4 4" />
      </g>
    ),
    flag: (
      <g {...p}>
        <path d="M6 21V4M6 5h11l-2 3.5L17 12H6" />
      </g>
    ),
    x: <path {...p} d="M6 6l12 12M18 6 6 18" />,
    trash: (
      <g {...p}>
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </g>
    ),
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}

export type CatKey = 'avion' | 'hospedaje' | 'comida' | 'extra'

const CAT_MAP: Record<CatKey, IconName> = {
  avion: 'plane',
  hospedaje: 'bed',
  comida: 'food',
  extra: 'extra',
}

export const CAT_COLORS: Record<CatKey, string> = {
  avion: '#3B82C4',
  hospedaje: '#7A6CE0',
  comida: '#E0903B',
  extra: '#5BA88A',
}

export const CAT_LABELS: Record<CatKey, string> = {
  avion: 'Avión',
  hospedaje: 'Hospedaje',
  comida: 'Comida',
  extra: 'Extra',
}

export function CatIcon({ cat, size = 18 }: { cat: CatKey; size?: number }) {
  return (
    <Icon name={CAT_MAP[cat]} size={size} color={CAT_COLORS[cat]} stroke={1.9} />
  )
}
