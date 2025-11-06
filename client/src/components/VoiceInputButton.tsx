import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceInputButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function VoiceInputButton({ isListening, onToggle, disabled }: VoiceInputButtonProps) {
  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        data-testid="button-voice-input"
        onClick={onToggle}
        disabled={disabled}
        className={cn(
          "h-20 w-20 rounded-full transition-all duration-300",
          isListening && "animate-pulse"
        )}
        size="icon"
        variant={isListening ? "destructive" : "default"}
      >
        {isListening ? (
          <MicOff className="h-10 w-10" />
        ) : (
          <Mic className="h-10 w-10" />
        )}
      </Button>
      
      {isListening && (
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      )}
    </div>
  );
}
