import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Map,
  ChevronRight,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  Brain,
  Code,
  Shield,
  Cpu,
  Rocket,
  PlayCircle,
  Star,
} from "lucide-react";
import type { Roadmap, UserRoadmap } from "@shared/schema";

const roadmapIcons: Record<string, typeof Brain> = {
  ai: Brain,
  "web-dev": Code,
  cybersecurity: Shield,
  robotics: Cpu,
  startup: Rocket,
};

const roadmapColors: Record<string, string> = {
  ai: "from-purple-500 to-pink-500",
  "web-dev": "from-blue-500 to-cyan-500",
  cybersecurity: "from-green-500 to-emerald-500",
  robotics: "from-red-500 to-rose-500",
  startup: "from-orange-500 to-amber-500",
};

function RoadmapCard({
  roadmap,
  userRoadmap,
}: {
  roadmap: Roadmap;
  userRoadmap?: UserRoadmap & { roadmap: Roadmap };
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const Icon = roadmapIcons[roadmap.slug] || Map;
  const colorClass = roadmapColors[roadmap.slug] || "from-primary to-chart-2";
  const isStarted = !!userRoadmap;
  const milestones = (roadmap.milestones as any[]) || [];
  const currentMilestone = userRoadmap?.currentMilestone || 0;
  const completedCount = userRoadmap?.completedMilestones?.length || 0;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  const startRoadmap = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/roadmaps/${roadmap.id}/start`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/roadmaps"] });
      toast({
        title: "Roadmap started!",
        description: `You're now on the ${roadmap.name} path!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start roadmap.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="hover-elevate overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${colorClass}`} />
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${colorClass} text-white`}>
            <Icon className="h-7 w-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-semibold">{roadmap.name}</h3>
              <Badge variant="outline" className="text-xs capitalize">
                {roadmap.difficulty}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{roadmap.description}</p>

            {roadmap.skills && roadmap.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {roadmap.skills.slice(0, 4).map((skill, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {roadmap.skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{roadmap.skills.length - 4} more
                  </Badge>
                )}
              </div>
            )}

            {isStarted && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {completedCount}/{milestones.length} milestones
                  </span>
                </div>
                <Progress value={progress} className="mt-2 h-2" />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  ~{roadmap.estimatedWeeks} weeks
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {milestones.length} milestones
                </span>
              </div>
              {!isStarted ? (
                <Button asChild data-testid={`button-start-roadmap-${roadmap.id}`}>
                  <Link href={`/roadmaps/${roadmap.slug}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Start Path
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <Link href={`/roadmaps/${roadmap.slug}`}>
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MilestoneTimeline({ roadmap, userRoadmap }: { roadmap: Roadmap; userRoadmap?: UserRoadmap }) {
  const milestones = (roadmap.milestones as any[]) || [];
  const completedMilestones = new Set(userRoadmap?.completedMilestones || []);
  const currentMilestone = userRoadmap?.currentMilestone || 0;

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => {
        const isCompleted = completedMilestones.has(index);
        const isCurrent = index === currentMilestone;
        const isLocked = index > currentMilestone + 1;

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isCompleted
                    ? "bg-chart-5 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-accent text-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : isLocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              {index < milestones.length - 1 && (
                <div className={`w-0.5 h-12 ${isCompleted ? "bg-chart-5" : "bg-border"}`} />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h4 className={`font-medium ${isLocked ? "text-muted-foreground" : ""}`}>
                {milestone.title || `Milestone ${index + 1}`}
              </h4>
              <p className="text-sm text-muted-foreground">
                {milestone.description || "Complete this milestone to progress"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Roadmaps() {
  const { data: roadmaps, isLoading: roadmapsLoading } = useQuery<Roadmap[]>({
    queryKey: ["/api/roadmaps"],
  });

  const { data: userRoadmaps } = useQuery<(UserRoadmap & { roadmap: Roadmap })[]>({
    queryKey: ["/api/user/roadmaps"],
  });

  const userRoadmapMap = new Map(
    userRoadmaps?.map((ur) => [ur.roadmapId, ur]) || []
  );

  const activeRoadmaps = userRoadmaps?.filter((ur) => !ur.isCompleted) || [];

  if (roadmapsLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Learning Roadmaps</h1>
        <p className="mt-1 text-muted-foreground">
          AI-generated personalized learning paths based on your goals
        </p>
      </div>

      {activeRoadmaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              Your Active Roadmaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeRoadmaps.map((ur) => (
              <RoadmapCard key={ur.id} roadmap={ur.roadmap} userRoadmap={ur} />
            ))}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold">All Roadmaps</h2>
        <div className="space-y-4">
          {roadmaps && roadmaps.length > 0 ? (
            roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                userRoadmap={userRoadmapMap.get(roadmap.id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Map className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">No roadmaps available</p>
                <p className="text-sm text-muted-foreground">
                  Learning paths are being created by our AI!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
