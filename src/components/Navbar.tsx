import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Phone, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Consultancy", href: "/consultancy" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-semibold text-foreground tracking-tight">
                Beyond House
              </span>
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                Interior Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-gold",
                  location.pathname === item.href
                    ? "text-gold"
                    : "text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA & Auth Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin">Admin Dashboard</Link>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button variant="gold" size="lg" asChild>
              <Link to="/contact">
                <Phone className="h-4 w-4" />
                Get a Quote
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-base font-medium py-2 transition-colors duration-200",
                    location.pathname === item.href
                      ? "text-gold"
                      : "text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button variant="gold" size="lg" asChild className="mt-4">
                <Link to="/contact">Get a Quote</Link>
              </Button>
              {user ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" size="lg" asChild className="w-full">
                      <Link to="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="lg" onClick={handleSignOut} className="w-full">
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="lg" asChild className="w-full">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-1" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
