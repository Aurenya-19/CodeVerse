import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Clock, Flag } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  timeLimit: number;
  imageUrl: string;
  arenaId: string;
  tags: string[];
}

export default function Challenges() {
  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    retry: 1,
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-chart-5/10 text-chart-5";
      case "intermediate":
        return "bg-chart-4/10 text-chart-4";
      case "advanced":
        return "bg-chart-3/10 text-chart-3";
      case "expert":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Skill Challenges</h1>
          <p className="text-slate-300">Master your skills through real-world challenges</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
              <Card
                key={challenge.id}
                className="bg-slate-900 border-slate-700 hover-elevate overflow-hidden flex flex-col"
                data-testid={`card-challenge-${challenge.id}`}
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-800">
                  <img
                    src={challenge.imageUrl}
                    alt={challenge.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <Badge className={`absolute top-3 right-3 ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-white line-clamp-2" data-testid={`text-title-${challenge.id}`}>
                    {challenge.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <p className="text-sm text-slate-300 line-clamp-2" data-testid={`text-description-${challenge.id}`}>
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {challenge.tags?.slice(0, 2).map((tag, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs"
                        data-testid={`badge-tag-${i}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400 pt-2">
                    <span className="flex items-center gap-1" data-testid={`text-time-${challenge.id}`}>
                      <Clock className="w-4 h-4" />
                      {challenge.timeLimit}m
                    </span>
                    <span className="flex items-center gap-1 text-cyan-400" data-testid={`text-xp-${challenge.id}`}>
                      <Zap className="w-4 h-4" />
                      +{challenge.xpReward}
                    </span>
                  </div>

                  <Button asChild className="w-full mt-4" data-testid={`button-start-${challenge.id}`}>
                    <Link href={`/challenges/${challenge.id}`}>
                      <Flag className="mr-2 w-4 h-4" />
                      Start Challenge
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400">Loading challenges...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
