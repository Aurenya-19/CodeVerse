import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Zap, Clock, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Challenge } from "@shared/schema";

interface ChallengeWithDetails extends Challenge {
  instructions: string | null;
  starter_code: string | null;
  testCases?: { input: string; output: string; description: string }[];
}

export default function ChallengeDetail() {
  const [location] = useLocation();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const challengeId = location.split("/").pop();

  const { data: challenge, isLoading } = useQuery<ChallengeWithDetails>({
    queryKey: [`/api/challenges/${challengeId}`],
  });

  const submitChallenge = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/challenges/${challengeId}/submit`, {
        code,
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success!",
        description: data.message || "Challenge submitted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit challenge",
        variant: "destructive",
      });
    },
  });

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Challenge not found</h2>
        <Button asChild>
          <Link href="/arenas">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Arenas
          </Link>
        </Button>
      </div>
    );
  }

  const difficultyColor = {
    easy: "text-chart-5",
    medium: "text-chart-4",
    hard: "text-chart-1",
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/arenas">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Arenas
          </Link>
        </Button>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl font-bold">{challenge.title}</h1>
                <Badge variant="outline" className={difficultyColor[challenge.difficulty as keyof typeof difficultyColor]}>
                  {challenge.difficulty}
                </Badge>
                {challenge.isDaily && (
                  <Badge variant="secondary">Daily</Badge>
                )}
              </div>
              <p className="mt-2 text-muted-foreground">{challenge.description}</p>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <div className="flex items-center gap-2 justify-end text-sm">
                <Zap className="h-4 w-4 text-chart-4" />
                <span className="font-bold text-chart-4">{challenge.xpReward} XP</span>
              </div>
              {challenge.timeLimit && (
                <div className="flex items-center gap-2 justify-end text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{challenge.timeLimit}m time limit</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Problem Statement */}
        <div className="space-y-4">
          <Tabs defaultValue="problem" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="problem">Problem</TabsTrigger>
              <TabsTrigger value="tests">Test Cases</TabsTrigger>
            </TabsList>

            <TabsContent value="problem" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Problem Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {challenge.instructions || challenge.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tests" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Cases</CardTitle>
                  <CardDescription>Your code must pass all test cases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenge.testCases && challenge.testCases.length > 0 ? (
                    challenge.testCases.map((test, idx) => (
                      <div key={idx} className="space-y-2 rounded-lg border border-border p-3">
                        <p className="text-sm font-medium">{test.description || `Test Case ${idx + 1}`}</p>
                        <div className="grid gap-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Input:</p>
                            <code className="block rounded bg-muted p-2">{test.input}</code>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Expected Output:</p>
                            <code className="block rounded bg-muted p-2">{test.output}</code>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No test cases available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Code Editor */}
        <div className="space-y-4">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Code Editor</CardTitle>
                {challenge.starter_code && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode(challenge.starter_code!)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <CardDescription>Write your solution below</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {challenge.starter_code && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">Starter Code:</p>
                  <code className="block rounded-lg bg-muted p-3 text-sm overflow-auto max-h-32">
                    {challenge.starter_code}
                  </code>
                </div>
              )}

              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Your Solution:</p>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Write your code here..."
                  className="min-h-48 font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  className="flex-1"
                  onClick={() => submitChallenge.mutate()}
                  disabled={submitChallenge.isPending || !code.trim()}
                >
                  {submitChallenge.isPending ? "Submitting..." : "Submit Solution"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setCode("");
                    toast({
                      title: "Code cleared",
                      description: "Your code editor has been reset",
                    });
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tips & Hints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-chart-1 mt-0.5" />
                <p className="text-muted-foreground">Focus on the problem statement first before writing code</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-chart-5 mt-0.5" />
                <p className="text-muted-foreground">Test your solution with the provided test cases</p>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-chart-4 mt-0.5" />
                <p className="text-muted-foreground">Pay attention to edge cases and constraints</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
