import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Users, Trophy, Zap, Crown, Shield, Hammer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Clan, User } from "@shared/schema";

export default function ClanDetail() {
  const [location] = useLocation();
  const clanId = location.split("/").pop();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clan, isLoading } = useQuery<Clan>({
    queryKey: [`/api/clans/${clanId}`],
  });

  const joinClan = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/clans/${clanId}/join`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/clans/${clanId}`] });
      toast({
        title: "Joined!",
        description: `Welcome to ${clan?.name}!`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to join clan",
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

  if (!clan) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Clan not found</h2>
        <Button asChild>
          <Link href="/clans">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Clans
          </Link>
        </Button>
      </div>
    );
  }

  const isProjectClan = clan.type === "project";
  const xpProgress = ((clan.xp || 0) % 5000) / 50;
  const memberPercent = ((clan.memberCount || 0) / (clan.maxMembers || 1)) * 100;

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/clans">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Clans
        </Link>
      </Button>

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${isProjectClan ? "from-chart-1 to-chart-3" : "from-primary to-chart-2"} p-8 text-white`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isProjectClan ? <Hammer className="h-8 w-8" /> : <Shield className="h-8 w-8" />}
              <h1 className="font-display text-4xl font-bold">{clan.name}</h1>
            </div>
            <p className="text-lg text-white/80">{clan.description}</p>
          </div>
          <Badge className="bg-white text-black">
            {isProjectClan ? "Project Clan" : "Interest Clan"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Users className="mx-auto h-6 w-6 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Members</p>
                  <p className="mt-2 font-display text-2xl font-bold">{clan.memberCount}/{clan.maxMembers}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Zap className="mx-auto h-6 w-6 text-chart-4 mb-2" />
                  <p className="text-sm text-muted-foreground">Clan XP</p>
                  <p className="mt-2 font-display text-2xl font-bold">{(clan.xp || 0).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Trophy className="mx-auto h-6 w-6 text-chart-1 mb-2" />
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="mt-2 font-display text-2xl font-bold">#{clan.rank || "—"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Clan Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Member Growth</span>
                  <span className="text-sm text-muted-foreground">{memberPercent.toFixed(0)}%</span>
                </div>
                <Progress value={memberPercent} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">XP Progress</span>
                  <span className="text-sm text-muted-foreground">{xpProgress.toFixed(0)}%</span>
                </div>
                <Progress value={xpProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>Top members by XP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>M{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Member {i}</p>
                      <p className="text-xs text-muted-foreground">Level {15 - i}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{2000 - i * 300} XP</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Join Clan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                onClick={() => joinClan.mutate()}
                disabled={joinClan.isPending}
              >
                {joinClan.isPending ? "Joining..." : "Join This Clan"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {clan.memberCount} / {clan.maxMembers} members
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
