import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    interface User {
      id: string;
      claims?: any;
      access_token?: string;
      refresh_token?: string;
      expires_at?: number;
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Routes
  app.get("/api/auth/user", (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json(req.user);
  });

  app.post("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });

  // Profile Routes
  app.get("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const profile = await storage.getUserProfile(req.user.id);
    res.json(profile);
  });

  app.patch("/api/profile", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const updated = await storage.updateUserProfile(req.user.id, req.body);
    res.json(updated);
  });

  app.post("/api/profile/onboarding", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { interests, learningPace, cognitiveStyle, techTier } = req.body;
      const updated = await storage.updateUserProfile(req.user.id, {
        interests,
        learningPace,
        cognitiveStyle,
        techTier: techTier || "Beginner",
        onboardingCompleted: true,
      });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Dashboard
  app.get("/api/dashboard", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const profile = await storage.getUserProfile(req.user.id);
      const dailyQuests = await storage.getUserQuests(req.user.id);
      const dailyChallenges = await storage.getDailyChallenges();
      const arenas = await storage.getArenas();
      
      res.json({
        profile,
        dailyQuests: dailyQuests.slice(0, 3),
        dailyChallenges,
        arenas,
        stats: {
          streak: profile?.dailyStreak || 0,
          challengesCompleted: profile?.totalChallengesCompleted || 0,
          totalXp: profile?.xp || 0,
          rank: 100,
        },
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Arenas
  app.get("/api/arenas", async (req, res) => {
    const arenas = await storage.getArenas();
    res.json(arenas);
  });

  app.get("/api/arenas/:slug", async (req, res) => {
    const arena = await storage.getArenaBySlug(req.params.slug);
    if (!arena) return res.status(404).json({ error: "Arena not found" });
    res.json(arena);
  });

  // Challenges
  app.get("/api/challenges", async (req, res) => {
    const challenges = await storage.getChallenges();
    res.json(challenges);
  });

  app.get("/api/challenges/:id", async (req, res) => {
    const challenge = await storage.getChallengeById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Challenge not found" });
    res.json(challenge);
  });

  app.post("/api/challenges/:id/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uc = await storage.startChallenge(req.user.id, req.params.id);
      res.json(uc);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/challenges/:id/submit", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code, score } = req.body;
      const uc = await storage.submitChallenge(req.user.id, req.params.id, code, score);
      await storage.addXp(req.user.id, score);
      
      // Check if challenge is completed
      if (uc?.status === "completed") {
        const challenge = await storage.getChallengeById(req.params.id);
        const profile = await storage.getUserProfile(req.user.id);
        res.json({ 
          ...uc, 
          achievement: {
            title: `${challenge?.title} Mastered!`,
            xpEarned: score,
            newLevel: profile?.level,
            badge: "challenge_completed"
          }
        });
      } else {
        res.json(uc);
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get challenge stats
  app.get("/api/challenges/stats", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const userChallenges = await storage.getUserChallenges(req.user.id);
      const completed = userChallenges.filter((c) => c.status === "completed").length;
      const inProgress = userChallenges.filter((c) => c.status === "in_progress").length;
      const totalTime = userChallenges.reduce((sum, c) => sum + (c.timeSpent || 0), 0);
      const averageScore = userChallenges.length > 0 
        ? Math.round(userChallenges.reduce((sum, c) => sum + (c.score || 0), 0) / userChallenges.length)
        : 0;

      res.json({ completed, inProgress, totalTime, averageScore });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get("/api/user/projects", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const projects = await storage.getUserProjects(req.user.id);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const project = await storage.createProject({
        ...req.body,
        userId: req.user.id,
        isPublic: true,
      });
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Clans
  app.get("/api/clans", async (req, res) => {
    const clans = await storage.getClans();
    res.json(clans);
  });

  app.get("/api/user/clans", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const clans = await storage.getUserClans(req.user.id);
    res.json(clans);
  });

  app.post("/api/clans", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const clan = await storage.createClan({
        ...req.body,
        leaderId: req.user.id,
        isPublic: true,
      });
      res.json(clan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/clans/:clanId/join", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const member = await storage.joinClan(req.params.clanId, req.user.id);
      res.json(member);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Quests
  app.get("/api/quests", async (req, res) => {
    const quests = await storage.getQuests();
    res.json(quests);
  });

  app.get("/api/user/quests", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const quests = await storage.getUserQuests(req.user.id);
    res.json(quests);
  });

  app.post("/api/quests/:questId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uq = await storage.assignQuest(req.user.id, req.params.questId, req.body.target || 1);
      res.json(uq);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Courses
  app.get("/api/courses", async (req, res) => {
    const courses = await storage.getCourses();
    res.json(courses);
  });

  app.get("/api/user/courses", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const courses = await storage.getUserCourses(req.user.id);
    res.json(courses);
  });

  app.post("/api/courses/:courseId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const uc = await storage.startCourse(req.user.id, req.params.courseId);
      res.json(uc);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Messages
  app.get("/api/messages/conversations", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const conversations = await storage.getConversations(req.user.id);
    res.json(conversations);
  });

  app.get("/api/messages/:userId", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const messages = await storage.getMessages(req.user.id, req.params.userId);
    await storage.markMessagesRead(req.user.id, req.params.userId);
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const message = await storage.sendMessage({
        senderId: req.user.id,
        receiverId: req.body.receiverId,
        content: req.body.content,
      });
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Feed
  app.get("/api/feed", async (req, res) => {
    const feed = await storage.getFeedItems();
    res.json(feed);
  });

  // Roadmaps
  app.get("/api/roadmaps", async (req, res) => {
    const roadmaps = await storage.getRoadmaps();
    res.json(roadmaps);
  });

  app.get("/api/user/roadmaps", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    const roadmaps = await storage.getUserRoadmaps(req.user.id);
    res.json(roadmaps);
  });

  app.post("/api/roadmaps/:roadmapId/start", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const ur = await storage.startRoadmap(req.user.id, req.params.roadmapId);
      res.json(ur);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Leaderboard with multiple categories
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const category = req.query.category as string || "xp";
      const period = req.query.period as string || "all_time";
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(category, period, limit);
      res.json(leaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get user's leaderboard position
  app.get("/api/leaderboard/rank/:userId", async (req, res) => {
    try {
      const rank = await storage.getUserRank(req.params.userId);
      res.json(rank);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Clan leaderboard
  app.get("/api/leaderboard/clans", async (req, res) => {
    try {
      const leaderboard = await storage.getClanLeaderboard();
      res.json(leaderboard);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Mentors - Match based on skills
  app.get("/api/mentors", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/mentors/:mentorId/request", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const result = await storage.requestMentor(req.user.id, req.params.mentorId);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get recommended mentors based on user skills
  app.get("/api/mentors/recommended", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const userProfile = await storage.getUserProfile(req.user.id);
      const mentors = await storage.getMentors();
      
      const recommended = mentors.filter((mentor: any) => {
        const userSkills = userProfile?.interests || [];
        const mentorSkills = mentor.expertise || [];
        return mentorSkills.some((skill: string) => userSkills.includes(skill));
      });
      
      res.json(recommended.slice(0, 5));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Chat
  app.post("/api/ai/chat", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { message, history, action } = req.body;
      let response: string;

      if (process.env.OPENAI_API_KEY) {
        const { chatWithCopilot, explainCode, debugCode, generateLearningPath, answerTechQuestion, generateProjectIdea } = await import("./openai");

        if (action === "explain_code") {
          response = await explainCode(message);
        } else if (action === "debug_code") {
          const { code, error } = JSON.parse(message);
          response = await debugCode(code, error);
        } else if (action === "learning_path") {
          const { topic, skillLevel } = JSON.parse(message);
          response = await generateLearningPath(topic, skillLevel);
        } else if (action === "project_idea") {
          const { interests, skillLevel } = JSON.parse(message);
          response = await generateProjectIdea(interests, skillLevel);
        } else {
          response = await chatWithCopilot(message, history || []);
        }
      } else {
        response = "AI Copilot is being initialized. Please try again shortly.";
      }

      res.json({ response });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Code Explanation endpoint
  app.post("/api/ai/explain", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: "Code is required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ explanation: "AI features coming soon!" });
      }

      const { explainCode } = await import("./openai");
      const explanation = await explainCode(code);
      res.json({ explanation });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Debug endpoint
  app.post("/api/ai/debug", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { code, error } = req.body;
      if (!code || !error) return res.status(400).json({ error: "Code and error message required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ solution: "AI debugging coming soon!" });
      }

      const { debugCode } = await import("./openai");
      const solution = await debugCode(code, error);
      res.json({ solution });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // AI Quiz endpoint
  app.post("/api/ai/quiz", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    try {
      const { topic, difficulty } = req.body;
      if (!topic) return res.status(400).json({ error: "Topic is required" });

      if (!process.env.OPENAI_API_KEY) {
        return res.json({ question: "Sample question", options: ["A", "B", "C", "D"], correctAnswer: 0 });
      }

      const { generateQuizQuestion } = await import("./openai");
      const question = await generateQuizQuestion(topic, difficulty || "intermediate");
      res.json(question);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
