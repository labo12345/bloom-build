import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Lightbulb, Clock, Sparkles, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FloralDivider from "@/components/FloralDivider";

import heroImage from "@/assets/hero-interior.jpg";
import ceilingImg from "@/assets/service-ceiling.jpg";
import cabinetryImg from "@/assets/service-cabinetry.jpg";
import wallsImg from "@/assets/service-walls.jpg";
import floorsImg from "@/assets/service-floors.jpg";

const services = [
  {
    title: "Ceiling Design",
    description: "Elegant coffered, tray, and custom ceiling designs that add architectural depth to your spaces.",
    image: ceilingImg,
    href: "/services#ceiling",
  },
  {
    title: "Custom Cabinetry",
    description: "Bespoke cabinetry solutions crafted to perfection for kitchens, wardrobes, and storage spaces.",
    image: cabinetryImg,
    href: "/services#cabinetry",
  },
  {
    title: "Walls & Décor",
    description: "Transform your walls with premium finishes, wallpapers, moldings, and artistic accents.",
    image: wallsImg,
    href: "/services#walls",
  },
  {
    title: "Flooring Solutions",
    description: "Premium tiles, hardwood, and innovative flooring options to complete your interior vision.",
    image: floorsImg,
    href: "/services#floors",
  },
];

const whyChooseUs = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "We use only the finest materials and expert craftsmanship in every project.",
  },
  {
    icon: Lightbulb,
    title: "Creative Expertise",
    description: "Our designers bring innovative ideas that transform ordinary spaces into extraordinary ones.",
  },
  {
    icon: Sparkles,
    title: "Attention to Detail",
    description: "Every element is carefully considered to ensure a cohesive and stunning result.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description: "We respect your time and deliver projects within agreed timelines without compromising quality.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Homeowner",
    content: "Beyond House transformed our living room into a masterpiece. The ceiling design and custom cabinetry exceeded all our expectations. Highly recommended!",
    rating: 5,
  },
  {
    name: "James & Emily Richardson",
    role: "New Home Owners",
    content: "From the initial consultation to the final touches, the team was professional, creative, and attentive to our needs. Our home has never looked better.",
    rating: 5,
  },
  {
    name: "Michael Thompson",
    role: "Business Owner",
    content: "We hired Beyond House for our office renovation and the results were outstanding. The flooring and wall treatments created a perfect professional atmosphere.",
    rating: 5,
  },
];

const Index = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Floral corner decorations */}
        <div className="absolute top-0 left-0 w-40 h-40 opacity-60 pointer-events-none">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <path d="M0 0 Q40 20, 60 60 Q20 40, 0 0" fill="hsl(348 52% 92%)" />
            <path d="M20 0 Q50 30, 50 80 Q10 50, 20 0" fill="hsl(25 75% 95%)" />
            <circle cx="35" cy="35" r="8" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-60 pointer-events-none rotate-180">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <path d="M0 0 Q40 20, 60 60 Q20 40, 0 0" fill="hsl(348 52% 92%)" />
            <path d="M20 0 Q50 30, 50 80 Q10 50, 20 0" fill="hsl(25 75% 95%)" />
            <circle cx="35" cy="35" r="8" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text content */}
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full">
                  Interior Construction & Consultancy
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-tight">
                  Transforming Your Space{" "}
                  <span className="text-gradient-gold">Beyond Imagination</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  We create stunning interiors that reflect your unique style and elevate your living experience 
                  through premium construction and thoughtful design.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/services">
                    View Services
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/contact">Request a Quote</Link>
                </Button>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-hover">
                <img
                  src={heroImage}
                  alt="Elegant luxury interior living room with white and gold accents"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-card animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">10+ Years</p>
                    <p className="text-sm text-muted-foreground">Experience</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Services Section */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Our Services"
            title="What We Offer"
            subtitle="Comprehensive interior solutions tailored to transform every corner of your space"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {services.map((service, index) => (
              <Link
                key={service.title}
                to={service.href}
                className="group bg-background rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="gold" size="lg" asChild>
              <Link to="/services">
                Explore All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Why Us"
            title="Why Choose Beyond House"
            subtitle="We bring together expertise, creativity, and dedication to deliver exceptional results"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {whyChooseUs.map((item, index) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-xl bg-gradient-blush animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Portfolio Preview */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Portfolio"
            title="Our Recent Work"
            subtitle="Explore some of our latest interior transformations"
          />

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[ceilingImg, cabinetryImg, wallsImg].map((img, index) => (
              <div
                key={index}
                className="relative group rounded-xl overflow-hidden shadow-card animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={img}
                  alt={`Portfolio project ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center">
                  <Button
                    variant="hero"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    asChild
                  >
                    <Link to="/portfolio">View Project</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="heroOutline" size="lg" asChild>
              <Link to="/portfolio">
                View Full Portfolio
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Testimonials"
            title="What Our Clients Say"
            subtitle="Don't just take our word for it - hear from our satisfied clients"
          />

          <div className="max-w-3xl mx-auto mt-12">
            <div className="relative bg-gradient-blush rounded-2xl p-8 md:p-12">
              {/* Quote marks */}
              <div className="absolute top-4 left-4 text-gold/30 text-8xl font-display">"</div>
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                  ))}
                </div>
                
                <p className="text-lg md:text-xl text-foreground text-center leading-relaxed mb-8">
                  {testimonials[currentTestimonial].content}
                </p>
                
                <div className="text-center">
                  <p className="font-display text-lg font-semibold text-foreground">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-background shadow-soft hover:shadow-card transition-shadow"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentTestimonial ? "bg-gold" : "bg-foreground/20"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-background shadow-soft hover:shadow-card transition-shadow"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="80" fill="hsl(43 74% 52%)" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="60" fill="hsl(348 52% 92%)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-background mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-background/80 text-lg mb-8">
              Book a free consultation with our design experts and take the first step 
              towards your dream interior.
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

export default Index;
