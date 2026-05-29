# Chef KnifeWorks   Premium Knife Sharpening Service Website & Staff CRM

## Overview
A comprehensive system for Chef KnifeWorks featuring both a customer-facing website and a staff-facing CRM application. The customer website maintains a sophisticated dark theme with warm metallic accents, while the staff CRM uses a clean off-white theme for optimal readability during daily operations.

## Customer Website Design Requirements
- Dark theme with warm metallic color palette: Honed Sage (#8B9A88), Damascus Bronze (#c8754e), Carbon Black (#2C2C2C), Steel Gray (#4A5557), Whetstone Cream (#F5F3ED)
- Typography: 'Della Respira' for headlines, 'Montserrat' for body text
- Minimalist layout emphasizing typography and whitespace
- Fully responsive design for mobile and desktop
- Polished transitions and hover animations
- Modular card components in Steel Gray
- Damascus Bronze (#c8754e) used consistently for buttons, highlights, and accent text across all pages

## Staff CRM Design Requirements
- Light theme with off-white backgrounds and Carbon Black (#2C2C2C) text for optimal readability
- Same typography: 'Della Respira' for headlines, 'Montserrat' for body text
- Damascus Bronze (#c8754e) for highlights, buttons, and accent elements
- Honed Sage (#8B9A88) for secondary accents and subtle elements
- Clean, professional layout optimized for desktop use but mobile-friendly
- Responsive design with focus on data tables and forms

## Customer Website Navigation Structure
- Clean top navigation bar containing only: Home, Pricing, Reservations, Contact
- Static bottom action bar positioned at the bottom of the viewport containing:
  - "Check-In" button navigating to Drop-Off page
  - "Pickup" button navigating to Pickup page
- Bottom action bar specifications:
  - Carbon Black (#2C2C2C) background
  - Damascus Bronze (#c8754e) buttons with Whetstone Cream (#F5F3ED) text and clean iconography
  - Fixed positioning at bottom of viewport, sitting above footer content when present
  - Full width on mobile, compact inset styling on desktop for responsiveness
  - Maintains visual separation from footer content

## Staff CRM Navigation Structure
- Persistent top navigation bar with: Dashboard, Reservations, Drop-Off & Pickup, Messages, Pricing
- User profile dropdown with logout option and role indicator showing current user's access level
- Internet Identity authentication integration

## Customer Website Pages and Features

### Homepage
- Full-screen hero section with Carbon Black (#2C2C2C) solid background color, no background graphics or images
- Hero section occupies full viewport height (100vh) with responsive alignment
- All hero text, buttons, and call-to-action elements use Whetstone Cream (#F5F3ED) for optimal contrast and readability
- Minimalist design with no graphics or gradients in the hero section
- Value proposition section displaying key service features in a grid layout with icons
- "Knife Journey" visual timeline showing the service process steps
- Gift card promotion banner
- Footer containing contact information, business address, and navigation links
- Consistent visual harmony throughout homepage sections ensuring readability and premium aesthetic with Carbon Black backgrounds and Whetstone Cream text where appropriate

### Pricing Page
- Purely informational display with no buttons or interactive elements
- Three main service tiers displayed as descriptive sections:
  - **Core Essentials — $12 per knife**: For Home Cooks & Everyday Kitchens with bullet points covering precision machine sharpening, minor chip repair, micro-straightening, satin finish, light rust removal, ideal for German steel and household knives
  - **Premium — $25 per knife**: For Culinary Professionals & Enthusiasts with bullet points covering pro-grade Tormek sharpening, enhanced alignment, moderate repairs, tip reshaping, brushed satin finish, ideal for busy chefs and food service
  - **Specialty — $40 per knife**: For High-End Japanese Blades & Collectors with bullet points covering whetstone/CBN progression, edge restoration, thinning, geometry enhancement, high-performance tuning, rust removal, ideal for SG2, Aogami, Shirogami steels
- Volume Discounts section at bottom with subtle styling using smaller typography and muted Honed Sage accent
- Volume discount tiers: 5+ knives (10% off), 10+ knives (15% off), 15+ knives (20% off)
- Note that discounts are applied automatically after inspection
- Maintains Carbon Black background with Whetstone Cream text and consistent typography hierarchy

### Reservation System
Multi-step reservation wizard with progress indicators and seamless auto-progression:
- Step 1: Date selection (Today/Tomorrow/Specific date options)
- Step 2: Time slot selection with grouped interface organized by time periods:
  - **Morning** section (sunrise icon) displaying slots from 8:00 AM to 11:30 AM
  - **Midday** section (sun icon) displaying slots from 12:00 PM to 3:30 PM  
  - **Evening** section (moon icon) displaying slots from 4:00 PM to 6:30 PM
  - Each time slot displayed as rounded rectangular button/card with Carbon Black background and Whetstone Cream text
  - Time format: 12-hour with capitalized AM/PM (e.g., "8:00 AM")
  - Subtext showing duration (e.g., "until 8:30 AM") in smaller, muted text
  - Selected slot highlighted with Damascus Bronze (#c8754e) background
  - Responsive grid layout with horizontal wrapping for mobile and desktop
  - Smooth hover transitions and visual feedback
  - When "Today" is selected, exclude time slots that have already passed based on current CST time
  - 30-minute intervals using Central Standard Time (CST)
  - **Automatic progression**: When a time slot is selected, the interface automatically transitions to the next step without requiring a manual button press and without any intermediate clicks or redundant UI remaining visible
- Step 3: Customer information collection form with enhanced UI:
  - Header: **"Please confirm your details so we can prepare your reservation."**
  - Field labels: **"Full Name"** and **"Contact (Email or Phone)"**
  - Contact field accepts either email or phone number with hint text indicating one is required
  - Automatic cursor focus to the first input field when the section appears
  - Input field styling with Carbon Black (#2C2C2C) borders using thin, lightweight outline
  - Focus states with subtle Whetstone Cream glow for high contrast
  - Improved spacing and typography hierarchy for premium aesthetic
  - Smooth transitions (fade or slide effects) between steps
  - **Confirm Reservation button functionality**: 
    - Validates form fields before submission
    - Shows loading spinner during backend submission
    - Calls backend `createReservation` method with all required data (name, contact, time slot, date)
    - Displays error messages if submission fails
    - **Automatic progression**: Upon successful form submission, automatically proceed to confirmation step
- Step 4: Confirmation screen with reservation details display:
  - Shows complete reservation information (date, time, customer name, contact)
  - "Add to Calendar" button for Google Calendar integration
  - Success message confirming reservation completion
  - Maintains premium dark theme styling
- Real-time form validation throughout the process
- Visual calendar component for date selection
- Loading states and error handling for all form submissions

### Drop-Off Lookup System
- Search functionality using Reservation ID, Phone number, or Email address
- Photo upload capability for knife documentation
- Quantity verification step for dropped-off items
- Confirmation receipt generation
- Offline capability with localStorage fallback for when internet is unavailable

### Pickup Portal
- Secure verification system using Reservation ID or Email
- Payment status display with PayPal integration
- Pickup confirmation screen with real-time status updates

### Contact Page
- Contact form with subject/topic categorization dropdown
- Business information section describing the shop model
- Interactive embedded map showing business location

## Staff CRM Application

### Authentication & Access Control
- Internet Identity integration for secure staff login at `/staff` route
- **Enhanced authentication flow with proper redirect handling**:
  - Authentication callback processing that correctly stores user role data and completes the login flow
  - **Immediate dashboard redirect**: Upon successful authentication and role verification, verified users (admin or staff) are automatically redirected to the dashboard view
  - **Clear loading states**: Display loading indicators and status messages during token validation and role verification processes
  - **Graceful error handling**: Failed authentications show user-facing error messages with retry/login button options
  - **No stuck redirect screens**: Eliminate scenarios where users remain on "Redirecting" screens after successful authentication
- Role-based access control with two levels: Admin and Staff
- Session persistence with automatic redirect for unauthorized users
- Role verification for protected features and pages
- Comprehensive error handling in StaffLayout and login components to display helpful messages when:
  - Authentication fails during the Internet Identity callback process
  - Role data fails to load or is unavailable
  - Network connectivity issues prevent proper authentication completion
- Error messages provide clear guidance for users experiencing authentication issues with actionable retry options

### Dashboard Overview
- Key metrics display: total reservations count, pending pickups count, new contact messages count
- Quick action buttons for common tasks
- Recent activity feed showing latest reservations and status changes
- Clean off-white theme with Carbon Black text for optimal readability

### Reservations Management
- Comprehensive searchable and sortable table listing all reservations with columns:
  - Customer name, date, time, status, assigned staff member
- Detailed view for each reservation showing:
  - Complete customer information and contact details
  - Selected time slot and service preferences
  - Current status with update capability
  - Processing notes with edit functionality
- Status update controls for staff to modify reservation states
- Staff assignment functionality for workload distribution
- Search and filter capabilities by date range, status, or customer

### Drop-Off & Pickup Management
- **Drop-Off Management Tab**:
  - View uploaded knife photos and documentation
  - Quantity verification with actual vs. expected counts
  - Verification toggle to confirm items received
  - Update button to save changes and progress status
- **Pickup Management Tab**:
  - List of reservation-linked pickups with payment status tracking
  - Payment verification through PayPal integration status
  - Confirm pickup button to complete the service cycle
  - Customer notification system for pickup readiness

### Contact Message Management
- Inbox view displaying all received contact messages
- Category filters for efficient message sorting
- Individual message detail view with full content
- Mark as "Handled" toggle functionality to track response status
- Response tracking and follow-up reminders

### Pricing Management
- Editable service pricing panel for all three tiers:
  - Core Essentials pricing and service details
  - Premium service pricing and features
  - Specialty service pricing and capabilities
- Volume discount configuration:
  - Editable discount percentages for 5+, 10+, 15+ knife tiers
  - Automatic application settings
- Save-to-backend synchronization for all pricing changes
- Add-on services and pricing management
- Price history tracking for administrative oversight

## Backend Data Storage
The backend must store:
- Customer reservations with date, time, and contact information
- Drop-off records with photos and item quantities
- Pickup status and payment information
- Contact form submissions with categorization
- Service pricing and availability data
- Staff user accounts with role assignments and permissions
- Authentication sessions and access tokens
- Revenue tracking and metrics data
- Staff activity logs and reservation assignments

## Backend Operations
- Create and manage customer reservations through `createReservation` method
- Process drop-off documentation and photo uploads
- Handle pickup verification and status updates
- Store and retrieve contact form submissions
- Manage service availability and scheduling
- Integration with Google Calendar for reservation confirmations
- PayPal payment processing integration
- Validate reservation data and return confirmation details
- **Enhanced Internet Identity authentication integration**:
  - Proper authentication callback handling that finalizes authentication and stores user role data
  - **Reliable role verification**: Backend methods to verify user roles and return authentication status
  - **Session management**: Maintain authentication state and provide clear success/failure responses
  - **Error recovery**: Handle authentication failures gracefully and provide actionable error responses
- Role-based permission verification for CRM features
- Staff user management and role assignment
- Metrics calculation and dashboard data aggregation
- Pricing management with update capabilities
- Activity logging and audit trail maintenance
- Comprehensive error handling and recovery for authentication failures with detailed response codes
