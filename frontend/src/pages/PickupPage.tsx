import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGetPickupStatus } from '@/hooks/useQueries';
import { Search, CheckCircle2, CreditCard, Package } from 'lucide-react';

export default function PickupPage() {
  const [reservationId, setReservationId] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [pickupStatus, setPickupStatus] = useState<any>(null);

  const getPickupStatus = useGetPickupStatus(reservationId);

  const handleVerify = async () => {
    const result = await getPickupStatus.refetch();
    if (result.data) {
      setPickupStatus(result.data);
      setVerified(true);
    }
  };

  const handlePayPal = () => {
    // In a real implementation, this would integrate with PayPal
    window.open('https://www.paypal.com', '_blank');
  };

  const handleConfirmPickup = () => {
    alert('Pickup confirmed! Thank you for choosing Chef KnifeWorks.');
    window.location.reload();
  };

  if (verified && pickupStatus) {
    return (
      <div className="w-full py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Package className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl">Your Order is Ready!</CardTitle>
              <CardDescription>Review your order details and payment status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reservation ID:</span>
                  <span className="font-semibold">{pickupStatus.reservationId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge
                    variant={
                      pickupStatus.paymentStatus === 'paid' ? 'default' : 'destructive'
                    }
                  >
                    {pickupStatus.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pickup Status:</span>
                  <Badge variant={pickupStatus.pickupConfirmed ? 'default' : 'outline'}>
                    {pickupStatus.pickupConfirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>
              </div>

              {pickupStatus.paymentStatus !== 'paid' && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Required
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please complete your payment before picking up your knives.
                    </p>
                    <Button onClick={handlePayPal} className="w-full">
                      Pay with PayPal
                    </Button>
                  </CardContent>
                </Card>
              )}

              {pickupStatus.paymentStatus === 'paid' && !pickupStatus.pickupConfirmed && (
                <Card className="border-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Ready for Pickup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your knives are ready! Please confirm when you've picked them up.
                    </p>
                    <Button onClick={handleConfirmPickup} className="w-full">
                      Confirm Pickup
                    </Button>
                  </CardContent>
                </Card>
              )}

              {pickupStatus.pickupConfirmed && (
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold">Thank you for your business!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    We hope to serve you again soon.
                  </p>
                </div>
              )}

              <Button variant="outline" onClick={() => setVerified(false)} className="w-full">
                Check Another Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Pickup Portal</h1>
          <p className="text-xl text-muted-foreground">
            Verify your order and complete payment
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Verify Your Order
            </CardTitle>
            <CardDescription>Enter your reservation details to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="reservation-id">Reservation ID</Label>
              <Input
                id="reservation-id"
                placeholder="RES-1234567890-123"
                value={reservationId}
                onChange={(e) => setReservationId(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              onClick={handleVerify}
              disabled={!reservationId || !email || getPickupStatus.isFetching}
              className="w-full"
            >
              {getPickupStatus.isFetching ? 'Verifying...' : 'Verify Order'}
            </Button>

            {getPickupStatus.isError && (
              <div className="text-sm text-destructive text-center">
                Order not found. Please check your information and try again.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
