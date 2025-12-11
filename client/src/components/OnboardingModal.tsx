import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const INTEREST_OPTIONS = [
  { id: "web-dev", label: "Web Development", icon: "🌐" },
  { id: "mobile-dev", label: "Mobile Development", icon: "📱" },
  { id: "ai-ml", label: "AI & Machine Learning", icon: "🤖" },
  { id: "data-science", label: "Data Science", icon: "📊" },
  { id: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
  { id: "game-dev", label: "Game Development", icon: "🎮" },
  { id: "blockchain", label: "Blockchain", icon: "⛓️" },
  { id: "cloud", label: "Cloud Computing", icon: "☁️" },
  { id: "devops", label: "DevOps", icon: "🔧" },
  { id: "ui-ux", label: "UI/UX Design", icon: "🎨" },
  { id: "backend", label: "Backend Development", icon: "⚙️" },
  { id: "frontend", label: "Frontend Development", icon: "💻" },
];

interface OnboardingModalProps {
  open: boolean;
  userId: string;
}

export function OnboardingModal({ open, userId }: OnboardingModalProps) {
  const [penName, setPenName] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          penName,
          interests: selectedInterests,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to CodeVerse! 🎉",
        description: "Your profile has been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleNext = () => {
    if (step === 1 && penName.trim().length < 3) {
      toast({
        title: "Invalid Pen Name",
        description: "Pen name must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handleComplete = () => {
    if (selectedInterests.length === 0) {
      toast({
        title: "Select Interests",
        description: "Please select at least one interest to continue.",
        variant: "destructive",
      });
      return;
    }
    completeOnboarding.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]" hideClose>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 ? "Choose Your Pen Name 🖊️" : "Select Your Interests 🎯"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Pick a unique name that represents you in the CodeVerse community"
              : "Choose topics you're interested in to personalize your experience"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="penName">Pen Name</Label>
              <Input
                id="penName"
                placeholder="e.g., CodeNinja, TechWizard, ByteMaster"
                value={penName}
                onChange={(e) => setPenName(e.target.value)}
                maxLength={30}
              />
              <p className="text-sm text-muted-foreground">
                {penName.length}/30 characters
              </p>
            </div>

            <Button onClick={handleNext} className="w-full" size="lg">
              Next →
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
              {INTEREST_OPTIONS.map((interest) => (
                <div
                  key={interest.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedInterests.includes(interest.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  <Checkbox
                    checked={selectedInterests.includes(interest.id)}
                    onCheckedChange={() => handleInterestToggle(interest.id)}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{interest.icon}</span>
                    <Label className="cursor-pointer text-sm">
                      {interest.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setStep(1)}
                variant="outline"
                className="w-full"
              >
                ← Back
              </Button>
              <Button
                onClick={handleComplete}
                className="w-full"
                size="lg"
                disabled={completeOnboarding.isPending}
              >
                {completeOnboarding.isPending ? "Setting up..." : "Complete Setup 🚀"}
              </Button>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Selected {selectedInterests.length} interest{selectedInterests.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
