import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Star, Trophy, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Avatar {
  id: string;
  penName: string;
  level: number;
  xp: number;
  rank: number;
  avatarColor: string;
}

export default function Metaverse() {
  const { user } = useAuth();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [topPlayers] = useState<Avatar[]>([
    { id: "1", penName: "SkyWalker", level: 45, xp: 125000, rank: 1, avatarColor: "#00FFFF" },
    { id: "2", penName: "CodeNinja", level: 42, xp: 118000, rank: 2, avatarColor: "#FF00FF" },
    { id: "3", penName: "ByteMaster", level: 40, xp: 112000, rank: 3, avatarColor: "#FFD700" },
    { id: "4", penName: "TechGuru", level: 38, xp: 105000, rank: 4, avatarColor: "#00FF00" },
    { id: "5", penName: "DevWizard", level: 35, xp: 98000, rank: 5, avatarColor: "#FF6B9D" },
  ]);

  useEffect(() => {
    const initBabylon = async () => {
      if (!containerRef.current) return;
      
      try {
        const BABYLON = (await import("babylonjs")).default;
        
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.borderRadius = "0.5rem";
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(canvas);

        const engine = new BABYLON.Engine(canvas, true);
        const scene = new BABYLON.Scene(engine);
        
        scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.25);
        
        const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light1.intensity = 0.7;
        light1.groundColor = new BABYLON.Color3(0.5, 0.25, 0.7);
        
        const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(10, 20, 10), scene);
        light2.intensity = 0.8;
        light2.range = 100;
        
        const sphere = BABYLON.MeshBuilder.CreateSphere("skybox", { diameter: 1000 }, scene);
        const skyboxMat = new BABYLON.StandardMaterial("skybox", scene);
        skyboxMat.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.2);
        sphere.material = skyboxMat;

        topPlayers.forEach((player, index) => {
          const sphere = BABYLON.MeshBuilder.CreateSphere(`avatar${index}`, { diameter: 2, segments: 32 }, scene);
          const angle = (index / topPlayers.length) * Math.PI * 2;
          sphere.position = new BABYLON.Vector3(
            Math.cos(angle) * 15,
            index * 3 - 6,
            Math.sin(angle) * 15
          );

          const mat = new BABYLON.StandardMaterial(`mat${index}`, scene);
          mat.emissiveColor = BABYLON.Color3.FromHexString(player.avatarColor);
          mat.specularColor = new BABYLON.Color3(0.5, 0.8, 1);
          sphere.material = mat;

          const glow = new BABYLON.GlowLayer("glow", scene);
          glow.addIncludedOnlyMesh(sphere);
          glow.intensity = 0.8;
        });

        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 8, -30), scene);
        camera.attachControl(canvas, true);
        camera.speed = 0.1;
        camera.angularSensibility = 1000;
        camera.inertia = 0.8;
        camera.panningInertia = 0.7;

        engine.runRenderLoop(() => {
          scene.render();
        });

        window.addEventListener("resize", () => {
          engine.resize();
        });
      } catch (error) {
        console.error("Babylon.js initialization error:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--foreground);">
              <p>3D Leaderboard visualization loading...</p>
              <p style="font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.5rem;">
                Creating galaxy-themed avatar spaces
              </p>
            </div>
          `;
        }
      }
    };

    initBabylon();
  }, [topPlayers]);
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
