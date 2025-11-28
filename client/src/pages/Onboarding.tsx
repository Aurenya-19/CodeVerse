import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Hexagon,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  Code,
  Shield,
  Cpu,
  Rocket,
  Cloud,
  Gamepad2,
  Glasses,
  Zap,
  Database,
  Smartphone,
  Settings,
  CheckCircle2,
} from "lucide-react";
import { TECH_INTERESTS, LEARNING_PACES, COGNITIVE_STYLES } from "@shared/schema";

const interestIcons: Record<string, typeof Brain> = {
  AI: Brain,
  Robotics: Cpu,
  "Web Dev": Code,
  ML: Sparkles,
  Cybersecurity: Shield,
  "Game Dev": Gamepad2,
  Cloud: Cloud,
  Blockchain: Database,
  "AR/VR": Glasses,
  Electronics: Zap,
  Startups: Rocket,
  "Data Science": Database,
  "Mobile Dev": Smartphone,
  DevOps: Settings,
};

const skillQuestions = [
  {
    question: "How comfortable are you with programming?",
    options: [
      { value: "beginner", label: "Just starting out", description: "Learning the basics" },
      { value: "intermediate", label: "Some experience", description: "Built a few projects" },
      { value: "advanced", label: "Experienced developer", description: "Work professionally or on complex projects" },
    ],
  },
  {
    question: "What's your preferred learning pace?",
    options: LEARNING_PACES.map((pace) => ({
      value: pace,
      label: pace.charAt(0).toUpperCase() + pace.slice(1),
      description:
        pace === "slow"
          ? "Take time to deeply understand"
          : pace === "moderate"
          ? "Balanced learning approach"
          : pace === "fast"
          ? "Quick learner, move fast"
          : "Intensive, immersive learning",
    })),
  },
  {
    question: "How do you learn best?",
    options: COGNITIVE_STYLES.map((style) => ({
      value: style,
      label:
        style === "visual"
          ? "Visual Learning"
          : style === "logical"
          ? "Logical/Structured"
          : style === "examples"
          ? "Learn by Examples"
          : "Fast Track",
      description:
        style === "visual"
          ? "Diagrams, videos, and visual aids"
          : style === "logical"
          ? "Step-by-step explanations"
          : style === "examples"
          ? "Practical code examples"
          : "Minimal theory, maximum practice",
    })),
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState("");
  const [learningPace, setLearningPace] = useState("");
  const [cognitiveStyle, setCognitiveStyle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const completeOnboarding = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/profile/onboarding", {
        interests: selectedInterests,
        learningPace,
        cognitiveStyle,
        skillLevel,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome to TechHive!",
        description: "Your personalized learning journey begins now.",
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return selectedInterests.length >= 3;
      case 1:
        return skillLevel !== "";
      case 2:
        return learningPace !== "";
      case 3:
        return cognitiveStyle !== "";
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding.mutate();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Hexagon className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">TechHive</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <Progress value={progress} className="mb-8 h-2" />

          {step === 0 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">
                  What interests you?
                </CardTitle>
                <CardDescription>
                  Select at least 3 areas you want to explore. This helps us personalize your experience.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {TECH_INTERESTS.map((interest) => {
                    const Icon = interestIcons[interest] || Code;
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`relative flex flex-col items-center gap-2 rounded-lg border p-4 transition-all hover-elevate ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : "border-border"
                        }`}
                        data-testid={`interest-${interest.toLowerCase().replace(/[\s/]+/g, "-")}`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />
                        )}
                        <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                          {interest}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {selectedInterests.length} selected (minimum 3)
                </p>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">
                  {skillQuestions[0].question}
                </CardTitle>
                <CardDescription>
                  This helps us recommend the right challenges for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={skillLevel}
                  onValueChange={setSkillLevel}
                  className="space-y-3"
                >
                  {skillQuestions[0].options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover-elevate ${
                        skillLevel === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      data-testid={`skill-${option.value}`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">
                  {skillQuestions[1].question}
                </CardTitle>
                <CardDescription>
                  We'll adjust content delivery to match your pace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={learningPace}
                  onValueChange={setLearningPace}
                  className="space-y-3"
                >
                  {skillQuestions[1].options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover-elevate ${
                        learningPace === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      data-testid={`pace-${option.value}`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-2xl">
                  {skillQuestions[2].question}
                </CardTitle>
                <CardDescription>
                  We'll tailor content presentation to your learning style.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={cognitiveStyle}
                  onValueChange={setCognitiveStyle}
                  className="space-y-3"
                >
                  {skillQuestions[2].options.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover-elevate ${
                        cognitiveStyle === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border"
                      }`}
                      data-testid={`style-${option.value}`}
                    >
                      <RadioGroupItem value={option.value} id={option.value} />
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              data-testid="button-back"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || completeOnboarding.isPending}
              data-testid="button-next"
            >
              {completeOnboarding.isPending
                ? "Setting up..."
                : step === totalSteps - 1
                ? "Complete Setup"
                : "Continue"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
