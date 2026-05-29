import { Outlet, Link, useLocation, useNavigate } from '@tanstack/react-router';
import { Menu, X, ClipboardCheck, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SiFacebook, SiInstagram } from 'react-icons/si';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Reserve', href: '/reservation' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">Chef KnifeWorks</h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Static Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 shadow-lg" style={{ backgroundColor: '#2C2C2C' }}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-3 md:py-4">
          <div className="grid grid-cols-2 gap-3 md:gap-4 md:max-w-md md:mx-auto">
            <Button
              onClick={() => navigate({ to: '/drop-off' })}
              className="h-12 md:h-14 font-semibold text-base transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: '#c8754e',
                color: '#F5F3ED'
              }}
            >
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Check-In
            </Button>
            <Button
              onClick={() => navigate({ to: '/pickup' })}
              className="h-12 md:h-14 font-semibold text-base transition-all hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: '#c8754e',
                color: '#F5F3ED'
              }}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Pickup
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">Chef KnifeWorks</h3>
              <p className="text-sm text-muted-foreground">
                Premium knife sharpening service for culinary professionals and enthusiasts.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>123 Culinary Lane</p>
                <p>San Francisco, CA 94102</p>
                <p>Phone: (415) 555-EDGE</p>
                <p>Email: info@chefknifeworks.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  to="/drop-off"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Drop-Off
                </Link>
                <Link
                  to="/pickup"
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pickup
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2025. Built with love using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
