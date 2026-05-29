import { useState } from 'react';
import { useGetAllDropOffRecords, useVerifyDropOff, useGetAllPickupStatuses, useUpdatePickupStatus } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { DropOffRecord, PickupStatus } from '@/backend';
import { toast } from 'sonner';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function StaffDropOffPickup() {
  const { data: dropOffs, isLoading: dropOffsLoading } = useGetAllDropOffRecords();
  const { data: pickups, isLoading: pickupsLoading } = useGetAllPickupStatuses();
  const verifyDropOff = useVerifyDropOff();
  const updatePickup = useUpdatePickupStatus();

  const [selectedDropOff, setSelectedDropOff] = useState<DropOffRecord | null>(null);
  const [dropOffDialogOpen, setDropOffDialogOpen] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState(false);

  const handleOpenDropOffDialog = (dropOff: DropOffRecord) => {
    setSelectedDropOff(dropOff);
    setVerifiedStatus(dropOff.verified);
    setDropOffDialogOpen(true);
  };

  const handleVerifyDropOff = async () => {
    if (!selectedDropOff) return;

    try {
      await verifyDropOff.mutateAsync({
        reservationId: selectedDropOff.reservationId,
        verified: verifiedStatus,
      });
      toast.success('Drop-off updated successfully');
      setDropOffDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update drop-off');
      console.error(error);
    }
  };

  const handleConfirmPickup = async (pickup: PickupStatus) => {
    try {
      await updatePickup.mutateAsync({
        ...pickup,
        pickupConfirmed: true,
      });
      toast.success('Pickup confirmed successfully');
    } catch (error) {
      toast.error('Failed to confirm pickup');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Drop-Offs & Pickups</h1>
        <p className="text-muted-foreground">Manage knife drop-offs and customer pickups</p>
      </div>

      <Tabs defaultValue="dropoffs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dropoffs">Drop-Offs</TabsTrigger>
          <TabsTrigger value="pickups">Pickups</TabsTrigger>
        </TabsList>

        <TabsContent value="dropoffs">
          <Card>
            <CardHeader>
              <CardTitle>Drop-Off Records</CardTitle>
              <CardDescription>View and verify customer drop-offs</CardDescription>
            </CardHeader>
            <CardContent>
              {dropOffsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : !dropOffs || dropOffs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No drop-off records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reservation ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dropOffs.map((dropOff) => (
                        <TableRow key={dropOff.reservationId}>
                          <TableCell className="font-mono text-sm">{dropOff.reservationId}</TableCell>
                          <TableCell>{dropOff.customerName}</TableCell>
                          <TableCell>{dropOff.contactInfo}</TableCell>
                          <TableCell>{Number(dropOff.quantity)}</TableCell>
                          <TableCell>
                            {dropOff.verified ? (
                              <Badge variant="default" className="flex items-center gap-1 w-fit">
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <XCircle className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDropOffDialog(dropOff)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pickups">
          <Card>
            <CardHeader>
              <CardTitle>Pickup Records</CardTitle>
              <CardDescription>Manage customer pickups and payment status</CardDescription>
            </CardHeader>
            <CardContent>
              {pickupsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : !pickups || pickups.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pickup records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reservation ID</TableHead>
                        <TableHead>Payment Status</TableHead>
                        <TableHead>Pickup Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pickups.map((pickup) => (
                        <TableRow key={pickup.reservationId}>
                          <TableCell className="font-mono text-sm">{pickup.reservationId}</TableCell>
                          <TableCell>
                            <Badge variant={pickup.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                              {pickup.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {pickup.pickupConfirmed ? (
                              <Badge variant="default" className="flex items-center gap-1 w-fit">
                                <CheckCircle2 className="h-3 w-3" />
                                Confirmed
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <XCircle className="h-3 w-3" />
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmPickup(pickup)}
                              disabled={pickup.pickupConfirmed || updatePickup.isPending}
                            >
                              {pickup.pickupConfirmed ? 'Confirmed' : 'Confirm Pickup'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Drop-Off Detail Dialog */}
      <Dialog open={dropOffDialogOpen} onOpenChange={setDropOffDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Drop-Off Details</DialogTitle>
            <DialogDescription>View and verify drop-off information</DialogDescription>
          </DialogHeader>
          {selectedDropOff && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Reservation ID</Label>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">{selectedDropOff.reservationId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDropOff.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Info</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDropOff.contactInfo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Quantity</Label>
                  <p className="text-sm text-muted-foreground mt-1">{Number(selectedDropOff.quantity)} knives</p>
                </div>
              </div>

              {selectedDropOff.photo && (
                <div>
                  <Label className="text-sm font-medium">Photo</Label>
                  <img
                    src={selectedDropOff.photo.getDirectURL()}
                    alt="Drop-off photo"
                    className="mt-2 rounded-lg border max-h-64 object-contain"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="verified"
                  checked={verifiedStatus}
                  onCheckedChange={setVerifiedStatus}
                />
                <Label htmlFor="verified">Mark as verified</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setDropOffDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleVerifyDropOff} disabled={verifyDropOff.isPending}>
                  {verifyDropOff.isPending ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
