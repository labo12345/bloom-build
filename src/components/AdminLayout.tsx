import { ReactNode, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Calendar, 
  Mail, 
  Image, 
  MessageSquare, 
  Users, 
  LogOut, 
  Menu,
  X,
  Home,
  Wrench,
  Images,
  UserCircle,
  Briefcase,
  FileText
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: Briefcase },
  { name: "Proposals", href: "/admin/proposals", icon: FileText },
  { name: "Consultations", href: "/admin/consultations", icon: Calendar },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Gallery", href: "/admin/gallery", icon: Images },
  { name: "Portfolio", href: "/admin/portfolio", icon: Image },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Team", href: "/admin/team", icon: UserCircle },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Users", href: "/admin/users", icon: Users },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    } else if (!isLoading && user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-cream">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-foreground text-background transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-background/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold">Beyond House</h2>
                <p className="text-xs text-background/60 uppercase tracking-wider">Admin Panel</p>
              </div>
              <button 
                className="lg:hidden text-background/60 hover:text-background"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm",
                    isActive 
                      ? "bg-gold text-foreground" 
                      : "text-background/70 hover:bg-background/10 hover:text-background"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-background/10 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-background/70 hover:bg-background/10 hover:text-background transition-colors text-sm"
            >
              <Home className="h-4 w-4" />
              Back to Website
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-background/70 hover:bg-background/10 hover:text-background transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              className="lg:hidden p-2 text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-xs bg-gold text-accent-foreground px-3 py-1 rounded-full">
                Admin
              </span>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
