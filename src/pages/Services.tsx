import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string;
  features: string[];
  display_order: number;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      if (data) setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-50 pointer-events-none">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <path d="M60 10 C70 30, 90 30, 90 50 C90 70, 70 70, 60 90 C50 70, 30 70, 30 50 C30 30, 50 30, 60 10" fill="hsl(348 52% 92%)" />
            <circle cx="60" cy="50" r="10" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              Our Services
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Comprehensive Interior Solutions
            </h1>
            <p className="text-lg text-muted-foreground">
              From concept to completion, we offer a full range of interior construction and design services 
              to transform your space into something extraordinary.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Services List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
        </div>
      ) : (
        services.map((service, index) => (
          <section
            key={service.id}
            id={service.title.toLowerCase().replace(/\s+/g, "-")}
            className={`py-20 ${index % 2 === 1 ? "bg-cream" : ""}`}
          >
            <div className="container mx-auto px-4 lg:px-8">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                <div className={`animate-fade-up ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  </div>
                </div>

                <div className={`space-y-6 animate-fade-up ${index % 2 === 1 ? "lg:order-1" : ""}`} style={{ animationDelay: "0.2s" }}>
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
                      {service.subtitle || "Premium Service"}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button variant="gold" size="lg" asChild>
                    <Link to="/contact">
                      Get This Service
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        ))
      )}

      {/* CTA Section */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-background mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-background/80 text-lg mb-8">
              Book a free consultation with our design experts or contact us directly to discuss your interior transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link to="/consultancy">Book Consultation</Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-background/30 text-background hover:bg-background hover:text-foreground"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;