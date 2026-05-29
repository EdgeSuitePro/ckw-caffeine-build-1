import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserRole } from '@/hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';

export default function StaffLogin() {
  const navigate = useNavigate();
  const { identity, login, loginStatus, clear } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading, error: roleError, isFetched: roleFetched } = useGetCallerUserRole();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const isInitializing = loginStatus === 'initializing';

  // Handle redirect after successful authentication and role verification
  useEffect(() => {
    if (isAuthenticated && roleFetched && !roleLoading && userRole && !isRedirecting) {
      if (userRole === 'user' || userRole === 'admin') {
        setIsRedirecting(true);
        setAuthError(null);
        // Use setTimeout to ensure state updates complete before navigation
        setTimeout(() => {
          navigate({ to: '/staff' });
        }, 100);
      } else if (userRole === 'guest') {
        setAuthError('Access denied. You do not have staff permissions. Please contact an administrator.');
      }
    }
  }, [isAuthenticated, roleFetched, roleLoading, userRole, navigate, isRedirecting]);

  // Handle role fetch errors
  useEffect(() => {
    if (roleError && !roleLoading) {
      setAuthError('Failed to verify staff permissions. Please try again.');
    }
  }, [roleError, roleLoading]);

  // Handle login errors
  useEffect(() => {
    if (loginStatus === 'loginError') {
      setAuthError('Login failed. Please try again.');
    }
  }, [loginStatus]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleRetry = async () => {
    setAuthError(null);
    setIsRedirecting(false);
    await clear();
    // Small delay to ensure cleanup completes
    setTimeout(() => {
      handleLogin();
    }, 300);
  };

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Initializing...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while verifying credentials after login
  if (isAuthenticated && (roleLoading || !roleFetched || isRedirecting)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">
                {isRedirecting ? 'Redirecting to dashboard...' : 'Verifying staff credentials...'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Staff Login</CardTitle>
          <CardDescription className="text-center">
            Sign in with Internet Identity to access the Chef KnifeWorks Staff CRM
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex flex-col space-y-2">
                <span>{authError}</span>
                {(roleError || userRole === 'guest') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="w-full mt-2"
                  >
                    Try Again
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn || isAuthenticated}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login with Internet Identity
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Only authorized staff members can access this area.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
