import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Core Essentials',
      price: 12,
      subtitle: 'For Home Cooks & Everyday Kitchens',
      features: [
        'Precision machine sharpening',
        'Minor chip repair',
        'Micro-straightening of the edge',
        'Satin finish',
        'Light rust removal',
        'Ideal for German steel, household knives, and everyday culinary use',
      ],
    },
    {
      name: 'Premium',
      price: 25,
      subtitle: 'For Culinary Professionals & Enthusiasts',
      features: [
        'Pro-grade sharpening on Tormek + finishing refinement',
        'Enhanced alignment + deburring for longer sharpness',
        'Moderate repairs, tip reshaping, and geometry correction',
        'Brushed satin finish',
        'Ideal for busy chefs, food service environments, and daily use blades',
      ],
    },
    {
      name: 'Specialty',
      price: 40,
      subtitle: 'For High-End Japanese Blades & Collectors',
      features: [
        'Whetstone or CBN progression tailored to steel type',
        'Edge restoration, thinning, and geometry enhancement',
        'High-performance edge tuning',
        'Rust/spot removal and cosmetic touch-ups',
        'Ideal for SG2, Aogami, Shirogami, high-HRC steels, and heirloom blades',
      ],
    },
  ];

  const volumeDiscounts = [
    { quantity: '5+', discount: '10%' },
    { quantity: '10+', discount: '15%' },
    { quantity: '15+', discount: '20%' },
  ];

  return (
    <div className="w-full py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Service Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional knife sharpening tailored to your needs
          </p>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {tiers.map((tier, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                <div className="mt-2 mb-4">
                  <span className="text-5xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground ml-2">per knife</span>
                </div>
                <CardDescription className="text-base italic">{tier.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Volume Discounts */}
        <div className="max-w-3xl mx-auto">
          <Card className="border-border/30 bg-card/30">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-secondary">Volume Discounts Available</CardTitle>
              <CardDescription className="text-base mt-2">
                Make the most of your visit — bring your whole set.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {volumeDiscounts.map((discount, index) => (
                  <div key={index} className="text-center py-3">
                    <div className="text-3xl font-bold text-secondary mb-1">
                      {discount.discount}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {discount.quantity} knives
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-center text-muted-foreground italic mt-4">
                Discount applied automatically after inspection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
