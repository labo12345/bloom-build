import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Trash2, X, Phone, Mail, Calendar } from "lucide-react";

interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  project_type: string;
  message: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdminConsultations = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from("consultation_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      toast({
        title: "Error",
        description: "Failed to load consultations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("consultation_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setConsultations(consultations.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
      ));

      if (selectedConsultation?.id === id) {
        setSelectedConsultation({ ...selectedConsultation, status: newStatus });
      }

      toast({
        title: "Status Updated",
        description: `Consultation marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const saveNotes = async () => {
    if (!selectedConsultation) return;

    try {
      const { error } = await supabase
        .from("consultation_requests")
        .update({ notes })
        .eq("id", selectedConsultation.id);

      if (error) throw error;

      setConsultations(consultations.map(c => 
        c.id === selectedConsultation.id ? { ...c, notes } : c
      ));

      toast({
        title: "Notes Saved",
        description: "Your notes have been saved",
      });
    } catch (error) {
      console.error("Error saving notes:", error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  };

  const deleteConsultation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this consultation?")) return;

    try {
      const { error } = await supabase
        .from("consultation_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setConsultations(consultations.filter(c => c.id !== id));
      setSelectedConsultation(null);

      toast({
        title: "Deleted",
        description: "Consultation has been deleted",
      });
    } catch (error) {
      console.error("Error deleting consultation:", error);
      toast({
        title: "Error",
        description: "Failed to delete consultation",
        variant: "destructive",
      });
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["pending", "contacted", "scheduled", "completed", "cancelled"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground">Consultations</h1>
            <p className="text-muted-foreground">Manage consultation requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-border bg-background text-foreground"
          >
            <option value="all">All Status</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-background rounded-xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No consultations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Client</th>
                    <th className="text-left p-4 font-medium text-foreground">Project</th>
                    <th className="text-left p-4 font-medium text-foreground">Date</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <p className="font-medium text-foreground">{consultation.name}</p>
                        <p className="text-sm text-muted-foreground">{consultation.email}</p>
                      </td>
                      <td className="p-4 text-foreground">{consultation.project_type}</td>
                      <td className="p-4 text-foreground">
                        {new Date(consultation.preferred_date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={consultation.status}
                          onChange={(e) => updateStatus(consultation.id, e.target.value)}
                          className={`px-2 py-1 text-xs rounded-full border-0 ${
                            consultation.status === "pending" ? "bg-peach text-foreground" :
                            consultation.status === "contacted" ? "bg-blush text-foreground" :
                            consultation.status === "scheduled" ? "bg-gold/20 text-foreground" :
                            consultation.status === "completed" ? "bg-green-100 text-green-800" :
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedConsultation(consultation);
                              setNotes(consultation.notes || "");
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteConsultation(consultation.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedConsultation && (
          <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-hover">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Consultation Details</h2>
                <button onClick={() => setSelectedConsultation(null)}>
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="font-medium text-foreground">{selectedConsultation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Project Type</p>
                    <p className="font-medium text-foreground">{selectedConsultation.project_type}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href={`mailto:${selectedConsultation.email}`} className="flex items-center gap-2 text-gold hover:underline">
                    <Mail className="h-4 w-4" />
                    {selectedConsultation.email}
                  </a>
                  <a href={`tel:${selectedConsultation.phone}`} className="flex items-center gap-2 text-gold hover:underline">
                    <Phone className="h-4 w-4" />
                    {selectedConsultation.phone}
                  </a>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preferred Date</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedConsultation.preferred_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {selectedConsultation.message && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Message</p>
                    <p className="text-foreground bg-muted/50 rounded-lg p-4">
                      {selectedConsultation.message}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Admin Notes</p>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this consultation..."
                    rows={4}
                    className="resize-none"
                  />
                  <Button variant="gold" size="sm" onClick={saveNotes} className="mt-2">
                    Save Notes
                  </Button>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {statusOptions.map(status => (
                    <Button
                      key={status}
                      variant={selectedConsultation.status === status ? "gold" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedConsultation.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminConsultations;
