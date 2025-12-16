import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import FloralDivider from "@/components/FloralDivider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string | null;
  featured: boolean | null;
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        setPortfolioItems(data);
        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === "All" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute top-10 right-10 w-32 h-32 opacity-50 pointer-events-none rotate-45">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <path d="M60 10 C70 30, 90 30, 90 50 C90 70, 70 70, 60 90 C50 70, 30 70, 30 50 C30 30, 50 30, 60 10" fill="hsl(348 52% 92%)" />
            <circle cx="60" cy="50" r="10" fill="hsl(43 74% 52%)" opacity="0.6" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              Portfolio
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Our Recent Projects
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our portfolio of stunning interior transformations and see how we bring 
              our clients&apos; visions to life.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gold text-accent-foreground"
                    : "bg-blush text-foreground hover:bg-blush-deep"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No portfolio items found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative rounded-xl overflow-hidden shadow-card cursor-pointer animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedProject(item)}
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block px-3 py-1 bg-gold text-accent-foreground text-xs font-medium rounded-full mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-display text-xl font-semibold text-background">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-background rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-hover animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProject.image_url}
                alt={selectedProject.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-background rounded-full flex items-center justify-center shadow-card hover:shadow-hover transition-shadow"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-peach text-foreground text-sm font-medium rounded-full mb-3">
                {selectedProject.category}
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {selectedProject.description || "A stunning interior transformation by Beyond House."}
              </p>
              <Button variant="gold" size="lg" onClick={() => setSelectedProject(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-20 bg-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-background mb-6">
            Want Your Space Featured Here?
          </h2>
          <p className="text-background/80 text-lg mb-8 max-w-2xl mx-auto">
            Let us transform your space into a showcase-worthy interior. Start your project today.
          </p>
          <Button variant="gold" size="xl" asChild>
            <a href="/contact">Start Your Project</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;