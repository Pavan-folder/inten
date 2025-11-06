import { Card } from "@/components/ui/card";
import { MapPin, Home, Heart, ShoppingCart, Hospital, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Destination } from "@shared/schema";

interface DestinationCardProps {
  destination: Destination;
  onClick: () => void;
}

const iconMap = {
  home: Home,
  pharmacy: ShoppingCart,
  hospital: Hospital,
  grocery: ShoppingCart,
  friend: Heart,
  other: MapPin,
};

export function DestinationCard({ destination, onClick }: DestinationCardProps) {
  const Icon = iconMap[destination.type as keyof typeof iconMap] || MapPin;

  return (
    <Card
      data-testid={`card-destination-${destination.id}`}
      onClick={onClick}
      className="min-h-[80px] p-6 cursor-pointer hover-elevate active-elevate-2 transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold truncate" data-testid={`text-destination-name-${destination.id}`}>
              {destination.name}
            </h3>
            {destination.isFavorite && (
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-lg text-muted-foreground truncate">{destination.address}</p>
        </div>
      </div>
    </Card>
  );
}
