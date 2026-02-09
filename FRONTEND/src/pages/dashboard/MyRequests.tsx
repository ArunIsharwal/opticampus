import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { baseUrl } from "@/App";

const statusConfig: Record<string, any> = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    class: "text-success bg-success/10",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    class: "text-warning bg-warning/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    class: "text-destructive bg-destructive/10",
  },
};

const MyRequestshistory = () => {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/student/get-events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) return;

        setRequests(Array.isArray(data.events) ? data.events : []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "--";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout userRole="student" userName="Arun">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">My Requests</h1>
        <p className="text-muted-foreground">
          Track all event requests you’ve submitted for approval
        </p>
      </div>

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="text-center text-muted-foreground py-10">
          No requests found
        </div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((req, index) => {
          const rawStatus = typeof req.status === "string"
            ? req.status.toLowerCase()
            : "pending";

          const statusKey = statusConfig[rawStatus]
            ? rawStatus
            : "pending";

          const statusData = statusConfig[statusKey];
          const StatusIcon = statusData.icon;

          return (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 flex items-center justify-between hover:shadow-elegant transition-all"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{req.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Requested on {formatDate(req.createdAt)}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusData.class}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusData.label}
                </div>

                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default MyRequestshistory;
