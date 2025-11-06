import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function EmergencyButton() {
  const { toast } = useToast();

  const handleCall = () => {
    toast({
      title: "Calling Family",
      description: "Connecting you to your emergency contact...",
      duration: 3000,
    });
  };

  return (
    <Button
      data-testid="button-call-family"
      onClick={handleCall}
      variant="destructive"
      size="icon"
      className="h-14 w-14 rounded-full shadow-lg"
    >
      <Phone className="h-6 w-6" />
    </Button>
  );
}
