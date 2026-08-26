import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Home', end: true },
  { to: '/dashboard/guests', label: 'Guest' },
  { to: '/dashboard/import', label: 'Import' },
  { to: '/dashboard/export', label: 'Export' },
]

function linkClassName({ isActive }) {
  const base =
    'block rounded-md px-3 py-2 font-serif text-xs uppercase tracking-[0.15em] transition'
  return isActive
    ? `${base} bg-stone-800 text-stone-50`
    : `${base} text-stone-600 hover:bg-stone-200/80 hover:text-stone-900`
}

function DashboardNav({ onNavigate }) {
  return (
    <nav aria-label="Dashboard" className="space-y-1">
      {navItems.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={linkClassName}
          onClick={onNavigate}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default DashboardNav
