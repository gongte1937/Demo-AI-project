import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Mic, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-sm md:hidden">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {/* Home */}
        <NavLink
          to="/app/home"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )
          }
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>

        {/* Record — prominent center button */}
        <button
          onClick={() => navigate('/app/record')}
          className={cn(
            'flex flex-col items-center justify-center w-14 h-14 -mt-6 rounded-full',
            'bg-primary text-primary-foreground shadow-lg',
            'active:scale-95 transition-transform',
          )}
          aria-label="New recording"
        >
          <Mic className="h-6 w-6" />
        </button>

        {/* Settings */}
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-0.5 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground',
            )
          }
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
