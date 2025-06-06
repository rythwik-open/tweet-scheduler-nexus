import { useState } from 'react';
import { Menu, X, Home, Calendar, Clock, BarChart2, Settings, LogOut } from 'lucide-react';
import NavItem from './NavItem';

const MainLayout = ({ children, onLogout }: { children: React.ReactNode; onLogout: () => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="min-h-screen">
      <aside
        className={`fixed top-0 left-0 h-full bg-background transition-all duration-300 z-30 neumorphic flex flex-col rounded-none ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        <div className="h-20 flex items-center justify-center">
          <X className="h-6 w-6 text-primary" />
        </div>

        <nav className="mt-8 px-3 space-y-6 flex-1">
          <NavItem icon={Home} label="Dashboard" to="/" expanded={isExpanded} />
          <NavItem icon={Calendar} label="Schedule" to="/schedule" expanded={isExpanded} />
          <NavItem icon={Clock} label="History" to="/history" expanded={isExpanded} />
          <NavItem icon={BarChart2} label="Analytics" to="/analytics" expanded={isExpanded} />
        </nav>

        <div className="mb-8 px-3 space-y-4">
          <NavItem icon={Settings} label="Settings" to="/settings" expanded={isExpanded} />
          <button
            onClick={onLogout}
            className={`w-full neumorphic p-3 rounded-full flex items-center text-primary active:pressed ${
              isExpanded ? 'justify-start pl-4' : 'justify-center'
            }`}
          >
            <LogOut className="h-5 w-5" />
            {isExpanded && <span className="ml-3 text-sm">Logout</span>}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-full neumorphic p-3 rounded-full flex items-center text-primary active:pressed ${
              isExpanded ? 'justify-start pl-4' : 'justify-center'
            }`}
          >
            <Menu className="h-5 w-5" />
            {isExpanded && <span className="ml-3 text-sm">Toggle Sidebar</span>}
          </button>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${isExpanded ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 fixed top-0 right-0 left-0 bg-background z-20 flex items-center justify-end px-6">
          <div className={`transition-all duration-300`}>
            <div className="neumorphic p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <img
                  src="https://pbs.twimg.com/profile_images/1841778545925767168/rNZJA_j5_400x400.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-primary">The Based Labs</p>
                  <p className="text-xs text-muted-foreground">@TheBasedLabs</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="pt-24 px-6 pb-6">{children}</div>
      </main>
    </div>
  );
};

export default MainLayout;