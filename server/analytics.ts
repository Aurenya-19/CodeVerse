// Analytics & Reporting
import { storage } from "./storage";

export async function getUserAnalytics(userId: string) {
  return { userId, totalXP: 5000, level: 5, challenges: 45, projects: 8 };
}

export async function getLearningGoals(userId: string) {
  return {
    goals: [
      { id: "g1", title: "Master React", category: "Frontend", progress: 65, dueDate: "2025-02-28" },
      { id: "g2", title: "Learn DevOps", category: "DevOps", progress: 30, dueDate: "2025-03-31" },
    ],
  };
}

export async function setLearningGoal(userId: string, title: string, category: string, dueDate: string, milestones: number) {
  return {
    id: `goal_${Date.now()}`,
    userId,
    title,
    category,
    dueDate,
    milestones,
    createdAt: new Date(),
  };
}

export async function getLearningStats(userId: string) {
  return {
    totalChallengesCompleted: 45,
    averageScore: 78,
    totalHoursSpent: 120,
    currentStreak: 12,
    topicsMastered: ["JavaScript", "React", "Node.js"],
  };
}

export async function getTimeManagement(userId: string) {
  return {
    weeklyHours: 15,
    dailyAverage: 2.1,
    peakHours: "7-9 PM",
    mostProductiveDay: "Tuesday",
    learningSchedule: { Monday: 2, Tuesday: 3, Wednesday: 2 },
  };
}

export async function getPerformanceBenchmarks(userId: string) {
  return {
    overallPercentile: 85,
    challengeCompletion: 92,
    skillBalance: "Balanced",
    speedRank: "Top 15%",
    accuracyRank: "Top 20%",
  };
}

export async function getProgressTimeline(userId: string, days: number) {
  const timeline = [];
  for (let i = days; i >= 0; i--) {
    timeline.push({
      date: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
      xpGained: Math.floor(Math.random() * 200) + 50,
      challengesCompleted: Math.floor(Math.random() * 3),
    });
  }
  return timeline;
}
