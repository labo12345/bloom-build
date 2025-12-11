import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MessageSquare, Palette, Hammer, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  {
    icon: Calendar,
    title: "Book Consultation",
    description: "Schedule a convenient time for your free consultation with our design experts.",
  },
  {
    icon: MessageSquare,
    title: "Discuss Your Vision",
    description: "Share your ideas, preferences, and requirements during our in-depth discussion.",
  },
  {
    icon: Palette,
    title: "Receive Design Proposal",
    description: "Get a customized design concept and detailed quotation for your project.",
  },
  {
    icon: Hammer,
    title: "Project Execution",
    description: "Our skilled team brings your vision to life with precision and care.",
  },
  {
    icon: CheckCircle,
    title: "Final Walkthrough",
    description: "Review the completed project and enjoy your transformed space.",
  },
];

const Consultancy = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    projectType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("consultation_requests").insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.preferredDate,
        project_type: formData.projectType,
        message: formData.message || null,
      });
      if (error) throw error;
      toast({
        title: "Consultation Request Received!",
        description: "We'll contact you within 24 hours to confirm your appointment.",
      });
      setFormData({ name: "", email: "", phone: "", preferredDate: "", projectType: "", message: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-50 pointer-events-none">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <path d="M60 10 C70 30, 90 30, 90 50 C90 70, 70 70, 60 90 C50 70, 30 70, 30 50 C30 30, 50 30, 60 10" fill="hsl(25 75% 95%)" />
            <circle cx="60" cy="50" r="10" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              Consultancy
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Book Your Free Consultation
            </h1>
            <p className="text-lg text-muted-foreground">
              Take the first step towards your dream interior. Our experts are ready to guide 
              you through every aspect of your project.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Our Process"
            title="How It Works"
            subtitle="A simple, streamlined process to bring your vision to life"
          />

          <div className="relative mt-12">
            {/* Connection line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-blush -translate-y-1/2" />
            
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative text-center animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative z-10 w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
                    <step.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-blush rounded-full flex items-center justify-center text-xs font-bold text-foreground">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Booking Form */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
                Schedule Now
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Request Your Consultation
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-background rounded-2xl p-8 shadow-card space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="border-border focus:border-gold focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="border-border focus:border-gold focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (234) 567-890"
                    required
                    className="border-border focus:border-gold focus:ring-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred Date *
                  </label>
                  <Input
                    name="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    className="border-border focus:border-gold focus:ring-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Type *
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                  className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground focus:border-gold focus:ring-gold focus:outline-none"
                >
                  <option value="">Select a service</option>
                  <option value="ceiling">Ceiling Design</option>
                  <option value="cabinetry">Custom Cabinetry</option>
                  <option value="walls">Walls & Décor</option>
                  <option value="floors">Flooring Solutions</option>
                  <option value="full">Full Interior Renovation</option>
                  <option value="consultation">Design Consultation Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Project Details
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, ideas, and any specific requirements..."
                  rows={5}
                  className="border-border focus:border-gold focus:ring-gold resize-none"
                />
              </div>

              <Button variant="gold" size="xl" type="submit" className="w-full">
                Book My Consultation
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Consultancy;
