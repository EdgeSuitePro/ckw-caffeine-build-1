import { useState, useEffect } from 'react';
import { useGetServicePricing, useUpdateServicePricing } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import type { ServicePricing } from '@/backend';

export default function StaffPricing() {
  const { data: pricing, isLoading } = useGetServicePricing();
  const updatePricing = useUpdateServicePricing();

  const [standard, setStandard] = useState('12');
  const [premium, setPremium] = useState('25');
  const [specialty, setSpecialty] = useState('40');
  const [discount5, setDiscount5] = useState('10');
  const [discount10, setDiscount10] = useState('15');
  const [discount15, setDiscount15] = useState('20');

  useEffect(() => {
    if (pricing) {
      setStandard(String(pricing.standard));
      setPremium(String(pricing.premium));
      setSpecialty(String(pricing.specialty));
      
      const discounts = pricing.volumeDiscounts;
      if (discounts.length >= 1) setDiscount5(String(discounts[0][1]));
      if (discounts.length >= 2) setDiscount10(String(discounts[1][1]));
      if (discounts.length >= 3) setDiscount15(String(discounts[2][1]));
    }
  }, [pricing]);

  const handleSave = async () => {
    try {
      const updatedPricing: ServicePricing = {
        standard: BigInt(standard),
        premium: BigInt(premium),
        specialty: BigInt(specialty),
        volumeDiscounts: [
          [BigInt(5), BigInt(discount5)],
          [BigInt(10), BigInt(discount10)],
          [BigInt(15), BigInt(discount15)],
        ],
        addOns: pricing?.addOns || [],
      };

      await updatePricing.mutateAsync(updatedPricing);
      toast.success('Pricing updated successfully');
    } catch (error) {
      toast.error('Failed to update pricing');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Pricing Management</h1>
        <p className="text-muted-foreground">Update service pricing and volume discounts (Admin only)</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Tiers</CardTitle>
              <CardDescription>Set pricing for each service level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="standard">Core Essentials ($)</Label>
                  <Input
                    id="standard"
                    type="number"
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    placeholder="12"
                  />
                  <p className="text-xs text-muted-foreground">For home cooks & everyday kitchens</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premium">Premium ($)</Label>
                  <Input
                    id="premium"
                    type="number"
                    value={premium}
                    onChange={(e) => setPremium(e.target.value)}
                    placeholder="25"
                  />
                  <p className="text-xs text-muted-foreground">For culinary professionals</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty ($)</Label>
                  <Input
                    id="specialty"
                    type="number"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="40"
                  />
                  <p className="text-xs text-muted-foreground">For high-end Japanese blades</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Volume Discounts</CardTitle>
              <CardDescription>Set discount percentages for bulk orders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount5">5+ Knives (%)</Label>
                  <Input
                    id="discount5"
                    type="number"
                    value={discount5}
                    onChange={(e) => setDiscount5(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount10">10+ Knives (%)</Label>
                  <Input
                    id="discount10"
                    type="number"
                    value={discount10}
                    onChange={(e) => setDiscount10(e.target.value)}
                    placeholder="15"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount15">15+ Knives (%)</Label>
                  <Input
                    id="discount15"
                    type="number"
                    value={discount15}
                    onChange={(e) => setDiscount15(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updatePricing.isPending} size="lg">
              {updatePricing.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
