import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import type { Trip } from "@shared/schema";
import { format } from "date-fns";

interface TripHistoryCardProps {
  trip: Trip;
}

export function TripHistoryCard({ trip }: TripHistoryCardProps) {
  const statusIcons = {
    completed: CheckCircle2,
    cancelled: XCircle,
    in_progress: Clock,
  };

  const Icon = statusIcons[trip.status as keyof typeof statusIcons];

  return (
    <Card
      data-testid={`card-trip-${trip.id}`}
      className="min-h-[80px] p-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${
            trip.status === 'completed' ? 'text-green-500' :
            trip.status === 'cancelled' ? 'text-red-500' :
            'text-blue-500'
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold" data-testid={`text-trip-destination-${trip.id}`}>
            {trip.destination}
          </h3>
          <p className="text-lg text-muted-foreground">
            {trip.endTime ? format(new Date(trip.endTime), 'MMM d, h:mm a') : 'In progress'}
          </p>
        </div>
      </div>
    </Card>
  );
}
