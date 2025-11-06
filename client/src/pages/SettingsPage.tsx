import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EmergencyButton } from "@/components/EmergencyButton";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Shield, Volume2, Type, Moon } from "lucide-react";
import { useLocation } from "wouter";
import type { UserPreferences } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ['/api/preferences'],
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: async (updates: Partial<UserPreferences>) => {
      return apiRequest("PATCH", "/api/preferences", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
        duration: 2000,
      });
    },
  });

  const handleToggleSafeRoute = () => {
    if (preferences) {
      updatePreferenceMutation.mutate({
        safeRouteMode: !preferences.safeRouteMode,
      });
    }
  };

  const handleToggleVoice = () => {
    if (preferences) {
      updatePreferenceMutation.mutate({
        voiceGuidanceEnabled: !preferences.voiceGuidanceEnabled,
      });
    }
  };

  const handleToggleHighContrast = () => {
    if (preferences) {
      updatePreferenceMutation.mutate({
        highContrastMode: !preferences.highContrastMode,
      });
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  if (!preferences) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <EmergencyButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Safe Route Mode */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-green-100 dark:bg-green-900/20">
                <Shield className="h-7 w-7 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Safe Route Mode</h3>
                <p className="text-lg text-muted-foreground">
                  Prefer well-lit routes, avoid highways
                </p>
              </div>
              <Switch
                data-testid="switch-safe-route"
                checked={preferences.safeRouteMode}
                onCheckedChange={handleToggleSafeRoute}
                className="scale-125"
              />
            </div>
          </Card>

          {/* Voice Guidance */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                <Volume2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Voice Guidance</h3>
                <p className="text-lg text-muted-foreground">
                  Spoken turn-by-turn directions
                </p>
              </div>
              <Switch
                data-testid="switch-voice"
                checked={preferences.voiceGuidanceEnabled}
                onCheckedChange={handleToggleVoice}
                className="scale-125"
              />
            </div>
          </Card>

          {/* High Contrast Mode */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-purple-100 dark:bg-purple-900/20">
                <Type className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">High Contrast</h3>
                <p className="text-lg text-muted-foreground">
                  Increase text visibility
                </p>
              </div>
              <Switch
                data-testid="switch-high-contrast"
                checked={preferences.highContrastMode}
                onCheckedChange={handleToggleHighContrast}
                className="scale-125"
              />
            </div>
          </Card>

          {/* Dark Mode */}
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-800">
                <Moon className="h-7 w-7 text-slate-600 dark:text-slate-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">Dark Mode</h3>
                <p className="text-lg text-muted-foreground">
                  Reduce screen brightness
                </p>
              </div>
              <Switch
                data-testid="switch-dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleToggleDarkMode}
                className="scale-125"
              />
            </div>
          </Card>

          {/* Text Size Info */}
          <Card className="p-6 bg-muted/50">
            <p className="text-lg text-center text-muted-foreground">
              Text size is currently set to <strong>{preferences.textSize}</strong>.
              <br />
              Adjust text size in your device's accessibility settings.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
