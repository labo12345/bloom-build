import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Trash2, X, Phone, Mail } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: newStatus } : m
      ));

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }

      toast({
        title: "Status Updated",
        description: `Message marked as ${newStatus}`,
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

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setMessages(messages.filter(m => m.id !== id));
      setSelectedMessage(null);

      toast({
        title: "Deleted",
        description: "Message has been deleted",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === "unread") {
      updateStatus(message.id, "read");
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = ["unread", "read", "replied"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Manage contact form submissions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
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

        {/* Messages List */}
        <div className="bg-background rounded-xl shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${
                    message.status === "unread" ? "bg-gold/5" : ""
                  }`}
                  onClick={() => openMessage(message)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-medium text-foreground ${message.status === "unread" ? "font-semibold" : ""}`}>
                          {message.name}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          message.status === "unread" ? "bg-gold text-accent-foreground" :
                          message.status === "read" ? "bg-muted text-muted-foreground" :
                          "bg-blush text-foreground"
                        }`}>
                          {message.status}
                        </span>
                      </div>
                      <p className={`text-sm ${message.status === "unread" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-hover">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold">Message Details</h2>
                <button onClick={() => setSelectedMessage(null)}>
                  <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">From</p>
                  <p className="font-medium text-foreground text-lg">{selectedMessage.name}</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a href={`mailto:${selectedMessage.email}`} className="flex items-center gap-2 text-gold hover:underline">
                    <Mail className="h-4 w-4" />
                    {selectedMessage.email}
                  </a>
                  {selectedMessage.phone && (
                    <a href={`tel:${selectedMessage.phone}`} className="flex items-center gap-2 text-gold hover:underline">
                      <Phone className="h-4 w-4" />
                      {selectedMessage.phone}
                    </a>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Subject</p>
                  <p className="font-medium text-foreground">{selectedMessage.subject}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Message</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {statusOptions.map(status => (
                    <Button
                      key={status}
                      variant={selectedMessage.status === status ? "gold" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedMessage.id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="gold" asChild className="flex-1">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}>
                      Reply via Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
