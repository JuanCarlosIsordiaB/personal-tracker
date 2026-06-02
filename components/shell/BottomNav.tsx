'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/Icon'

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard',  label: 'Inicio',     icon: 'home'     },
  { href: '/calendario', label: 'Calendario', icon: 'calendar' },
  { href: '/viajes',     label: 'Viajes',     icon: 'trips'    },
  { href: '/gastos',     label: 'Gastos',     icon: 'wallet'   },
]

const ACCENT = '#2A6FDB'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderTop: '1px solid #EEF1F5',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {NAV.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: '10px 0 8px',
              textDecoration: 'none',
              color: active ? ACCENT : '#949BA6',
            }}
          >
            <Icon
              name={item.icon}
              size={24}
              color={active ? ACCENT : '#949BA6'}
              stroke={active ? 2.1 : 1.8}
            />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: active ? 700 : 560,
                letterSpacing: 0.1,
              }}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
