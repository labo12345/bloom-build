import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

import ceilingImg from "@/assets/service-ceiling.jpg";
import cabinetryImg from "@/assets/service-cabinetry.jpg";
import wallsImg from "@/assets/service-walls.jpg";
import floorsImg from "@/assets/service-floors.jpg";

const services = [
  {
    id: "ceiling",
    title: "Ceiling Design",
    subtitle: "Elevate Your Space from Above",
    description: "Our ceiling design services transform the often-overlooked fifth wall into a stunning architectural feature. From elegant coffered ceilings to modern tray designs, we create overhead masterpieces that add depth, character, and sophistication to any room.",
    image: ceilingImg,
    features: [
      "Coffered ceiling designs",
      "Tray and cove ceilings",
      "Decorative moldings and medallions",
      "Recessed lighting integration",
      "Acoustic ceiling solutions",
      "Custom artistic installations",
    ],
  },
  {
    id: "cabinetry",
    title: "Custom Cabinetry",
    subtitle: "Bespoke Storage Solutions",
    description: "Our custom cabinetry service delivers handcrafted storage solutions tailored to your exact specifications. Whether it's a dream kitchen, elegant wardrobe, or functional home office, we create cabinetry that combines beauty with practicality.",
    image: cabinetryImg,
    features: [
      "Kitchen cabinets & islands",
      "Walk-in wardrobes",
      "Built-in entertainment units",
      "Bathroom vanities",
      "Home office solutions",
      "Custom pantry systems",
    ],
  },
  {
    id: "walls",
    title: "Walls & Décor",
    subtitle: "Transform Your Vertical Canvas",
    description: "Walls are the backdrop of your life, and we help you make them extraordinary. From luxurious wallpapers and textured finishes to elegant moldings and wainscoting, our wall treatments create spaces that tell your unique story.",
    image: wallsImg,
    features: [
      "Premium wallpaper installation",
      "Textured wall finishes",
      "Wainscoting & paneling",
      "Crown molding & trim work",
      "Accent wall designs",
      "Decorative painting techniques",
    ],
  },
  {
    id: "floors",
    title: "Flooring Solutions",
    subtitle: "Foundation of Elegance",
    description: "The right flooring sets the tone for your entire space. We offer comprehensive flooring solutions including premium hardwood, elegant tiles, and innovative materials that combine durability with stunning aesthetics.",
    image: floorsImg,
    features: [
      "Hardwood flooring installation",
      "Porcelain & ceramic tiles",
      "Natural stone flooring",
      "Herringbone & parquet patterns",
      "Waterproof vinyl solutions",
      "Heated flooring systems",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute bottom-0 left-0 w-40 h-40 opacity-50 pointer-events-none">
          <svg viewBox="0 0 160 160" className="w-full h-full">
            <path d="M80 20 C100 40, 120 40, 120 70 C120 100, 100 100, 80 130 C60 100, 40 100, 40 70 C40 40, 60 40, 80 20" fill="hsl(348 52% 92%)" />
            <circle cx="80" cy="70" r="12" fill="hsl(43 74% 52%)" opacity="0.6" />
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
              From concept to completion, we offer a full range of interior construction services 
              designed to transform your space into something extraordinary.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Services List */}
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 ${index % 2 === 1 ? "bg-cream" : ""}`}
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              {/* Image */}
              <div className={`animate-fade-up ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className={`space-y-6 animate-fade-up ${index % 2 === 1 ? "lg:order-1" : ""}`} style={{ animationDelay: "0.2s" }}>
                <div>
                  <span className="inline-block px-4 py-1.5 bg-peach text-foreground text-sm font-medium rounded-full mb-4">
                    {service.subtitle}
                  </span>
                  <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-accent-foreground" />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button variant="gold" size="lg" asChild>
                  <Link to="/contact">Get This Service</Link>
                </Button>
              </div>
            </div>
          </div>

          {index < services.length - 1 && <FloralDivider />}
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-background mb-6">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-background/80 text-lg mb-8 max-w-2xl mx-auto">
            Book a free consultation with our experts who will help you identify the best 
            solutions for your space and budget.
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
      </section>
    </Layout>
  );
};

export default Services;
