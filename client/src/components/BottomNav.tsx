import { Home, Users, Settings } from "lucide-react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/family-link", icon: Users, label: "Family" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
      <div className="max-w-2xl mx-auto flex justify-around items-center px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              onClick={() => setLocation(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-6 rounded-xl transition-colors min-h-[56px]",
                "hover-elevate active-elevate-2",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-7 w-7" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
