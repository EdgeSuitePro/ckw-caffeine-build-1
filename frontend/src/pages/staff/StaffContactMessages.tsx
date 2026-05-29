import { useState } from 'react';
import { useGetAllContactForms, useMarkContactFormHandled } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ContactFormSubmission } from '@/backend';
import { toast } from 'sonner';

export default function StaffContactMessages() {
  const { data: contactForms, isLoading } = useGetAllContactForms();
  const markHandled = useMarkContactFormHandled();
  const [selectedMessage, setSelectedMessage] = useState<ContactFormSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleOpenDialog = (message: ContactFormSubmission) => {
    setSelectedMessage(message);
    setDialogOpen(true);
  };

  const handleMarkHandled = async () => {
    if (!selectedMessage) return;

    try {
      await markHandled.mutateAsync(selectedMessage.id);
      toast.success('Message marked as handled');
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update message');
      console.error(error);
    }
  };

  const filteredMessages = contactForms?.filter(form => 
    categoryFilter === 'all' || form.category === categoryFilter
  ) || [];

  const sortedMessages = [...filteredMessages].sort((a, b) => 
    Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
        <p className="text-muted-foreground">View and manage customer inquiries</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>Click on a message to view details and mark as handled</CardDescription>
          <div className="mt-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="service">Service Question</SelectItem>
                <SelectItem value="pricing">Pricing</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : sortedMessages.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No messages found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMessages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell className="font-medium">{message.name}</TableCell>
                      <TableCell>{message.email}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{message.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {message.handled ? (
                          <Badge variant="default">Handled</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(message)}
                        >
                          View
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

      {/* Message Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>View and manage customer message</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subject</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.subject}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.category}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Message</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Badge variant={selectedMessage.handled ? 'default' : 'secondary'}>
                  {selectedMessage.handled ? 'Handled' : 'Pending'}
                </Badge>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  {!selectedMessage.handled && (
                    <Button onClick={handleMarkHandled} disabled={markHandled.isPending}>
                      {markHandled.isPending ? 'Updating...' : 'Mark as Handled'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
