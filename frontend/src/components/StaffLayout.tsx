import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { LayoutDashboard, Calendar, Package, MessageSquare, DollarSign, LogOut, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerUserRole } from '@/hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: userRole, isLoading: roleLoading, error: roleError } = useGetCallerUserRole();
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  useEffect(() => {
    // Redirect to login if not authenticated and not initializing
    if (!isAuthenticated && !isInitializing) {
      navigate({ to: '/staff/login' });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    // Check if user has proper role once loaded
    if (isAuthenticated && !roleLoading && userRole) {
      if (userRole === 'guest') {
        setAuthError('Access denied. You do not have staff permissions.');
      } else {
        setAuthError(null);
      }
    }
  }, [isAuthenticated, roleLoading, userRole]);

  useEffect(() => {
    // Handle role fetch errors
    if (roleError) {
      setAuthError('Failed to verify staff permissions. Please try logging in again.');
    }
  }, [roleError]);

  const navigation = [
    { name: 'Dashboard', href: '/staff', icon: LayoutDashboard },
    { name: 'Reservations', href: '/staff/reservations', icon: Calendar },
    { name: 'Drop-Off & Pickup', href: '/staff/drop-offs-pickups', icon: Package },
    { name: 'Messages', href: '/staff/contact-messages', icon: MessageSquare },
    { name: 'Pricing', href: '/staff/pricing', icon: DollarSign },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/staff/login' });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user':
        return 'Staff';
      default:
        return 'Guest';
    }
  };

  // Show loading state while initializing or checking authentication
  if (!isAuthenticated || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show loading state while role is being fetched
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verifying credentials...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/staff" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Chef KnifeWorks</h1>
              <Badge variant="outline" className="ml-2">Staff CRM</Badge>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {roleLoading ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant={getRoleBadgeVariant(userRole || 'guest')}>
                  {getRoleDisplayName(userRole || 'guest')}
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profileLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      userProfile?.name || 'Staff Member'
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {authError ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{authError}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </AlertDescription>
          </Alert>
        ) : null}
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Chef KnifeWorks Staff CRM. Built with{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
