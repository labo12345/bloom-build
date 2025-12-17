import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SectionHeader from "@/components/SectionHeader";
import FloralDivider from "@/components/FloralDivider";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
  category: string;
}

const categories = [
  { id: "all", label: "All" },
  { id: "living-room", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "office", label: "Office" },
  { id: "outdoor", label: "Outdoor" },
];

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const images = filteredItems.filter(item => item.media_type === "image");
  const videos = filteredItems.filter(item => item.media_type === "video");

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute top-10 left-10 w-24 h-24 opacity-40 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50 5 C60 25, 80 25, 85 45 C90 65, 70 75, 50 95 C30 75, 10 65, 15 45 C20 25, 40 25, 50 5" fill="hsl(348 52% 92%)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <span className="inline-block px-4 py-1.5 bg-blush text-foreground text-sm font-medium rounded-full mb-4">
              Gallery
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
              Our Work in Pictures & Video
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse through our collection of completed projects and get inspired for your next interior transformation.
            </p>
          </div>
        </div>
      </section>

      <FloralDivider />

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-gold text-accent-foreground"
                    : "bg-blush text-foreground hover:bg-peach"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No items in this category yet.</p>
            </div>
          ) : (
            <Tabs defaultValue="images" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
                <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="images">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <img
                        src={item.media_url}
                        alt={item.title || "Gallery image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                          <p className="text-background font-medium">{item.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="videos">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((item, index) => (
                    <div
                      key={item.id}
                      className="group relative aspect-video overflow-hidden rounded-xl cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => setSelectedItem(item)}
                    >
                      <video
                        src={item.media_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-accent-foreground ml-1" />
                        </div>
                      </div>
                      {item.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
                          <p className="text-background font-medium">{item.title}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-foreground border-none">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/20 hover:bg-background/40 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-background" />
          </button>
          {selectedItem?.media_type === "image" ? (
            <img
              src={selectedItem.media_url}
              alt={selectedItem.title || "Gallery image"}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          ) : selectedItem?.media_type === "video" ? (
            <video
              src={selectedItem.media_url}
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh]"
            />
          ) : null}
          {selectedItem?.title && (
            <div className="p-4 bg-foreground">
              <h3 className="text-background font-display text-lg">{selectedItem.title}</h3>
              {selectedItem.description && (
                <p className="text-background/70 text-sm mt-1">{selectedItem.description}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
