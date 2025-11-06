import { useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TripCompletionPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const destination = searchParams.get("destination") || "your destination";
  const tripId = searchParams.get("tripId");
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitFeedbackMutation = useMutation({
    mutationFn: async (wasComfortable: boolean) => {
      if (!tripId) {
        return apiRequest("POST", "/api/trips/feedback", { wasComfortable });
      }
      return apiRequest("POST", `/api/trips/${tripId}/complete`, { wasComfortable });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      setFeedbackGiven(true);
      
      // Speak thank you message
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Thank you for your feedback!");
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve your experience.",
        duration: 2000,
      });
      
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    },
  });

  const handleFeedback = (wasComfortable: boolean) => {
    submitFeedbackMutation.mutate(wasComfortable);
  };

  const handleHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-20 w-20 text-green-600 dark:text-green-400" data-testid="icon-success" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-completion-title">
            You've reached safely!
          </h1>
          <p className="text-2xl text-muted-foreground" data-testid="text-destination">
            {destination}
          </p>
        </div>

        {/* Feedback Section */}
        {!feedbackGiven ? (
          <div className="space-y-6">
            <p className="text-xl text-foreground">Was this route comfortable?</p>
            <div className="flex gap-8 justify-center">
              <Button
                data-testid="button-thumbs-up"
                onClick={() => handleFeedback(true)}
                variant="outline"
                className="h-20 w-20 rounded-full hover-elevate active-elevate-2"
                size="icon"
                disabled={submitFeedbackMutation.isPending}
              >
                <ThumbsUp className="h-10 w-10" />
              </Button>
              <Button
                data-testid="button-thumbs-down"
                onClick={() => handleFeedback(false)}
                variant="outline"
                className="h-20 w-20 rounded-full hover-elevate active-elevate-2"
                size="icon"
                disabled={submitFeedbackMutation.isPending}
              >
                <ThumbsDown className="h-10 w-10" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-accent/50 rounded-2xl p-8">
            <p className="text-2xl font-medium text-accent-foreground" data-testid="text-feedback-thanks">
              Thank you for your feedback!
            </p>
          </div>
        )}

        {/* Return Home Button */}
        <Button
          data-testid="button-home"
          onClick={handleHome}
          className="min-h-[64px] px-12 text-lg font-medium"
          size="lg"
        >
          Return Home
        </Button>
      </div>
    </div>
  );
}
