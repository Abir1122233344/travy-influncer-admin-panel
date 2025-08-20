import Link from "next/link";
import { useRouter } from "next/router";
import { 
  BarChart3, 
  Users, 
  Star, 
  Target, 
  LogIn, 
  Building2,
  Crown
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/influencers", label: "Influencers", icon: Star },
  { href: "/influencer/dashboard", label: "Influencer", icon: Target },
  { href: "/auth/login", label: "Login", icon: LogIn }
];

export default function Sidebar() {
  const router = useRouter();
  
  return (
    <aside className="h-full w-64 lg:w-72 shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm transition-all duration-300 ease-out">
      <div className="p-6">
        <div className="mb-6 group">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Navigation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Manage your system</p>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = router.pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ease-out ${
                  active 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm scale-[1.02]" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:scale-[1.02] hover:shadow-sm"
                }`}
              >
                <IconComponent className={`h-5 w-5 transition-all duration-200 ease-out ${
                  active 
                    ? "text-blue-600 dark:text-blue-400 scale-110" 
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 group-hover:scale-110"
                }`} />
                <span className="transition-all duration-200 ease-out">{item.label}</span>
                {active && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/30 p-4 border border-blue-200 dark:border-blue-800 transition-all duration-200 ease-out hover:scale-105 hover:shadow-md group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center transition-all duration-200 ease-out group-hover:scale-110 group-hover:shadow-md">
                <Crown className="h-5 w-5 text-white transition-transform duration-200 group-hover:rotate-6" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">Travy Pro</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-200">Premium features</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
