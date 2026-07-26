import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'
import { Badge, Button } from '../components/UI'

const navLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium transition',
    isActive
      ? 'bg-white/10 text-white'
      : 'text-muted hover:bg-white/5 hover:text-text',
  ].join(' ')

const roleLabels = {
  viewer: 'Người xem',
  streamer: 'Streamer',
  admin: 'Quản trị',
}

export function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-full">

      <header className="sticky top-0 z-40 border-b border-white/8 bg-bg/85 backdrop-blur-xl">

        <div className="
          mx-auto flex max-w-7xl items-center justify-between 
          px-4 py-3 sm:px-6 lg:px-8
        ">

          {/* Logo */}
          <div className="min-w-0">
            <div className="font-display text-lg sm:text-xl font-bold tracking-tight text-text truncate">
              Đợp Cùng ThangMicro
            </div>

            <div className="
              hidden sm:block
              text-xs uppercase tracking-[0.24em] text-muted
            ">
              Giành Slot đeeeeeeeeeee
            </div>
          </div>


          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navLinkClass}>
              Trang chủ
            </NavLink>

            <NavLink to="/livestreams" className={navLinkClass}>
              Livestream
            </NavLink>


            {(user?.role === 'viewer' || user?.role === 'admin') && (
              <NavLink 
                to="/viewer/dashboard" 
                className={navLinkClass}
              >
                Người xem
              </NavLink>
            )}


            {(user?.role === 'streamer' || user?.role === 'admin') && (
              <NavLink 
                to="/streamer/dashboard" 
                className={navLinkClass}
              >
                Streamer
              </NavLink>
            )}

          </nav>


          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">

            {user && (
              <Badge tone="accent">
                {roleLabels[user.role] || user.role}
              </Badge>
            )}

            {user ? (
              <Button tone="secondary" onClick={logout}>
                Đăng xuất
              </Button>
            ) : (
              <NavLink to="/login">
                <Button>
                  Đăng nhập
                </Button>
              </NavLink>
            )}

          </div>



          {/* Mobile button */}
          <button
            className="
              md:hidden
              rounded-lg p-2
              text-white
              hover:bg-white/10
            "
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <span className="text-xl">✕</span>
            ) : (
              <span className="text-xl">☰</span>
            )}
          </button>


        </div>


        {/* Mobile menu */}
        {open && (
          <div className="
            md:hidden
            border-t border-white/10
            px-4 py-4
            space-y-2
            bg-bg/95
          ">

            <NavLink 
              to="/" 
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Trang chủ
            </NavLink>


            <NavLink 
              to="/livestreams"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Livestream
            </NavLink>


            {(user?.role === 'viewer' || user?.role === 'admin') && (
              <NavLink 
                to="/viewer/dashboard"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Người xem
              </NavLink>
            )}


            {(user?.role === 'streamer' || user?.role === 'admin') && (
              <NavLink 
                to="/streamer/dashboard"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Streamer
              </NavLink>
            )}


            <div className="pt-3 border-t border-white/10 flex items-center justify-between">

              {user && (
                <Badge tone="accent">
                  {roleLabels[user.role] || user.role}
                </Badge>
              )}


              {user ? (
                <Button 
                  tone="secondary" 
                  onClick={logout}
                >
                  Đăng xuất
                </Button>
              ) : (
                <NavLink to="/login">
                  <Button>
                    Đăng nhập
                  </Button>
                </NavLink>
              )}

            </div>

          </div>
        )}

      </header>


      <main className="
        mx-auto max-w-7xl 
        px-4 py-6 
        sm:px-6 sm:py-8 
        lg:px-8
      ">
        {children}
      </main>

    </div>
  )
}