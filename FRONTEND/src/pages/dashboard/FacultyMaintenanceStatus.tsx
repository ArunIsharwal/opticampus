import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { baseUrl } from "@/App";

const getBadgeVariant = (status?: string) => {
  if (status === "approved") return "default";
  if (status === "rejected") return "destructive";
  return "outline";
};

const FacultyMaintenanceStatus = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/maintenance/get-all-issues`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) throw new Error("Failed to fetch events");

        setEvents(data.issues);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <DashboardLayout userRole="faculty" userName="Faculty / HOD">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Maintenance Status</h2>

        {events.map((event) => (
          <Card key={event._id}>
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-muted-foreground mt-2">
                  Problem: {event.issueType}
                </p>
                <p className="font-semibold">{event.title}</p>

                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
              </div>

              <Badge variant={getBadgeVariant(event.status)}>
                {event.resolve === false ? "Pending" : "Success"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default FacultyMaintenanceStatus;
