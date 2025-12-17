import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Upload, Image as ImageIcon, Video, Loader2 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  media_url: string;
  media_type: string;
  category: string;
  display_order: number | null;
}

const categories = [
  { id: "living-room", label: "Living Room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "office", label: "Office" },
  { id: "outdoor", label: "Outdoor" },
  { id: "general", label: "General" },
];

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMediaType, setSelectedMediaType] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    media_type: "image",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedItems: GalleryItem[] = [];

    try {
      for (let i = 0; i < Math.min(files.length, 10); i++) {
        const file = files[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${i}.${fileExt}`;
        const isVideo = file.type.startsWith("video/");

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(fileName, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(fileName);

        const { data: insertData, error: insertError } = await supabase
          .from("gallery_items")
          .insert({
            title: formData.title || file.name.split(".")[0],
            description: formData.description,
            media_url: urlData.publicUrl,
            media_type: isVideo ? "video" : "image",
            category: formData.category,
          })
          .select()
          .single();

        if (!insertError && insertData) {
          uploadedItems.push(insertData);
        }
      }

      setItems([...uploadedItems, ...items]);
      toast({
        title: "Upload successful",
        description: `${uploadedItems.length} file(s) uploaded successfully.`,
      });
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading files.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string, mediaUrl: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    // Extract file path from URL
    const urlParts = mediaUrl.split("/gallery/");
    const filePath = urlParts[urlParts.length - 1];

    await supabase.storage.from("gallery").remove([filePath]);
    
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    
    if (!error) {
      setItems(items.filter((item) => item.id !== id));
      toast({ title: "Item deleted successfully" });
    }
  };

  const handleUpdate = async () => {
    if (!editItem) return;

    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      })
      .eq("id", editItem.id);

    if (!error) {
      setItems(
        items.map((item) =>
          item.id === editItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      toast({ title: "Item updated successfully" });
      setEditItem(null);
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "general",
      media_type: "image",
    });
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      category: item.category,
      media_type: item.media_type,
    });
    setIsDialogOpen(true);
  };

  const filteredItems = items.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    const typeMatch = selectedMediaType === "all" || item.media_type === selectedMediaType;
    return categoryMatch && typeMatch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Gallery</h1>
            <p className="text-muted-foreground">Manage gallery images and videos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={() => { setEditItem(null); resetForm(); }}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editItem ? "Edit Item" : "Upload Media"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title (optional)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {!editItem && (
                  <div>
                    <Label>Upload Files (max 10 at once)</Label>
                    <div className="mt-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-gold transition-colors"
                      >
                        {uploading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-gold" />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Click to upload images or videos
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {editItem && (
                  <Button onClick={handleUpdate} className="w-full" variant="gold">
                    Update Item
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                {item.media_type === "image" ? (
                  <img
                    src={item.media_url}
                    alt={item.title || "Gallery item"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={item.media_url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                <div className="absolute top-2 left-2">
                  {item.media_type === "image" ? (
                    <ImageIcon className="h-5 w-5 text-background drop-shadow" />
                  ) : (
                    <Video className="h-5 w-5 text-background drop-shadow" />
                  )}
                </div>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => openEditDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.id, item.media_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-sm truncate">{item.title || "Untitled"}</p>
                <p className="text-xs text-muted-foreground capitalize">{item.category.replace("-", " ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No gallery items found. Upload some images or videos to get started.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminGallery;
