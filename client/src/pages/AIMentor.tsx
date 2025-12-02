import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Send, Lightbulb, Code, Zap, Target, BookOpen, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AIMentor() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [responses, setResponses] = useState<Array<{ question: string; answer: string; timestamp: string }>>([]);
  const [selectedSkill, setSelectedSkill] = useState("");

  const askMutation = useMutation({
    mutationFn: async (q: string) => {
      const res = await fetch("/api/ai/mentorship/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, context }),
      });
      if (!res.ok) throw new Error("Failed to get mentor response");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question, 
        answer: data.answer, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setQuestion("");
      setContext("");
    },
    onError: (error: any) => handleError(error),
  });

  const feedbackMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await fetch("/api/ai/mentorship/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "javascript" }),
      });
      if (!res.ok) throw new Error("Failed to get code feedback");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question: "Code Review", 
        answer: data.feedback, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
      setQuestion("");
    },
    onError: (error: any) => handleError(error),
  });

  const skillAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/skill-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: selectedSkill || "general" }),
      });
      if (!res.ok) throw new Error("Failed to assess skill");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question: `Skill Assessment: ${selectedSkill}`, 
        answer: data.assessment, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    },
    onError: (error: any) => handleError(error),
  });

  const interviewPrepMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: selectedSkill || "general", difficulty: "intermediate" }),
      });
      if (!res.ok) throw new Error("Failed to generate interview prep");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question: `Interview Prep: ${selectedSkill}`, 
        answer: data.questions, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    },
    onError: (error: any) => handleError(error),
  });

  const learningPathMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/learning-path-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkill: selectedSkill || "beginner", goal: "proficiency" }),
      });
      if (!res.ok) throw new Error("Failed to generate learning path");
      return res.json();
    },
    onSuccess: (data) => {
      setResponses(prev => [...prev, { 
        question: `Learning Path: ${selectedSkill}`, 
        answer: data.path, 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    },
    onError: (error: any) => handleError(error),
  });

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          AI Mentor
        </h1>
        <p className="text-muted-foreground">Personalized AI guidance, code reviews, interview prep & learning paths</p>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="questions"><Lightbulb className="h-4 w-4 mr-2" />Questions</TabsTrigger>
          <TabsTrigger value="code"><Code className="h-4 w-4 mr-2" />Code Review</TabsTrigger>
          <TabsTrigger value="interview"><MessageSquare className="h-4 w-4 mr-2" />Interview</TabsTrigger>
          <TabsTrigger value="learning"><Target className="h-4 w-4 mr-2" />Learning Path</TabsTrigger>
        </TabsList>

        {/* Ask Question Tab */}
        <TabsContent value="questions">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Ask a Question
              </CardTitle>
              <CardDescription>Get expert guidance on any tech topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Context (optional)</label>
                <Input
                  placeholder="e.g., I'm learning React hooks..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  disabled={askMutation.isPending}
                  data-testid="input-context"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Your Question</label>
                <Textarea
                  placeholder="Ask me anything about coding, architecture, best practices, patterns..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  disabled={askMutation.isPending}
                  className="min-h-24"
                  data-testid="textarea-question"
                />
              </div>
              <Button
                onClick={() => askMutation.mutate(question)}
                disabled={!question.trim() || askMutation.isPending}
                className="w-full"
                data-testid="button-ask-mentor"
              >
                <Send className="mr-2 h-4 w-4" />
                {askMutation.isPending ? "Thinking..." : "Ask Mentor"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Review Tab */}
        <TabsContent value="code">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                AI Code Review
              </CardTitle>
              <CardDescription>Get detailed feedback on your code quality, performance & style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your code here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={feedbackMutation.isPending}
                className="min-h-48 font-mono text-xs"
                data-testid="textarea-code"
              />
              <Button
                onClick={() => feedbackMutation.mutate(question)}
                disabled={!question.trim() || feedbackMutation.isPending}
                className="w-full"
                data-testid="button-review-code"
              >
                {feedbackMutation.isPending ? "Analyzing..." : "Review Code"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interview Prep Tab */}
        <TabsContent value="interview">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Interview Prep
              </CardTitle>
              <CardDescription>Practice interview questions & get detailed answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill to Practice</label>
                <Input
                  placeholder="e.g., React, System Design, Algorithms, Backend..."
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  disabled={interviewPrepMutation.isPending}
                  data-testid="input-interview-skill"
                />
              </div>
              <Button
                onClick={() => interviewPrepMutation.mutate()}
                disabled={!selectedSkill.trim() || interviewPrepMutation.isPending}
                className="w-full"
                data-testid="button-interview-prep"
              >
                <Zap className="mr-2 h-4 w-4" />
                {interviewPrepMutation.isPending ? "Generating Questions..." : "Get Interview Questions"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Path Tab */}
        <TabsContent value="learning">
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Path Generator
              </CardTitle>
              <CardDescription>AI-designed personalized learning roadmap for mastery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Skill to Master</label>
                <Input
                  placeholder="e.g., Machine Learning, Web3, Mobile Dev..."
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  disabled={learningPathMutation.isPending}
                  data-testid="input-learning-skill"
                />
              </div>
              <Button
                onClick={() => learningPathMutation.mutate()}
                disabled={!selectedSkill.trim() || learningPathMutation.isPending}
                className="w-full"
                data-testid="button-generate-path"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {learningPathMutation.isPending ? "Creating Roadmap..." : "Generate Learning Path"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Skill Assessment Card - Quick Access */}
      <Card className="hover-elevate bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">Quick Skill Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Skill name..."
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              disabled={skillAssessmentMutation.isPending}
              data-testid="input-skill-name"
            />
            <Button
              onClick={() => skillAssessmentMutation.mutate()}
              disabled={!selectedSkill.trim() || skillAssessmentMutation.isPending}
              size="sm"
              data-testid="button-assess-skill"
            >
              {skillAssessmentMutation.isPending ? "Assessing..." : "Assess"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Responses */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">AI Mentor Responses</h2>
        {responses.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No responses yet. Start by asking a question or practicing interview skills!</p>
            </CardContent>
          </Card>
        ) : (
          responses.map((resp, idx) => (
            <Card key={idx} className="hover-elevate">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{resp.question}</CardTitle>
                  <Badge variant="outline" className="text-xs">{resp.timestamp}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">{resp.answer}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
