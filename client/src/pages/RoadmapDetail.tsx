import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  Lock,
  Star,
  Clock,
  Zap,
  PlayCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Roadmap, UserRoadmap } from "@shared/schema";

export default function RoadmapDetail() {
  const [location] = useLocation();
  const slug = location.split("/").pop();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: roadmap, isLoading: roadmapLoading, isError: roadmapError } = useQuery<Roadmap>({
    queryKey: [`/api/roadmaps/${slug}`],
  });

  const { data: userRoadmap } = useQuery<UserRoadmap>({
    queryKey: [`/api/user/roadmaps/${slug}`],
  });

  const { data: generatedMilestones, isLoading: milestonesLoading } = useQuery<Array<{ title: string; description: string }>>({
    queryKey: [`/api/roadmaps/${roadmap?.id}/milestones`],
    enabled: !!roadmap?.id,
  });

  const startRoadmap = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/roadmaps/${roadmap?.id}/start`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/roadmaps/${slug}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/roadmaps"] });
      toast({
        title: "Roadmap started!",
        description: `You're now on this learning path!`,
      });
    },
  });

  if (roadmapLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (roadmapError || !roadmap) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Roadmap not found</h2>
        <Button asChild>
          <Link href="/roadmaps">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Roadmaps
          </Link>
        </Button>
      </div>
    );
  }

  const isStarted = !!userRoadmap;
  const milestones = generatedMilestones || [];
  const completedMilestones = new Set(userRoadmap?.completedMilestones || []);
  const currentMilestone = userRoadmap?.currentMilestone || 0;
  const completedCount = completedMilestones.size;
  const progress = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/roadmaps">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold mb-2">{roadmap.name}</h1>
              <p className="text-muted-foreground mb-4">{roadmap.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="capitalize">
                  {roadmap.difficulty}
                </Badge>
                {roadmap.skills?.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>~{roadmap.estimatedWeeks} weeks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>{milestones.length} milestones</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-chart-4" />
                  <span>+{roadmap.xpReward || 0} XP</span>
                </div>
              </div>
            </div>

            {!isStarted ? (
              <Button
                onClick={() => startRoadmap.mutate()}
                disabled={startRoadmap.isPending}
                size="lg"
                data-testid="button-start-roadmap"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                {startRoadmap.isPending ? "Starting..." : "Start Path"}
              </Button>
            ) : (
              <Badge variant="outline" className="text-chart-5 h-fit text-base">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                In Progress
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      {isStarted && (
        <div className="max-w-4xl mx-auto p-6 border-b bg-card/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Learning Path Progress</span>
              <span className="font-medium">
                {completedCount}/{milestones.length} milestones
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Milestones</CardTitle>
            <CardDescription>
              {milestonesLoading 
                ? "Loading milestones..." 
                : isStarted
                ? `${completedCount} completed, ${milestones.length - completedCount} remaining`
                : `Complete ${milestones.length} milestones to finish this path`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {milestonesLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
            <div className="space-y-6">
              {milestones.length > 0 ? (
                milestones.map((milestone, index) => {
                  const isCompleted = completedMilestones.has(index);
                  const isCurrent = index === currentMilestone && isStarted;
                  const isLocked = index > currentMilestone + 1 && isStarted;

                  return (
                    <div key={index} className="flex items-start gap-4">
                      {/* Timeline connector */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            isCompleted
                              ? "bg-chart-5 text-white"
                              : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/30 animate-pulse"
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
                          <div
                            className={`w-0.5 h-16 ${
                              isCompleted ? "bg-chart-5" : "bg-border"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4
                              className={`font-semibold text-lg ${
                                isLocked ? "text-muted-foreground" : ""
                              }`}
                            >
                              {milestone.title || `Milestone ${index + 1}`}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {milestone.description ||
                                "Complete this milestone to progress"}
                            </p>
                          </div>
                          {isCurrent && (
                            <Badge className="bg-primary ml-2">Current</Badge>
                          )}
                          {isCompleted && (
                            <Badge className="bg-chart-5 ml-2">Complete</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No milestones yet
                </p>
              )}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
