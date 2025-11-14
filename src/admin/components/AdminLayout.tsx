import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Images, 
  ImagePlus, 
  LogOut,
  Menu,
  X,
  Flower2
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Images, label: "Gallery", path: "/admin/gallery" },
    { icon: ImagePlus, label: "Upload", path: "/admin/upload" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0 md:w-20'
        } bg-slate-900/95 backdrop-blur-xl transition-all duration-300 border-r border-white/10 fixed h-full z-30 overflow-y-auto shadow-2xl`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className={`flex items-center gap-3 mb-8 ${!sidebarOpen && 'md:justify-center'}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-white text-lg">Jagdish</h2>
                <p className="text-xs text-blue-300">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = window.location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30' 
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  } ${!sidebarOpen && 'md:justify-center'}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full" />}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-semibold text-sm flex-1 text-left">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <button
              onClick={handleLogout}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/20 hover:text-red-300 ${!sidebarOpen && 'md:justify-center'}`}
              title={!sidebarOpen ? 'Logout' : undefined}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-semibold text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'md:ml-72' : 'md:ml-20'} transition-all duration-300 min-h-screen`}>
        {/* Top Bar */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20 shadow-lg">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:block p-2 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
