import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Users, Play, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

import heroImage from "@/assets/hero-interior.jpg";

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  video_url: string | null;
  is_leader: boolean | null;
}

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We pursue the highest standards in every project, ensuring exceptional quality in all our work.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "Our love for design drives us to create spaces that inspire and delight our clients.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work closely with our clients, turning their visions into beautifully realized spaces.",
  },
  {
    icon: Eye,
    title: "Innovation",
    description: "We embrace new ideas and techniques to deliver fresh, contemporary interior solutions.",
  },
];

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setTeamMembers(data);
    };
    fetchTeam();
  }, []);

  const leaders = teamMembers.filter((m) => m.is_leader);
  const staff = teamMembers.filter((m) => !m.is_leader);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 opacity-50 pointer-events-none">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <path d="M60 10 C70 30, 90 30, 90 50 C90 70, 70 70, 60 90 C50 70, 30 70, 30 50 C30 30, 50 30, 60 10" fill="hsl(348 52% 92%)" />
            <circle cx="60" cy="50" r="10" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              About Us
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Crafting Beautiful Spaces Since 2020
            </h1>
            <p className="text-lg text-muted-foreground">
              Beyond House Interior Construction & Consultancy has been transforming homes and 
              commercial spaces into stunning environments that reflect personality and purpose.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <img
                src={heroImage}
                alt="Our studio workspace"
                className="rounded-2xl shadow-card w-full h-[400px] object-cover"
              />
            </div>
            <div className="space-y-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <span className="inline-block px-4 py-1.5 bg-peach text-foreground text-sm font-medium rounded-full">
                Our Story
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
                A Journey of Passion & Design
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Beyond House was founded with a simple yet powerful vision: to create interior spaces 
                  that go beyond ordinary expectations. What started as a small consultancy has grown 
                  into a full-service interior construction company trusted by hundreds of clients.
                </p>
                <p>
                  Our team of skilled designers, craftsmen, and project managers work together to 
                  deliver spaces that are not only beautiful but also functional and sustainable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Leadership & Team Section */}
      {teamMembers.length > 0 && (
        <>
          <section className="py-20 bg-cream">
            <div className="container mx-auto px-4 lg:px-8">
              <SectionHeader
                badge="Our Team"
                title="Meet the People Behind Beyond House"
                subtitle="Our talented team of professionals dedicated to transforming your spaces"
              />

              {/* Leaders */}
              {leaders.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Leadership</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {leaders.map((member, index) => (
                      <div
                        key={member.id}
                        className="bg-background rounded-2xl overflow-hidden shadow-card animate-fade-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="relative aspect-square">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <User className="h-20 w-20 text-muted-foreground" />
                            </div>
                          )}
                          {member.video_url && (
                            <button
                              onClick={() => setSelectedVideo(member.video_url)}
                              className="absolute bottom-4 right-4 w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Play className="h-5 w-5 text-accent-foreground ml-0.5" />
                            </button>
                          )}
                        </div>
                        <div className="p-6 text-center">
                          <h4 className="font-display text-xl font-semibold text-foreground">{member.full_name}</h4>
                          <p className="text-gold font-medium">{member.role}</p>
                          {member.bio && <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff */}
              {staff.length > 0 && (
                <div className="mt-16">
                  <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Our Team</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {staff.map((member, index) => (
                      <div
                        key={member.id}
                        className="bg-background rounded-xl overflow-hidden shadow-card animate-fade-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="relative aspect-square">
                          {member.photo_url ? (
                            <img
                              src={member.photo_url}
                              alt={member.full_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <User className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          {member.video_url && (
                            <button
                              onClick={() => setSelectedVideo(member.video_url)}
                              className="absolute bottom-2 right-2 w-8 h-8 bg-gold rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Play className="h-3 w-3 text-accent-foreground ml-0.5" />
                            </button>
                          )}
                        </div>
                        <div className="p-4 text-center">
                          <h4 className="font-medium text-foreground">{member.full_name}</h4>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
          <FloralDivider />
        </>
      )}

      {/* Mission & Vision */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-background rounded-2xl p-8 shadow-card animate-fade-up">
              <div className="w-16 h-16 bg-blush rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To deliver exceptional interior construction and consultancy services that transform 
                spaces into inspiring environments. We are committed to quality craftsmanship, 
                innovative design, and client satisfaction in every project we undertake.
              </p>
            </div>

            <div className="bg-background rounded-2xl p-8 shadow-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 bg-peach rounded-full flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted interior construction consultancy, known for creating spaces 
                that exceed expectations and stand the test of time. We aspire to set new standards 
                in design excellence and customer experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <SectionHeader
            badge="Our Values"
            title="What Drives Us"
            subtitle="The core principles that guide everything we do"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="text-center p-6 bg-gradient-blush rounded-xl animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-background mb-6">
            Let&apos;s Create Something Beautiful Together
          </h2>
          <p className="text-background/80 text-lg mb-8 max-w-2xl mx-auto">
            Ready to start your interior transformation journey? Get in touch with our team today.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-foreground border-none">
          {selectedVideo && (
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default About;
