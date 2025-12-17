import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Upload, Loader2, User, Star } from "lucide-react";

interface TeamMember {
  id: string;
  full_name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  video_url: string | null;
  email: string | null;
  phone: string | null;
  is_leader: boolean | null;
  display_order: number | null;
}

const AdminTeam = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    bio: "",
    photo_url: "",
    video_url: "",
    email: "",
    phone: "",
    is_leader: false,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("team")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("team")
        .getPublicUrl(fileName);

      setFormData({ ...formData, photo_url: urlData.publicUrl });
      toast({ title: "Photo uploaded successfully" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `video-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("team")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("team")
        .getPublicUrl(fileName);

      setFormData({ ...formData, video_url: urlData.publicUrl });
      toast({ title: "Video uploaded successfully" });
    } catch (error) {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.full_name || !formData.role) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    if (editMember) {
      const { error } = await supabase
        .from("team_members")
        .update(formData)
        .eq("id", editMember.id);

      if (!error) {
        setMembers(members.map((m) => (m.id === editMember.id ? { ...m, ...formData } : m)));
        toast({ title: "Team member updated" });
      }
    } else {
      const { data, error } = await supabase
        .from("team_members")
        .insert(formData)
        .select()
        .single();

      if (!error && data) {
        setMembers([...members, data]);
        toast({ title: "Team member added" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) {
      setMembers(members.filter((m) => m.id !== id));
      toast({ title: "Team member deleted" });
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      role: "",
      bio: "",
      photo_url: "",
      video_url: "",
      email: "",
      phone: "",
      is_leader: false,
    });
    setEditMember(null);
  };

  const openEditDialog = (member: TeamMember) => {
    setEditMember(member);
    setFormData({
      full_name: member.full_name,
      role: member.role,
      bio: member.bio || "",
      photo_url: member.photo_url || "",
      video_url: member.video_url || "",
      email: member.email || "",
      phone: member.phone || "",
      is_leader: member.is_leader || false,
    });
    setIsDialogOpen(true);
  };

  const leaders = members.filter((m) => m.is_leader);
  const staff = members.filter((m) => !m.is_leader);

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-display font-semibold text-foreground">Team</h1>
            <p className="text-muted-foreground">Manage team members and leaders</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Role *</Label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Lead Designer"
                    />
                  </div>
                </div>

                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief biography..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+254..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Photo</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.photo_url && (
                      <img
                        src={formData.photo_url}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    )}
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => photoInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      Upload Photo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Video</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {formData.video_url && (
                      <video src={formData.video_url} className="w-32 h-20 object-cover rounded" />
                    )}
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={uploadingVideo}
                    >
                      {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                      Upload Video
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_leader}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_leader: checked })}
                  />
                  <Label>Leadership Position</Label>
                </div>

                <Button onClick={handleSubmit} className="w-full" variant="gold">
                  {editMember ? "Update Member" : "Add Member"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leaders Section */}
        {leaders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              Leadership
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaders.map((member) => (
                <Card key={member.id} className="overflow-hidden group">
                  <div className="relative">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground">{member.full_name}</h3>
                    <p className="text-sm text-gold">{member.role}</p>
                    {member.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{member.bio}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Staff Section */}
        {staff.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">Team Staff</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {staff.map((member) => (
                <Card key={member.id} className="overflow-hidden group">
                  <div className="relative">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.full_name}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-muted flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button size="icon" variant="secondary" onClick={() => openEditDialog(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-foreground text-sm">{member.full_name}</h3>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {members.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No team members yet. Add your first team member to get started.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;
