import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Mic, Settings, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/app/home', icon: Home, label: 'Home' },
  { to: '/app/search', icon: Search, label: 'Search' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border">
        <Zap className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Echolater</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Record button at bottom */}
      <div className="p-4 border-t border-border">
        <Button className="w-full gap-2" onClick={() => navigate('/app/record')}>
          <Mic className="h-4 w-4" />
          New Recording
        </Button>
      </div>
    </aside>
  );
}
