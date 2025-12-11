import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X, MessageSquare, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  featured: boolean;
  created_at: string;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    featured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        role: item.role || "",
        content: item.content,
        rating: item.rating,
        featured: item.featured,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        rating: 5,
        featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.content) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("testimonials")
          .update(formData)
          .eq("id", editingItem.id);

        if (error) throw error;

        setTestimonials(testimonials.map(t => 
          t.id === editingItem.id ? { ...t, ...formData } : t
        ));

        toast({
          title: "Updated",
          description: "Testimonial has been updated",
        });
      } else {
        const { data, error } = await supabase
          .from("testimonials")
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        setTestimonials([data, ...testimonials]);

        toast({
          title: "Created",
          description: "Testimonial has been created",
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setTestimonials(testimonials.filter(t => t.id !== id));

      toast({
        title: "Deleted",
        description: "Testimonial has been deleted",
      });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (item: Testimonial) => {
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ featured: !item.featured })
        .eq("id", item.id);

      if (error) throw error;

      setTestimonials(testimonials.map(t => 
        t.id === item.id ? { ...t, featured: !t.featured } : t
      ));
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Testimonials</h1>
            <p className="text-muted-foreground">Manage client testimonials</p>
          </div>
          <Button variant="gold" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-xl shadow-card">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Button variant="gold" onClick={() => openModal()}>
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="bg-background rounded-xl shadow-card p-6 relative group">
                {item.featured && (
                  <div className="absolute top-4 right-4 bg-gold text-accent-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </div>
                )}
                
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < item.rating ? "text-gold fill-gold" : "text-muted"}`} 
                    />
                  ))}
                </div>

                <p className="text-foreground mb-4 line-clamp-4">&ldquo;{item.content}&rdquo;</p>

                <div className="mt-auto">
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.role && <p className="text-sm text-muted-foreground">{item.role}</p>}
                </div>

                <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => toggleFeatured(item)}
                    className={item.featured ? "text-gold" : ""}
                  >
                    <Star className={`h-4 w-4 ${item.featured ? "fill-current" : ""}`} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTestimonial(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-hover">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">
                  {editingItem ? "Edit Testimonial" : "Add Testimonial"}
                </h2>
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Client Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role/Title
                  </label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Homeowner"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Testimonial *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="What did they say about your service..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: num })}
                        className="p-1"
                      >
                        <Star 
                          className={`h-6 w-6 ${num <= formData.rating ? "text-gold fill-gold" : "text-muted"}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border"
                  />
                  <label htmlFor="featured" className="text-sm text-foreground">
                    Featured testimonial
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" type="button" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="gold" type="submit" className="flex-1">
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
