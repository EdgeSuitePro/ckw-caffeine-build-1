import { useState, useMemo, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { useCreateReservation } from '@/hooks/useQueries';
import { CheckCircle2, Calendar as CalendarIcon, Clock, User, Sunrise, Sun, Moon, Loader2, AlertCircle } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { toast } from 'sonner';

// Helper function to get current time in CST
function getCurrentCSTTime(): Date {
  const now = new Date();
  // Convert to CST (UTC-6)
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const cstTime = new Date(utcTime + (3600000 * -6));
  return cstTime;
}

// Helper function to convert 24-hour time to 12-hour format with AM/PM
function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Helper function to check if a time slot is in the past for CST
function isTimeSlotPast(date: Date, timeSlot: string): boolean {
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotDate = new Date(date);
  slotDate.setHours(hours, minutes, 0, 0);
  
  const currentCSTTime = getCurrentCSTTime();
  
  return slotDate < currentCSTTime;
}

// Helper function to get end time for a slot
function getEndTime(startTime: string): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const endDate = new Date();
  endDate.setHours(hours, minutes + 30);
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes();
  return `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
}

export default function ReservationPage() {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  const createReservation = useCreateReservation();

  // Time slots organized by period
  const timeSlotsByPeriod = {
    morning: [
      '8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'
    ],
    midday: [
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'
    ],
    evening: [
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'
    ]
  };

  // Filter time slots based on selected date and current CST time
  const getAvailableSlots = (slots: string[]) => {
    if (!selectedDate) return slots;
    
    const currentCSTTime = getCurrentCSTTime();
    const isToday = isSameDay(selectedDate, currentCSTTime);
    
    if (!isToday) {
      return slots;
    }
    
    // Filter out past time slots for today
    return slots.filter(timeSlot => !isTimeSlotPast(selectedDate, timeSlot));
  };

  const availableMorningSlots = useMemo(() => getAvailableSlots(timeSlotsByPeriod.morning), [selectedDate]);
  const availableMiddaySlots = useMemo(() => getAvailableSlots(timeSlotsByPeriod.midday), [selectedDate]);
  const availableEveningSlots = useMemo(() => getAvailableSlots(timeSlotsByPeriod.evening), [selectedDate]);

  // Auto-progress to step 3 when time slot is selected
  useEffect(() => {
    if (selectedTime && step === 2) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(3);
        setIsTransitioning(false);
      }, 300);
    }
  }, [selectedTime, step]);

  // Auto-focus name input when step 3 appears
  useEffect(() => {
    if (step === 3 && nameInputRef.current) {
      // Small delay to ensure the transition completes
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 350);
    }
  }, [step]);

  const handleQuickDate = (days: number) => {
    const date = addDays(new Date(), days);
    setSelectedDate(date);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !customerName || !contactInfo) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = `RES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    try {
      await createReservation.mutateAsync({
        id,
        customerName: customerName.trim(),
        contactInfo: contactInfo.trim(),
        date: format(selectedDate, 'yyyy-MM-dd'),
        timeSlot: selectedTime,
        status: 'confirmed',
        createdAt: BigInt(Date.now()),
        notes: '',
        assignedStaff: undefined,
      });

      setReservationId(id);
      
      // Show success toast
      toast.success('Reservation confirmed successfully!');
      
      // Auto-progress to confirmation step
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(4);
        setIsTransitioning(false);
      }, 300);
    } catch (error) {
      console.error('Failed to create reservation:', error);
      toast.error('Failed to create reservation. Please try again.');
    }
  };

  const addToGoogleCalendar = () => {
    if (!selectedDate || !selectedTime) return;
    
    const startDateTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setMinutes(endDateTime.getMinutes() + 30);
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Chef+KnifeWorks+Appointment&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=Knife+sharpening+service+appointment+%28Reservation+ID:+${reservationId}%29&location=Chef+KnifeWorks,+123+Culinary+Lane,+San+Francisco,+CA+94102&ctz=America/Chicago`;
    
    window.open(url, '_blank');
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime('');
    setCustomerName('');
    setContactInfo('');
    setReservationId('');
    setIsTransitioning(false);
  };

  const TimeSlotButton = ({ time, disabled }: { time: string; disabled: boolean }) => {
    const isSelected = selectedTime === time;
    const endTime = getEndTime(time);
    
    return (
      <button
        onClick={() => !disabled && setSelectedTime(time)}
        disabled={disabled}
        className={`
          relative rounded-lg border transition-all duration-200
          px-4 py-3 text-left
          ${isSelected 
            ? 'bg-primary border-primary text-primary-foreground' 
            : 'bg-card border-border hover:border-primary/50'
          }
          ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <div className="text-base font-semibold">
          {formatTime12Hour(time)}
        </div>
        <div className={`text-xs mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          until {formatTime12Hour(endTime)}
        </div>
      </button>
    );
  };

  const TimePeriodSection = ({ 
    title, 
    icon: Icon, 
    slots 
  }: { 
    title: string; 
    icon: typeof Sunrise; 
    slots: string[];
  }) => {
    if (slots.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slots.map((time) => (
            <TimeSlotButton 
              key={time} 
              time={time} 
              disabled={selectedDate ? isTimeSlotPast(selectedDate, time) : false}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Reserve Your Spot</h1>
          <p className="text-xl text-muted-foreground">
            Book your knife sharpening appointment in just a few steps
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    s === step
                      ? 'bg-primary text-primary-foreground'
                      : s < step
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-6 w-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`w-12 h-1 transition-all duration-300 ${s < step ? 'bg-secondary' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Container with Fade Transition */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {/* Step 1: Date Selection */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Select a Date
                </CardTitle>
                <CardDescription>Choose when you'd like to drop off your knives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4"
                    onClick={() => handleQuickDate(0)}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Today</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(), 'MMM d')}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4"
                    onClick={() => handleQuickDate(1)}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Tomorrow</div>
                      <div className="text-sm text-muted-foreground">
                        {format(addDays(new Date(), 1), 'MMM d')}
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4"
                    onClick={() => {}}
                  >
                    <div className="text-center">
                      <div className="font-semibold">Pick a Date</div>
                      <div className="text-sm text-muted-foreground">Custom</div>
                    </div>
                  </Button>
                </div>

                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      if (date) setStep(2);
                    }}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Select a Time
                </CardTitle>
                <CardDescription>
                  Choose your preferred time slot on {selectedDate && format(selectedDate, 'MMMM d, yyyy')} (CST)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {availableMorningSlots.length === 0 && 
                 availableMiddaySlots.length === 0 && 
                 availableEveningSlots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No available time slots for today. Please select a different date.
                  </div>
                ) : (
                  <>
                    <TimePeriodSection 
                      title="Morning" 
                      icon={Sunrise} 
                      slots={availableMorningSlots}
                    />
                    <TimePeriodSection 
                      title="Midday" 
                      icon={Sun} 
                      slots={availableMiddaySlots}
                    />
                    <TimePeriodSection 
                      title="Evening" 
                      icon={Moon} 
                      slots={availableEveningSlots}
                    />
                  </>
                )}

                <div className="flex justify-start pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Customer Info */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <User className="mr-3 h-6 w-6" />
                  Your Information
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Please confirm your details so we can prepare your reservation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-medium">
                        Full Name
                      </Label>
                      <Input
                        ref={nameInputRef}
                        id="name"
                        placeholder="John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        disabled={createReservation.isPending}
                        className="h-11 reservation-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact" className="text-base font-medium">
                        Contact (Email or Phone)
                      </Label>
                      <Input
                        id="contact"
                        placeholder="john@example.com or (555) 123-4567"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        required
                        disabled={createReservation.isPending}
                        className="h-11 reservation-input"
                      />
                      <p className="text-sm text-muted-foreground">
                        Either email or phone is required for confirmation
                      </p>
                    </div>
                  </div>

                  {createReservation.isError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">Failed to create reservation. Please try again.</p>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => {
                        setStep(2);
                        setSelectedTime('');
                      }}
                      disabled={createReservation.isPending}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={!customerName.trim() || !contactInfo.trim() || createReservation.isPending}
                    >
                      {createReservation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        'Confirm Reservation'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card className="border-primary">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">Reservation Confirmed!</CardTitle>
                <CardDescription>Your appointment has been successfully booked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reservation ID:</span>
                    <span className="font-semibold">{reservationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">
                      {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{formatTime12Hour(selectedTime)} CST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-semibold">{customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span className="font-semibold">{contactInfo}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button onClick={addToGoogleCalendar} variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add to Google Calendar
                  </Button>
                  <Button onClick={resetForm} className="w-full">
                    Make Another Reservation
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground text-center space-y-2">
                  <p className="font-medium">Please save your Reservation ID: <span className="font-bold text-foreground">{reservationId}</span></p>
                  <p>You'll need it when dropping off and picking up your knives.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
