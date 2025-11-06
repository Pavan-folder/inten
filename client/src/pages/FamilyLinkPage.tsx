import { useQuery } from "@tanstack/react-query";
import { EmergencyButton } from "@/components/EmergencyButton";
import { TripHistoryCard } from "@/components/TripHistoryCard";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Users, History } from "lucide-react";
import type { FamilyContact, Trip } from "@shared/schema";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function FamilyLinkPage() {
  const [, setLocation] = useLocation();
  
  const { data: familyContacts, isLoading: contactsLoading } = useQuery<FamilyContact[]>({
    queryKey: ['/api/family-contacts'],
  });

  const { data: activeTrip } = useQuery<Trip>({
    queryKey: ['/api/trips/active'],
  });

  const { data: tripHistory } = useQuery<Trip[]>({
    queryKey: ['/api/trips/history'],
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            data-testid="button-back"
            onClick={() => setLocation("/")}
            variant="ghost"
            className="text-lg"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Family Link</h1>
          <EmergencyButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Active Trip */}
          {activeTrip && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                Active Trip
              </h2>
              <Card className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground" data-testid="text-active-destination">
                    To: {activeTrip.destination}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Step {activeTrip.currentStep} of {activeTrip.totalSteps}
                  </p>
                </div>
                <div className="space-y-2">
                  <Progress value={activeTrip.progress} className="h-3" />
                  <p className="text-lg text-muted-foreground text-center" data-testid="text-active-progress">
                    {activeTrip.progress}% complete
                  </p>
                </div>
                <p className="text-lg text-muted-foreground text-center">
                  Family members can track this trip
                </p>
              </Card>
            </section>
          )}

          {/* Family Contacts */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" />
              Family Contacts
            </h2>
            {contactsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 bg-card rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : familyContacts && familyContacts.length > 0 ? (
              <div className="space-y-4">
                {familyContacts.map((contact) => (
                  <Card key={contact.id} className="p-6" data-testid={`card-contact-${contact.id}`}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarFallback className="text-2xl font-semibold">
                          {getInitials(contact.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold" data-testid={`text-contact-name-${contact.id}`}>
                          {contact.name}
                        </h3>
                        <p className="text-lg text-muted-foreground">{contact.relationship}</p>
                        <p className="text-lg text-muted-foreground">{contact.phoneNumber}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch
                          data-testid={`switch-tracking-${contact.id}`}
                          checked={contact.familyLinkEnabled}
                          className="scale-125"
                        />
                        <span className="text-sm text-muted-foreground">
                          {contact.familyLinkEnabled ? 'Tracking On' : 'Tracking Off'}
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground">No family contacts added yet</p>
              </Card>
            )}
          </section>

          {/* Trip History */}
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <History className="h-6 w-6" />
              Trip History
            </h2>
            {tripHistory && tripHistory.length > 0 ? (
              <div className="space-y-4">
                {tripHistory.map((trip) => (
                  <TripHistoryCard key={trip.id} trip={trip} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-xl text-muted-foreground">No trips yet</p>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
