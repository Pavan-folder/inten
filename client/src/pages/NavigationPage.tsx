import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navigationSteps = [
  { direction: "straight", instruction: "Continue straight on Main Street", distance: "500m" },
  { direction: "right", instruction: "Turn right onto Oak Avenue", distance: "200m" },
  { direction: "straight", instruction: "Continue straight", distance: "800m" },
  { direction: "left", instruction: "Turn left onto Elm Street", distance: "150m" },
  { direction: "straight", instruction: "Your destination is ahead", distance: "100m" },
];

const reassuranceMessages = [
  "You're doing great!",
  "You're on the right path",
  "Almost there, keep going",
];

export default function NavigationPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get("destination") || "Unknown";
  const tripId = searchParams.get("tripId");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showReassurance, setShowReassurance] = useState(false);

  const progress = ((currentStep + 1) / navigationSteps.length) * 100;
  const currentInstruction = navigationSteps[currentStep];

  const updateProgressMutation = useMutation({
    mutationFn: async ({ progress, step }: { progress: number, step: number }) => {
      if (!tripId) return;
      return apiRequest("PATCH", `/api/trips/${tripId}/progress`, {
        progress,
        currentStep: step,
      });
    },
  });

  const cancelTripMutation = useMutation({
    mutationFn: async () => {
      if (!tripId) return;
      return apiRequest("POST", `/api/trips/${tripId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      setLocation("/");
    },
  });

  useEffect(() => {
    // Show reassurance message at 25%, 50%, 75%
    const milestones = [1, 2, 3];
    if (milestones.includes(currentStep)) {
      setShowReassurance(true);
      
      // Speak reassurance if speech synthesis is available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reassuranceMessages[Math.floor(currentStep / 2)]);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
      
      setTimeout(() => setShowReassurance(false), 3000);
    }
  }, [currentStep]);

  useEffect(() => {
    // Speak current instruction when it changes
    if ('speechSynthesis' in window && currentInstruction) {
      const utterance = new SpeechSynthesisUtterance(
        `${currentInstruction.instruction} in ${currentInstruction.distance}`
      );
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentInstruction]);

  const handleNextStep = () => {
    if (currentStep < navigationSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      const nextProgress = ((nextStep + 1) / navigationSteps.length) * 100;
      updateProgressMutation.mutate({ progress: Math.round(nextProgress), step: nextStep });
    } else {
      setLocation(`/complete?destination=${encodeURIComponent(destination)}&tripId=${tripId}`);
    }
  };

  const handleCancel = () => {
    if (tripId) {
      cancelTripMutation.mutate();
    } else {
      setLocation("/");
    }
  };

  const getDirectionIcon = () => {
    switch (currentInstruction.direction) {
      case "left":
        return <ArrowLeft className="h-24 w-24" />;
      case "right":
        return <ArrowRight className="h-24 w-24" />;
      default:
        return <ArrowUp className="h-24 w-24" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="bg-card border-b p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground" data-testid="text-destination">
              To: {destination}
            </h1>
            <p className="text-lg text-muted-foreground">
              Step {currentStep + 1} of {navigationSteps.length}
            </p>
          </div>
          <EmergencyButton />
        </div>
      </header>

      {/* Navigation Content */}
      <main className="flex-1 flex flex-col p-4">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col gap-8">
          {/* Direction Arrow */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-8">
              <div 
                className={cn(
                  "inline-flex items-center justify-center h-32 w-32 rounded-full bg-primary/10",
                  "text-primary"
                )}
                data-testid="icon-direction"
              >
                {getDirectionIcon()}
              </div>
              
              {/* Instruction */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground" data-testid="text-instruction">
                  {currentInstruction.instruction}
                </h2>
                <p className="text-2xl text-muted-foreground" data-testid="text-distance">
                  in {currentInstruction.distance}
                </p>
              </div>

              {/* Reassurance Message */}
              {showReassurance && (
                <div 
                  className="bg-accent/50 rounded-2xl p-6 animate-in fade-in duration-300"
                  data-testid="text-reassurance"
                >
                  <p className="text-2xl font-medium text-accent-foreground">
                    {reassuranceMessages[Math.floor(currentStep / 2)]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-4">
            <Progress value={progress} className="h-4" />
            <p className="text-center text-xl text-muted-foreground" data-testid="text-progress">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              data-testid="button-cancel"
              onClick={handleCancel}
              variant="outline"
              className="flex-1 min-h-[64px] text-lg font-medium"
            >
              Cancel
            </Button>
            <Button
              data-testid="button-next-step"
              onClick={handleNextStep}
              className="flex-1 min-h-[64px] text-lg font-medium"
            >
              {currentStep === navigationSteps.length - 1 ? "Arrive" : "Next"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
