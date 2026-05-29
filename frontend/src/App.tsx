import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import ReservationPage from './pages/ReservationPage';
import DropOffPage from './pages/DropOffPage';
import PickupPage from './pages/PickupPage';
import ContactPage from './pages/ContactPage';
import Layout from './components/Layout';
import StaffLayout from './components/StaffLayout';
import StaffLogin from './pages/staff/StaffLogin';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffReservations from './pages/staff/StaffReservations';
import StaffDropOffPickup from './pages/staff/StaffDropOffPickup';
import StaffContactMessages from './pages/staff/StaffContactMessages';
import StaffPricing from './pages/staff/StaffPricing';

const rootRoute = createRootRoute({
  component: Layout,
});

const staffRootRoute = createRootRoute({
  component: StaffLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
});

const reservationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reservation',
  component: ReservationPage,
});

const dropOffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/drop-off',
  component: DropOffPage,
});

const pickupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pickup',
  component: PickupPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const staffLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/staff/login',
  component: StaffLogin,
});

const staffDashboardRoute = createRoute({
  getParentRoute: () => staffRootRoute,
  path: '/staff',
  component: StaffDashboard,
});

const staffReservationsRoute = createRoute({
  getParentRoute: () => staffRootRoute,
  path: '/staff/reservations',
  component: StaffReservations,
});

const staffDropOffPickupRoute = createRoute({
  getParentRoute: () => staffRootRoute,
  path: '/staff/drop-offs-pickups',
  component: StaffDropOffPickup,
});

const staffContactMessagesRoute = createRoute({
  getParentRoute: () => staffRootRoute,
  path: '/staff/contact-messages',
  component: StaffContactMessages,
});

const staffPricingRoute = createRoute({
  getParentRoute: () => staffRootRoute,
  path: '/staff/pricing',
  component: StaffPricing,
});

const customerRouteTree = rootRoute.addChildren([
  indexRoute,
  pricingRoute,
  reservationRoute,
  dropOffRoute,
  pickupRoute,
  contactRoute,
  staffLoginRoute,
]);

const staffRouteTree = staffRootRoute.addChildren([
  staffDashboardRoute,
  staffReservationsRoute,
  staffDropOffPickupRoute,
  staffContactMessagesRoute,
  staffPricingRoute,
]);

const router = createRouter({ 
  routeTree: customerRouteTree,
});

const staffRouter = createRouter({
  routeTree: staffRouteTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router | typeof staffRouter;
  }
}

export default function App() {
  const isStaffRoute = window.location.pathname.startsWith('/staff');

  return (
    <ThemeProvider attribute="class" defaultTheme={isStaffRoute ? 'light' : 'dark'} enableSystem={false}>
      <RouterProvider router={isStaffRoute ? staffRouter : router} />
    </ThemeProvider>
  );
}
