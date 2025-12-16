import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, X, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";

interface Service {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  image_url: string;
  features: string[];
  display_order: number;
  created_at: string | null;
}

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    features: "",
    display_order: 0,
  });

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
      setServices(data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        subtitle: service.subtitle || "",
        description: service.description,
        image_url: service.image_url,
        features: service.features?.join("\n") || "",
        display_order: service.display_order,
      });
    } else {
      setEditingService(null);
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        image_url: "",
        features: "",
        display_order: services.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      features: "",
      display_order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f);

    const serviceData = {
      title: formData.title,
      subtitle: formData.subtitle || null,
      description: formData.description,
      image_url: formData.image_url,
      features: featuresArray,
      display_order: formData.display_order,
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Service updated successfully");
      } else {
        const { error } = await supabase.from("services").insert([serviceData]);

        if (error) throw error;
        toast.success("Service added successfully");
      }

      closeModal();
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      toast.error("Failed to save service");
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);

      if (error) throw error;
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Services</h1>
            <p className="text-muted-foreground">Manage your service offerings</p>
          </div>
          <Button onClick={() => openModal()} variant="gold">
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto" />
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl">
            <p className="text-muted-foreground">No services found</p>
            <Button onClick={() => openModal()} variant="outline" className="mt-4">
              Add Your First Service
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-background border border-border rounded-xl p-4 flex gap-4"
              >
                <div className="flex items-center text-muted-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground">{service.title}</h3>
                  {service.subtitle && (
                    <p className="text-sm text-gold">{service.subtitle}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {service.features?.slice(0, 3).map((feature, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blush text-foreground px-2 py-0.5 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features?.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openModal(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteService(service.id)}
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
            <div className="bg-background rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-border">
                <h2 className="font-display text-lg font-semibold">
                  {editingService ? "Edit Service" : "Add Service"}
                </h2>
                <button onClick={closeModal}>
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Subtitle</label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g., Elevate Your Spaces"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Image URL</label>
                  <Input
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Features (one per line)
                  </label>
                  <Textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Display Order</label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" className="flex-1">
                    {editingService ? "Update" : "Add"} Service
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

export default AdminServices;