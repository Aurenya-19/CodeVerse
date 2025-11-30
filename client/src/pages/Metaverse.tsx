import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Globe, Sparkles, Crown, Zap, Flame, Trophy, Users, Palette, Wand2, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface MetaverseUser {
  user: { id: string; firstName: string; lastName: string; profileImageUrl: string };
  profile: { xp: number; level: number; dailyStreak: number };
  skinTone: string;
  hairStyle: string;
  outfit: string;
  aura: string;
}

interface UserAvatar {
  id: string;
  userId: string;
  skinTone: string;
  hairStyle: string;
  outfit: string;
  aura: string;
}

const avatarCustomizations = {
  skinTones: ["default", "light", "medium", "dark", "olive", "golden"],
  hairStyles: ["default", "short", "long", "curly", "straight", "spiky"],
  outfits: ["default", "casual", "formal", "gaming", "hacker", "scientist"],
  auras: ["none", "blue", "red", "gold", "purple", "rainbow"],
};

export default function Metaverse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [customizing, setCustomizing] = useState(false);
  const [avatarData, setAvatarData] = useState<UserAvatar | null>(null);

  const { data: leaderboard, isLoading } = useQuery<MetaverseUser[]>({
    queryKey: ["/api/metaverse/leaderboard"],
  });

  const { data: userAvatar, refetch: refetchAvatar } = useQuery<UserAvatar | null>({
    queryKey: ["/api/avatar"],
  });

  useEffect(() => {
    if (userAvatar) {
      setAvatarData(userAvatar as UserAvatar);
    }
  }, [userAvatar]);

  const handleCreateAvatar = async () => {
    if (!avatarData) return;
    try {
      const response = await apiRequest("POST", "/api/avatar/create", avatarData);
      if (response && typeof response === "object") {
        setAvatarData(response as unknown as UserAvatar);
        refetchAvatar();
        toast({
          title: "Avatar Created!",
          description: "Your metaverse avatar is ready.",
        });
        setCustomizing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create avatar",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatarData) return;
    try {
      const response = await apiRequest("PATCH", "/api/avatar", avatarData);
      if (response && typeof response === "object") {
        setAvatarData(response as unknown as UserAvatar);
        refetchAvatar();
        toast({
          title: "Avatar Updated!",
          description: "Your metaverse avatar has been customized.",
        });
        setCustomizing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!canvasRef.current || !leaderboard) return;

    // Simple 3D visualization using canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = 400;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.fillStyle = "#7C3AED";
    ctx.font = "bold 24px 'Space Grotesk'";
    ctx.textAlign = "center";
    ctx.fillText("METAVERSE LEADERBOARD HALL", canvas.width / 2, 40);

    // Draw top 3 pedestals
    const pedestalData = [
      { rank: 2, x: 100, height: 200, color: "#C0C0C0" }, // Silver
      { rank: 1, x: canvas.width / 2 - 60, height: 250, color: "#FFD700" }, // Gold
      { rank: 3, x: canvas.width - 100, height: 150, color: "#CD7F32" }, // Bronze
    ];

    pedestalData.forEach((pedestal) => {
      // Draw pedestal
      ctx.fillStyle = pedestal.color;
      ctx.fillRect(
        pedestal.x - 40,
        canvas.height - pedestal.height,
        80,
        pedestal.height
      );

      // Draw rank number
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        pedestal.rank.toString(),
        pedestal.x,
        canvas.height - pedestal.height / 2
      );

      // Draw medal emoji
      const medal =
        pedestal.rank === 1 ? "🥇" : pedestal.rank === 2 ? "🥈" : "🥉";
      ctx.font = "32px Arial";
      ctx.fillText(medal, pedestal.x, canvas.height - pedestal.height - 20);
    });

    // Draw level counters
    ctx.fillStyle = "#7C3AED";
    ctx.font = "14px 'Space Grotesk'";
    ctx.textAlign = "center";
    leaderboard?.slice(0, 3).forEach((entry: MetaverseUser, i: number) => {
      const x =
        pedestalData[i]?.x || canvas.width / 2;
      ctx.fillText(
        `Level ${entry.profile.level}`,
        x,
        canvas.height + 20
      );
    });
  }, [leaderboard]);

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-4xl font-bold flex items-center gap-3">
          <Globe className="h-10 w-10 text-purple-500" />
          Metaverse Hub
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter the 3D virtual reality of CodeVerse where avatars compete on the global leaderboard
        </p>
      </div>

      {/* 3D Canvas Leaderboard */}
      <Card className="border-purple-500/20 bg-gradient-to-br from-slate-900 to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            3D Leaderboard Hall
          </CardTitle>
        </CardHeader>
        <CardContent>
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg border border-purple-500/20"
            style={{ minHeight: "400px" }}
          />
        </CardContent>
      </Card>

      {/* Top 10 Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Top 10 Metaverse Avatars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard?.slice(0, 10).map((entry: MetaverseUser, index: number) => (
              <div
                key={entry.user.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-4 hover-elevate"
                data-testid={`leaderboard-entry-${index}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 font-bold">
                    {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {entry.user.firstName} {entry.user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Level {entry.profile.level} • {entry.profile.xp} XP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {entry.aura && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      {entry.aura}
                    </Badge>
                  )}
                  <Badge className="bg-purple-500/20 text-purple-300 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {Math.floor(entry.profile.xp / 100)}K
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metaverse Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Avatars</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-500">
              {leaderboard?.length || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Active in metaverse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Avatar XP</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500">
              {leaderboard?.[0]?.profile?.xp?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Current leader
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Max Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-500">
              {Math.max(...((leaderboard || []).map((e: MetaverseUser) => e.profile.level) || [0])) || 0}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Highest achievable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            🚀 Coming Soon to Metaverse
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✨ Avatar Customization - Create your unique tech persona</p>
          <p>🏢 Virtual Learning Arenas - 3D spaces for live coding sessions</p>
          <p>🏆 Achievement Displays - Show off your skills in 3D</p>
          <p>🤝 Avatar Social Spaces - Meet other developers in real-time</p>
        </CardContent>
      </Card>
    </div>
  );
}
