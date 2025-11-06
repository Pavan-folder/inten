import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { VoiceInputButton } from "@/components/VoiceInputButton";
import { DestinationCard } from "@/components/DestinationCard";
import { EmergencyButton } from "@/components/EmergencyButton";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Destination, Trip } from "@shared/schema";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [manualInput, setManualInput] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentDestinations, isLoading } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/recent'],
  });

  const { data: favorites } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/favorites'],
  });

  const createTripMutation = useMutation({
    mutationFn: async (destination: string) => {
      const res = await apiRequest("POST", "/api/trips", {
        destination,
        destinationType: "other",
        safeRouteEnabled: true,
        totalSteps: 5,
      });
      return res.json() as Promise<Trip>;
    },
    onSuccess: (trip) => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      setLocation(`/navigate?destination=${encodeURIComponent(trip.destination)}&tripId=${trip.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start navigation. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Check for Web Speech API support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log("Speech recognition not supported");
    }
  }, []);

  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    
    // Try to use Web Speech API if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Fallback to simulation
        simulateVoiceInput();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        simulateVoiceInput();
      }
    } else {
      // Fallback simulation for demo
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setTimeout(() => {
      const mockDestinations = ["pharmacy", "hospital", "grocery store", "home"];
      const randomDest = mockDestinations[Math.floor(Math.random() * mockDestinations.length)];
      setVoiceInput(randomDest);
      setIsListening(false);
    }, 2000);
  };

  const handleStartNavigation = (destination: string) => {
    createTripMutation.mutate(destination);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Emergency Button */}
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b z-50 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">EldNav</h1>
          <EmergencyButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-24 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Voice Input Section */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Where would you like to go?
            </h2>
            
            <VoiceInputButton
              isListening={isListening}
              onToggle={handleVoiceToggle}
            />

            {voiceInput && (
              <div className="space-y-4">
                <p className="text-xl text-muted-foreground" data-testid="text-voice-input">
                  I heard: "{voiceInput}"
                </p>
                <Button
                  data-testid="button-start-navigation"
                  onClick={() => handleStartNavigation(voiceInput)}
                  disabled={createTripMutation.isPending}
                  className="min-h-[64px] px-8 text-lg font-medium"
                  size="lg"
                >
                  {createTripMutation.isPending ? "Starting..." : "Start Navigation"}
                </Button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-lg">
                <span className="bg-background px-4 text-muted-foreground">or type your destination</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Input
                data-testid="input-destination"
                type="text"
                placeholder="Type a destination..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="h-14 text-lg px-6"
              />
              <Button
                data-testid="button-go"
                onClick={() => manualInput && handleStartNavigation(manualInput)}
                disabled={!manualInput || createTripMutation.isPending}
                className="min-h-[56px] px-8 text-lg font-medium"
              >
                {createTripMutation.isPending ? "..." : "Go"}
              </Button>
            </div>
          </div>

          {/* Favorites Section */}
          {favorites && favorites.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">Favorites</h3>
              <div className="space-y-4">
                {favorites.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onClick={() => handleStartNavigation(destination.name)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Recent Destinations */}
          {isLoading ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">Recent Trips</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-card rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          ) : recentDestinations && recentDestinations.length > 0 ? (
            <section className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground">Recent Trips</h3>
              <div className="space-y-4">
                {recentDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onClick={() => handleStartNavigation(destination.name)}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
