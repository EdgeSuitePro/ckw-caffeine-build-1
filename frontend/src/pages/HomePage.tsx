import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Clock, Shield, Award, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Expert Craftsmanship',
      description: 'Professional sharpening by certified blade specialists',
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Same-day service available for most knife types',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Fully insured handling with photo documentation',
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: '100% satisfaction guaranteed or your money back',
    },
  ];

  const journeySteps = [
    {
      step: '01',
      title: 'Reserve Online',
      description: 'Book your preferred time slot in seconds',
    },
    {
      step: '02',
      title: 'Drop Off',
      description: 'Bring your knives to our secure facility',
    },
    {
      step: '03',
      title: 'Expert Service',
      description: 'We sharpen with precision and care',
    },
    {
      step: '04',
      title: 'Pick Up',
      description: 'Collect your razor-sharp knives',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#2C2C2C' }}
      >
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance text-[#F5F3ED]">
            Precision Sharpening for
            <span className="block text-[#c8754e] mt-2">Culinary Excellence</span>
          </h1>
          <p className="text-xl sm:text-2xl text-[#F5F3ED]/80 mb-8 max-w-2xl mx-auto">
            Professional knife sharpening service trusted by chefs and home cooks alike
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 bg-[#c8754e] hover:bg-[#c8754e]/90 text-[#F5F3ED]">
              <Link to="/reservation">
                Book Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 border-[#F5F3ED] text-[#F5F3ED] hover:bg-[#F5F3ED] hover:text-[#2C2C2C]"
            >
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Chef KnifeWorks</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference of professional knife care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="pt-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Knife Journey Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Your Knife Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From dull to razor-sharp in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 border-2 border-primary">
                    <span className="text-3xl font-bold text-primary">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Card Banner */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <img
                src="/assets/generated/gift-card.dim_400x250.jpg"
                alt="Gift Card"
                className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-4">Give the Gift of Sharp</h2>
              <p className="text-xl text-muted-foreground mb-6">
                Perfect for the chef in your life. Gift cards available in any amount.
              </p>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/contact">
                  Learn More <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your appointment today and discover what truly sharp knives feel like
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/reservation">
              Reserve Your Spot <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

