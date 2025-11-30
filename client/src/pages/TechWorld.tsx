import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trophy, Zap } from "lucide-react";

export default function TechWorld() {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      return res.json();
    },
  });

  const zones = [
    { id: "frontend", name: "Frontend Island", icon: MapPin, tech: "React, Vue, Angular", color: "border-l-purple-500", description: "Master modern frontend frameworks and build beautiful UIs" },
    { id: "backend", name: "Backend Mountain", icon: Trophy, tech: "Node.js, Python, Go", color: "border-l-blue-500", description: "Build scalable server applications and APIs" },
    { id: "devops", name: "DevOps Desert", icon: Zap, tech: "Kubernetes, Docker, Cloud", color: "border-l-green-500", description: "Master deployment and infrastructure" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Interactive Tech World</h1>
        <p className="text-muted-foreground">Explore zones, earn XP, and compete on leaderboards</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {zones.map((zone) => {
          const Icon = zone.icon;
          return (
            <Card key={zone.id} className={`border-l-4 ${zone.color} hover-elevate`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" /> {zone.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{zone.description}</p>
                <p className="text-xs font-medium text-primary mb-4">{zone.tech}</p>
                <Button asChild size="sm" className="w-full" data-testid={`button-explore-${zone.id}`}>
                  <Link href={`/arenas`}>
                    Explore Zone
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading leaderboard...</p>
          ) : leaderboard && leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.slice(0, 10).map((entry: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-accent/50 rounded hover:bg-accent/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 flex items-center justify-center p-0">
                      #{idx + 1}
                    </Badge>
                    <span className="font-medium">{entry.user?.username || `User ${idx + 1}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-chart-4" />
                    <span className="font-semibold">{entry.totalXp || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No leaderboard data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
