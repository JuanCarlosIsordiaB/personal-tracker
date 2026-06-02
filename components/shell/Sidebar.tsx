'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/components/ui/Icon'

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: '/dashboard', label: 'Inicio', icon: 'home' },
  { href: '/calendario', label: 'Calendario', icon: 'calendar' },
  { href: '/viajes', label: 'Viajes', icon: 'trips' },
  { href: '/gastos', label: 'Gastos', icon: 'wallet' },
]

const ACCENT = '#2A6FDB'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="sidebar-nav"
      style={{
        width: 220,
        flexShrink: 0,
        background: '#FFFFFF',
        borderRight: '1px solid #EEF1F5',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 10,
      }}
    >
      {/* Logo / brand */}
      <div
        style={{
          padding: '0 20px 24px',
          borderBottom: '1px solid #EEF1F5',
          marginBottom: 8,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: ACCENT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon name="flag" size={18} color="#fff" stroke={2} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 760,
                color: '#181B21',
                letterSpacing: -0.3,
                lineHeight: 1.1,
              }}
            >
              Office
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#949BA6',
                letterSpacing: 0.2,
                textTransform: 'uppercase',
              }}
            >
              Tracker
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                background: active ? ACCENT + '12' : 'transparent',
                color: active ? ACCENT : '#59616E',
                fontWeight: active ? 680 : 500,
                fontSize: 14.5,
                letterSpacing: -0.1,
                transition: 'all .15s',
              }}
            >
              <Icon
                name={item.icon}
                size={20}
                color={active ? ACCENT : '#949BA6'}
                stroke={active ? 2.1 : 1.8}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px 0',
          borderTop: '1px solid #EEF1F5',
          fontSize: 12,
          color: '#949BA6',
          fontWeight: 500,
        }}
      >
        Single user · v1
      </div>
    </aside>
  )
}
