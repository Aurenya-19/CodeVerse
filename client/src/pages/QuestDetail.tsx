import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Zap, Clock, CheckCircle2, Flame, Star, Trophy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Quest, UserQuest } from "@shared/schema";

interface QuestWithDetails extends Quest {
  rewards?: {
    xp: number;
    badges?: string[];
  };
}

export default function QuestDetail() {
  const [location] = useLocation();
  const questId = location.split("/").pop();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quest, isLoading } = useQuery<QuestWithDetails>({
    queryKey: [`/api/quests/${questId}`],
  });

  const { data: userQuest } = useQuery<UserQuest>({
    queryKey: [`/api/user/quests/${questId}`],
  });

  const startQuest = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/quests/${questId}/start`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/quests/${questId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/quests/${questId}`] });
      toast({
        title: "Quest started!",
        description: "Good luck!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start quest",
        variant: "destructive",
      });
    },
  });

  const completeQuest = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/quests/${questId}/complete`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/quests/${questId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/quests/${questId}`] });
      toast({
        title: "Quest completed!",
        description: `Earned ${quest?.xpReward} XP!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete quest",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Quest not found</h2>
        <Button asChild>
          <Link href="/quests">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Quests
          </Link>
        </Button>
      </div>
    );
  }

  const progress = userQuest?.progress || 0;
  const target = userQuest?.target || 1;
  const progressPercent = (progress / target) * 100;
  const isCompleted = userQuest?.isCompleted || false;
  const isStarted = !!userQuest;

  const getTypeIcon = () => {
    switch (quest.type) {
      case "daily":
        return Flame;
      case "weekly":
        return Star;
      case "monthly":
        return Trophy;
      default:
        return Sparkles;
    }
  };

  const TypeIcon = getTypeIcon();

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/quests">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Quests
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${isCompleted ? "bg-chart-5/20" : "bg-accent"}`}>
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-chart-5" />
                ) : (
                  <TypeIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">{quest.title}</h1>
                <p className="mt-1 text-muted-foreground">{quest.description}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <Badge className={isCompleted ? "bg-chart-5" : "bg-primary"}>
              {isCompleted ? "Completed" : "Active"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Progress */}
          {isStarted && (
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Completion</span>
                    <span className="text-sm font-medium">{progress}/{target}</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>
                {!isCompleted && (
                  <Button
                    className="w-full"
                    onClick={() => completeQuest.mutate()}
                    disabled={completeQuest.isPending || progressPercent < 100}
                  >
                    {completeQuest.isPending ? "Completing..." : "Complete Quest"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="mt-1 font-medium capitalize">{quest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="mt-1 font-medium">Achievement</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty</p>
                  <p className="mt-1 font-medium capitalize">{quest.difficulty || "Normal"}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Requirements</p>
                <p className="text-sm">{quest.requirement?.description || "Complete the specified tasks"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-chart-4/10 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-chart-4" />
                  <span className="font-medium">Experience</span>
                </div>
                <span className="font-bold text-chart-4">+{quest.xpReward} XP</span>
              </div>
              {quest.rewards?.badges && quest.rewards.badges.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Badges</p>
                  <div className="space-y-2">
                    {quest.rewards.badges.map((badge, i) => (
                      <Badge key={i} variant="secondary" className="w-full justify-center">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action */}
          <Card>
            <CardContent className="p-6">
              {!isStarted ? (
                <Button
                  className="w-full"
                  onClick={() => startQuest.mutate()}
                  disabled={startQuest.isPending}
                >
                  {startQuest.isPending ? "Starting..." : "Start Quest"}
                </Button>
              ) : isCompleted ? (
                <div className="text-center">
                  <CheckCircle2 className="h-8 w-8 text-chart-5 mx-auto mb-2" />
                  <p className="font-medium">Quest Completed!</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  Keep going! You're {progressPercent.toFixed(0)}% done
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
