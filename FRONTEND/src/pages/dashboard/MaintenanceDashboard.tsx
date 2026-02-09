import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Calendar,
  User
} from "lucide-react";
import { Link } from "react-router-dom";

const tickets = [
  { 
    id: 1, 
    title: "AC Not Working", 
    location: "Room A-201", 
    reporter: "John Doe",
    priority: "high",
    status: "open",
    time: "30 min ago" 
  },
  { 
    id: 2, 
    title: "Water Leak in Washroom", 
    location: "Building B, Floor 2", 
    reporter: "Jane Smith",
    priority: "urgent",
    status: "in_progress",
    time: "1 hour ago" 
  },
  { 
    id: 3, 
    title: "Light Bulb Replacement", 
    location: "Library Section C", 
    reporter: "Mike Wilson",
    priority: "low",
    status: "open",
    time: "2 hours ago" 
  },
  { 
    id: 4, 
    title: "Projector Malfunction", 
    location: "Conference Room 3", 
    reporter: "Sarah Brown",
    priority: "medium",
    status: "open",
    time: "3 hours ago" 
  },
];

const priorityStyles = {
  low: { color: "bg-muted text-muted-foreground", label: "Low" },
  medium: { color: "bg-warning/10 text-warning", label: "Medium" },
  high: { color: "bg-destructive/10 text-destructive", label: "High" },
  urgent: { color: "bg-destructive text-destructive-foreground", label: "Urgent" },
};

const statusStyles = {
  open: { icon: AlertTriangle, color: "text-warning" },
  in_progress: { icon: Clock, color: "text-info" },
  completed: { icon: CheckCircle2, color: "text-success" },
};

const MaintenanceDashboard = () => {
  return (
    <DashboardLayout userRole="maintenance" userName="Tom Maintenance">
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">Maintenance Dashboard</h2>
        <p className="text-muted-foreground">
          Track and manage all maintenance tickets efficiently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Open Tickets", value: "12", color: "bg-warning/10", icon: AlertTriangle, iconColor: "text-warning" },
          { label: "In Progress", value: "5", color: "bg-info/10", icon: Clock, iconColor: "text-info" },
          { label: "Completed Today", value: "8", color: "bg-success/10", icon: CheckCircle2, iconColor: "text-success" },
          { label: "Avg Response", value: "2.4h", color: "bg-primary/10", icon: Wrench, iconColor: "text-primary" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              <span className="text-2xl font-display font-bold">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Ticket list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold">Active Tickets</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button variant="outline" size="sm">Sort</Button>
          </div>
        </div>

        <div className="divide-y divide-border">
          {tickets.map((ticket) => {
            const priority = priorityStyles[ticket.priority as keyof typeof priorityStyles];
            const status = statusStyles[ticket.status as keyof typeof statusStyles];
            
            return (
              <div key={ticket.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold">{ticket.title}</h4>
                        <Badge className={priority.color}>{priority.label}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {ticket.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {ticket.reporter}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {ticket.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 ${status.color}`}>
                      <status.icon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{ticket.status.replace("_", " ")}</span>
                    </div>
                    <Button size="sm">
                      {ticket.status === "open" ? "Start" : "Update"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-border text-center">
          <Button variant="ghost" asChild>
            <Link to="/dashboard/maintenance/tickets">View All Tickets</Link>
          </Button>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default MaintenanceDashboard;