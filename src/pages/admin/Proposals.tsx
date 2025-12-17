import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, Plus, Loader2, FileText, Send, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  description: string | null;
  estimated_budget: number | null;
  status: string;
  valid_until: string | null;
  notes: string | null;
  created_at: string;
}

const statusConfig = {
  draft: { label: "Draft", color: "bg-gray-100 text-gray-800", icon: FileText },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-800", icon: Send },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
};

const AdminProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editProposal, setEditProposal] = useState<Proposal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    description: "",
    estimated_budget: "",
    status: "draft",
    valid_until: "",
    notes: "",
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProposals(data);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.client_name) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }

    const data = {
      ...formData,
      estimated_budget: formData.estimated_budget ? parseFloat(formData.estimated_budget) : null,
      valid_until: formData.valid_until || null,
    };

    if (editProposal) {
      const { error } = await supabase.from("proposals").update(data).eq("id", editProposal.id);
      if (!error) {
        setProposals(proposals.map((p) => (p.id === editProposal.id ? { ...p, ...data } : p)));
        toast({ title: "Proposal updated" });
      }
    } else {
      const { data: newProposal, error } = await supabase
        .from("proposals")
        .insert(data)
        .select()
        .single();

      if (!error && newProposal) {
        setProposals([newProposal, ...proposals]);
        toast({ title: "Proposal created" });
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this proposal?")) return;
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (!error) {
      setProposals(proposals.filter((p) => p.id !== id));
      toast({ title: "Proposal deleted" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      description: "",
      estimated_budget: "",
      status: "draft",
      valid_until: "",
      notes: "",
    });
    setEditProposal(null);
  };

  const openEditDialog = (proposal: Proposal) => {
    setEditProposal(proposal);
    setFormData({
      title: proposal.title,
      client_name: proposal.client_name,
      client_email: proposal.client_email || "",
      client_phone: proposal.client_phone || "",
      description: proposal.description || "",
      estimated_budget: proposal.estimated_budget?.toString() || "",
      status: proposal.status,
      valid_until: proposal.valid_until || "",
      notes: proposal.notes || "",
    });
    setIsDialogOpen(true);
  };

  const filteredProposals = statusFilter === "all"
    ? proposals
    : proposals.filter((p) => p.status === statusFilter);

  const stats = {
    total: proposals.length,
    draft: proposals.filter((p) => p.status === "draft").length,
    sent: proposals.filter((p) => p.status === "sent").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
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
            <h1 className="text-3xl font-display font-semibold text-foreground">Proposals</h1>
            <p className="text-muted-foreground">Manage project proposals</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                New Proposal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editProposal ? "Edit Proposal" : "Create Proposal"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Proposal Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Living Room Redesign"
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
                    placeholder="Proposal details..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Estimated Budget (KES)</Label>
                    <Input
                      type="number"
                      value={formData.estimated_budget}
                      onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
                      placeholder="500000"
                    />
                  </div>
                  <div>
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={formData.valid_until}
                      onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Internal Notes</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Internal notes..."
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full" variant="gold">
                  {editProposal ? "Update Proposal" : "Create Proposal"}
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
              <p className="text-sm text-muted-foreground">Total Proposals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{stats.draft}</div>
              <p className="text-sm text-muted-foreground">Drafts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
              <p className="text-sm text-muted-foreground">Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Proposals</SelectItem>
            {Object.entries(statusConfig).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Proposals Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proposal</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => {
                  const status = statusConfig[proposal.status as keyof typeof statusConfig];
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {format(new Date(proposal.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{proposal.client_name}</p>
                          {proposal.client_email && (
                            <p className="text-xs text-muted-foreground">{proposal.client_email}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        {proposal.estimated_budget 
                          ? `KES ${proposal.estimated_budget.toLocaleString()}` 
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {proposal.valid_until 
                          ? format(new Date(proposal.valid_until), "MMM d, yyyy")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(proposal)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDelete(proposal.id)}>
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

        {filteredProposals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No proposals found. Create your first proposal to get started.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProposals;
