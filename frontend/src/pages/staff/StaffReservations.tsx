import { useState } from 'react';
import { useGetAllReservations, useUpdateReservationStatus } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Reservation } from '@/backend';
import { toast } from 'sonner';

export default function StaffReservations() {
  const { data: reservations, isLoading } = useGetAllReservations();
  const updateStatus = useUpdateReservationStatus();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenDialog = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setNewStatus(reservation.status);
    setNotes(reservation.notes);
    setDialogOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedReservation) return;

    try {
      await updateStatus.mutateAsync({
        id: selectedReservation.id,
        status: newStatus,
        notes,
      });
      toast.success('Reservation updated successfully');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update reservation');
      console.error(error);
    }
  };

  const filteredReservations = reservations?.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.contactInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedReservations = [...filteredReservations].sort((a, b) => 
    Number(b.createdAt) - Number(a.createdAt)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reservation Management</h1>
        <p className="text-muted-foreground">View and manage customer reservations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>Click on a reservation to view details and update status</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, contact, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sortedReservations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No reservations found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.customerName}</TableCell>
                      <TableCell>{reservation.contactInfo}</TableCell>
                      <TableCell>{reservation.date}</TableCell>
                      <TableCell>{reservation.timeSlot}</TableCell>
                      <TableCell>
                        <Badge variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}>
                          {reservation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(reservation)}
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

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>View and update reservation information</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReservation.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Contact Info</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReservation.contactInfo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReservation.date}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time Slot</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReservation.timeSlot}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Reservation ID</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedReservation.id}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this reservation..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? 'Updating...' : 'Update Reservation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
