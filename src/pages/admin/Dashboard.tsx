import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Mail, Image, MessageSquare, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardStats {
  consultations: number;
  pendingConsultations: number;
  messages: number;
  unreadMessages: number;
  portfolioItems: number;
  testimonials: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    consultations: 0,
    pendingConsultations: 0,
    messages: 0,
    unreadMessages: 0,
    portfolioItems: 0,
    testimonials: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch consultations count
      const { count: consultationsCount } = await supabase
        .from("consultation_requests")
        .select("*", { count: "exact", head: true });

      const { count: pendingCount } = await supabase
        .from("consultation_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true });

      const { count: unreadCount } = await supabase
        .from("contact_messages")
        .select("*", { count: "exact", head: true })
        .eq("status", "unread");

      // Fetch portfolio count
      const { count: portfolioCount } = await supabase
        .from("portfolio_items")
        .select("*", { count: "exact", head: true });

      // Fetch testimonials count
      const { count: testimonialsCount } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true });

      // Fetch recent consultations
      const { data: consultations } = await supabase
        .from("consultation_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      // Fetch recent messages
      const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        consultations: consultationsCount || 0,
        pendingConsultations: pendingCount || 0,
        messages: messagesCount || 0,
        unreadMessages: unreadCount || 0,
        portfolioItems: portfolioCount || 0,
        testimonials: testimonialsCount || 0,
      });

      setRecentConsultations(consultations || []);
      setRecentMessages(messages || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Consultations",
      value: stats.consultations,
      subtitle: `${stats.pendingConsultations} pending`,
      icon: Calendar,
      color: "bg-blush",
      href: "/admin/consultations",
    },
    {
      title: "Contact Messages",
      value: stats.messages,
      subtitle: `${stats.unreadMessages} unread`,
      icon: Mail,
      color: "bg-peach",
      href: "/admin/messages",
    },
    {
      title: "Portfolio Items",
      value: stats.portfolioItems,
      subtitle: "Projects showcased",
      icon: Image,
      color: "bg-gold/20",
      href: "/admin/portfolio",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      subtitle: "Client reviews",
      icon: MessageSquare,
      color: "bg-blush-deep/30",
      href: "/admin/testimonials",
    },
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Beyond House Admin Panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              to={stat.href}
              className="bg-background rounded-xl p-6 shadow-card hover:shadow-hover transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-display font-semibold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Consultations */}
          <div className="bg-background rounded-xl shadow-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Recent Consultations
                </h2>
                <Link to="/admin/consultations" className="text-sm text-gold hover:underline">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentConsultations.length === 0 ? (
                <p className="p-6 text-muted-foreground text-center">No consultations yet</p>
              ) : (
                recentConsultations.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.project_type}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.status === "pending" ? "bg-peach text-foreground" :
                          item.status === "contacted" ? "bg-blush text-foreground" :
                          item.status === "scheduled" ? "bg-gold/20 text-foreground" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {item.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-background rounded-xl shadow-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Recent Messages
                </h2>
                <Link to="/admin/messages" className="text-sm text-gold hover:underline">
                  View all
                </Link>
              </div>
            </div>
            <div className="divide-y divide-border">
              {recentMessages.length === 0 ? (
                <p className="p-6 text-muted-foreground text-center">No messages yet</p>
              ) : (
                recentMessages.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {item.subject}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.status === "unread" ? "bg-gold text-accent-foreground" :
                          item.status === "read" ? "bg-muted text-muted-foreground" :
                          "bg-blush text-foreground"
                        }`}>
                          {item.status}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
