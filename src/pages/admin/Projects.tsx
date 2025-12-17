import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Loader2, Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Project {
  id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  description: string | null;
  status: string;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  assigned_team_member_id: string | null;
  notes: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  full_name: string;
}

const statusConfig = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Briefcase },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    description: "",
    status: "pending",
    budget: "",
    start_date: "",
    end_date: "",
    assigned_team_member_id: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [projectsRes, teamRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("team_members").select("id, full_name"),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (teamRes.data) setTeamMembers(teamRes.data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.client_name) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const data = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      assigned_team_member_id: formData.assigned_team_member_id || null,
    };

    if (editProject) {
      const { error } = await supabase.from("projects").update(data).eq("id", editProject.id);
      if (!error) {
        setProjects(projects.map((p) => (p.id === editProject.id ? { ...p, ...data } : p)));
        toast({ title: "Project updated" });
      }
    } else {
      const { data: newProject, error } = await supabase.from("projects").insert(data).select().single();
      if (!error && newProject) {
        setProjects([newProject, ...projects]);
        toast({ title: "Project created" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) {
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: "Project deleted" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      description: "",
      status: "pending",
      budget: "",
      start_date: "",
      end_date: "",
      assigned_team_member_id: "",
      notes: "",
    });
    setEditProject(null);
  };

  const openEditDialog = (project: Project) => {
    setEditProject(project);
    setFormData({
      title: project.title,
      client_name: project.client_name,
      client_email: project.client_email || "",
      client_phone: project.client_phone || "",
      description: project.description || "",
      status: project.status,
      budget: project.budget?.toString() || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      assigned_team_member_id: project.assigned_team_member_id || "",
      notes: project.notes || "",
    });
    setIsDialogOpen(true);
  };

  const filteredProjects = statusFilter === "all" 
    ? projects 
    : projects.filter((p) => p.status === statusFilter);

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    in_progress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

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
            <h1 className="text-3xl font-display font-semibold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Track and manage interior design jobs</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editProject ? "Edit Project" : "Create Project"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Project Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Kitchen Renovation"
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Client Name *</Label>
                    <Input
                      value={formData.client_name}
                      onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label>Client Phone</Label>
                    <Input
                      value={formData.client_phone}
                      onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                      placeholder="+254..."
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project details..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Budget (KES)</Label>
                    <Input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Assigned Team Member</Label>
                  <Select
                    value={formData.assigned_team_member_id}
                    onValueChange={(value) => setFormData({ ...formData, assigned_team_member_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>{member.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Internal notes..."
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full" variant="gold">
                  {editProject ? "Update Project" : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Projects Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const status = statusConfig[project.status as keyof typeof statusConfig];
                  return (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {format(new Date(project.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.client_name}</p>
                          {project.client_phone && (
                            <p className="text-xs text-muted-foreground">{project.client_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {project.budget ? `KES ${project.budget.toLocaleString()}` : "-"}
                      </TableCell>
                      <TableCell>
                        {project.start_date ? (
                          <span className="text-sm">
                            {format(new Date(project.start_date), "MMM d")}
                            {project.end_date && ` - ${format(new Date(project.end_date), "MMM d, yyyy")}`}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(project)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects found. Create your first project to get started.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
