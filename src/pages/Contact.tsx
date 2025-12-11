import { useState } from "react";
import Layout from "@/components/Layout";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (234) 567-890", "+1 (234) 567-891"],
    action: "tel:+1234567890",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["hello@beyondhouse.com", "support@beyondhouse.com"],
    action: "mailto:hello@beyondhouse.com",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["123 Design Avenue", "Interior District, City 10001"],
    action: null,
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
    action: null,
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll respond within 24 hours.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/1234567890?text=Hello! I'm interested in your interior design services.", "_blank");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 opacity-50 pointer-events-none -rotate-12">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <path d="M60 10 C70 30, 90 30, 90 50 C90 70, 70 70, 60 90 C50 70, 30 70, 30 50 C30 30, 50 30, 60 10" fill="hsl(348 52% 92%)" />
            <circle cx="60" cy="50" r="10" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              Contact Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Get In Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions or ready to start your project? We&apos;d love to hear from you. 
              Reach out through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div
                key={info.title}
                className="bg-gradient-blush rounded-xl p-6 text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {info.title}
                </h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-muted-foreground text-sm">
                    {info.action && i === 0 ? (
                      <a href={info.action} className="hover:text-gold transition-colors">
                        {detail}
                      </a>
                    ) : (
                      detail
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Contact Form & Map */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="animate-fade-up">
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
                  Send a Message
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  We&apos;re Here to Help
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and our team will get back to you within 24 hours.
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
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (234) 567-890"
                      className="border-border focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="border-border focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or inquiry..."
                    rows={5}
                    required
                    className="border-border focus:border-gold focus:ring-gold resize-none"
                  />
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button variant="gold" size="lg" type="submit" className="flex-1">
                    Send Message
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    type="button"
                    onClick={openWhatsApp}
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    WhatsApp
                  </Button>
                </div>
              </form>
            </div>

            {/* Map */}
            <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 bg-peach text-foreground text-sm font-medium rounded-full mb-4">
                  Visit Us
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                  Our Location
                </h2>
                <p className="text-muted-foreground">
                  Stop by our showroom to explore materials, discuss your project in person, 
                  and get inspired by our display spaces.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-card h-[400px] lg:h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986548248684!3d40.69714941932609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1635000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
