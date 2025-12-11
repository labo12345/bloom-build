import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, X, Image, Star } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  image_url: string;
  featured: boolean;
  created_at: string;
}

const categories = ["Living Spaces", "Kitchen", "Bedrooms", "Bathrooms", "Commercial", "Entryways"];

const AdminPortfolio = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: categories[0],
    description: "",
    image_url: "",
    featured: false,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to load portfolio items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        category: item.category,
        description: item.description || "",
        image_url: item.image_url,
        featured: item.featured,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        category: categories[0],
        description: "",
        image_url: "",
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

    if (!formData.title || !formData.image_url) {
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
          .from("portfolio_items")
          .update(formData)
          .eq("id", editingItem.id);

        if (error) throw error;

        setItems(items.map(i => 
          i.id === editingItem.id ? { ...i, ...formData } : i
        ));

        toast({
          title: "Updated",
          description: "Portfolio item has been updated",
        });
      } else {
        const { data, error } = await supabase
          .from("portfolio_items")
          .insert(formData)
          .select()
          .single();

        if (error) throw error;

        setItems([data, ...items]);

        toast({
          title: "Created",
          description: "Portfolio item has been created",
        });
      }

      closeModal();
    } catch (error) {
      console.error("Error saving portfolio item:", error);
      toast({
        title: "Error",
        description: "Failed to save portfolio item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setItems(items.filter(i => i.id !== id));

      toast({
        title: "Deleted",
        description: "Portfolio item has been deleted",
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .update({ featured: !item.featured })
        .eq("id", item.id);

      if (error) throw error;

      setItems(items.map(i => 
        i.id === item.id ? { ...i, featured: !i.featured } : i
      ));

      toast({
        title: item.featured ? "Unfeatured" : "Featured",
        description: `Item ${item.featured ? "removed from" : "added to"} featured`,
      });
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
            <h1 className="font-display text-3xl font-semibold text-foreground">Portfolio</h1>
            <p className="text-muted-foreground">Manage your portfolio items</p>
          </div>
          <Button variant="gold" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-background rounded-xl shadow-card">
            <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No portfolio items yet</p>
            <Button variant="gold" onClick={() => openModal()}>
              Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-background rounded-xl shadow-card overflow-hidden group">
                <div className="relative h-48">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <div className="absolute top-2 left-2 bg-gold text-accent-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="icon" onClick={() => openModal(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => toggleFeatured(item)}
                      className={item.featured ? "bg-gold" : ""}
                    >
                      <Star className={`h-4 w-4 ${item.featured ? "fill-current" : ""}`} />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => deleteItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-gold uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                  )}
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
                  {editingItem ? "Edit Item" : "Add Portfolio Item"}
                </h2>
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Image URL *
                  </label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project description..."
                    rows={3}
                  />
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
                    Featured item
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

export default AdminPortfolio;
