import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetReservation, useCreateDropOffRecord } from '@/hooks/useQueries';
import { Search, Upload, CheckCircle2, Camera } from 'lucide-react';
import { ExternalBlob } from '@/backend';

export default function DropOffPage() {
  const [searchType, setSearchType] = useState<'id' | 'phone' | 'email'>('id');
  const [searchValue, setSearchValue] = useState('');
  const [reservation, setReservation] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);

  const getReservation = useGetReservation(searchValue);
  const createDropOff = useCreateDropOffRecord();

  const handleSearch = async () => {
    const result = await getReservation.refetch();
    if (result.data) {
      setReservation(result.data);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!reservation || !quantity) return;

    let photoBlob: ExternalBlob | undefined;
    if (photoFile) {
      const arrayBuffer = await photoFile.arrayBuffer();
      photoBlob = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
    }

    await createDropOff.mutateAsync({
      reservationId: reservation.id,
      customerName: reservation.customerName,
      contactInfo: reservation.contactInfo,
      photo: photoBlob,
      quantity: BigInt(quantity),
      verified: true,
      timestamp: BigInt(Date.now()),
    });

    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <div className="w-full py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="border-primary">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
              <CardTitle className="text-2xl">Drop-Off Confirmed!</CardTitle>
              <CardDescription>Your knives have been successfully logged</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted rounded-lg p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reservation ID:</span>
                  <span className="font-semibold">{reservation.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-semibold">{quantity} knives</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-primary">In Progress</span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                We'll notify you when your knives are ready for pickup. Expected turnaround: 2-3 business days.
              </div>

              <Button onClick={() => window.location.reload()} className="w-full">
                Process Another Drop-Off
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Drop-Off Lookup</h1>
          <p className="text-xl text-muted-foreground">
            Find your reservation and document your knives
          </p>
        </div>

        {!reservation ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Find Your Reservation
              </CardTitle>
              <CardDescription>Search using your reservation details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="id">Reservation ID</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                <TabsContent value="id" className="space-y-4">
                  <div>
                    <Label htmlFor="search-id">Reservation ID</Label>
                    <Input
                      id="search-id"
                      placeholder="RES-1234567890-123"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="phone" className="space-y-4">
                  <div>
                    <Label htmlFor="search-phone">Phone Number</Label>
                    <Input
                      id="search-phone"
                      placeholder="(555) 123-4567"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="search-email">Email Address</Label>
                    <Input
                      id="search-email"
                      type="email"
                      placeholder="john@example.com"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleSearch}
                disabled={!searchValue || getReservation.isFetching}
                className="w-full"
              >
                {getReservation.isFetching ? 'Searching...' : 'Search'}
              </Button>

              {getReservation.isError && (
                <div className="text-sm text-destructive text-center">
                  No reservation found. Please check your information and try again.
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reservation ID:</span>
                    <span className="font-semibold">{reservation.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-semibold">{reservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">{reservation.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{reservation.timeSlot}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Document Your Knives
                </CardTitle>
                <CardDescription>Upload a photo and confirm quantity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="quantity">Number of Knives</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="photo">Photo (Optional)</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </div>
                      )}
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setReservation(null)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!quantity || createDropOff.isPending}
                  >
                    {createDropOff.isPending ? 'Confirming...' : 'Confirm Drop-Off'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
