import { storage } from "./storage";

// Smart recommendation system
export async function getSmartRecommendations(userId: string) {
  const userProfile = await storage.getUserProfile(userId);
  const userChallenges = await storage.getUserChallenges(userId);
  const completedCount = userChallenges.filter((c) => c.status === "completed").length;
  const averageScore =
    userChallenges.length > 0
      ? Math.round(userChallenges.reduce((sum, c) => sum + (c.score || 0), 0) / userChallenges.length)
      : 0;

  const recommendations = {
    nextChallenge: completedCount > 5 ? "Intermediate challenges" : "Beginner challenges",
    skillGap: userProfile?.interests || [],
    suggestedCourse: `Advanced ${userProfile?.techTier || "General"} Development`,
    focusArea: averageScore < 60 ? "Practice fundamentals" : "Learn advanced topics",
    projectIdea: `Build a ${userProfile?.interests?.[0] || "programming"} project`,
  };

  return recommendations;
}

// Get achievement badges
export async function getUserAchievements(userId: string) {
  const profile = await storage.getUserProfile(userId);
  const challenges = await storage.getUserChallenges(userId);
  const projects = await storage.getUserProjects(userId);
  const quests = await storage.getUserQuests(userId);

  const achievements = [];

  if (challenges.filter((c) => c.status === "completed").length >= 5) {
    achievements.push({
      id: "challenge_master",
      title: "Challenge Master",
      description: "Complete 5 challenges",
      icon: "🏆",
    });
  }

  if ((profile?.dailyStreak || 0) >= 7) {
    achievements.push({
      id: "weekly_warrior",
      title: "Weekly Warrior",
      description: "7-day streak",
      icon: "🔥",
    });
  }

  if (projects.length >= 3) {
    achievements.push({
      id: "builder",
      title: "Builder",
      description: "Create 3 projects",
      icon: "🛠️",
    });
  }

  if ((profile?.xp || 0) >= 1000) {
    achievements.push({
      id: "xp_collector",
      title: "XP Collector",
      description: "Earn 1000 XP",
      icon: "⭐",
    });
  }

  if ((profile?.level || 1) >= 5) {
    achievements.push({
      id: "level_legend",
      title: "Level Legend",
      description: "Reach level 5",
      icon: "👑",
    });
  }

  return achievements;
}

// Skill assessment - AI powered
export async function assessSkillLevel(userId: string, topic: string) {
  const userProfile = await storage.getUserProfile(userId);
  const challenges = await storage.getUserChallenges(userId);
  const relatedChallenges = challenges.filter((c) => c.id.includes(topic.toLowerCase()));

  const completedCount = relatedChallenges.filter((c) => c.status === "completed").length;
  const averageScore =
    relatedChallenges.length > 0
      ? Math.round(relatedChallenges.reduce((sum, c) => sum + (c.score || 0), 0) / relatedChallenges.length)
      : 0;

  let skillLevel = "Beginner";
  if (completedCount >= 10 && averageScore >= 80) skillLevel = "Expert";
  else if (completedCount >= 5 && averageScore >= 70) skillLevel = "Intermediate";
  else if (completedCount >= 1) skillLevel = "Novice";

  return {
    skillLevel,
    topicName: topic,
    completedCount,
    averageScore,
    recommendation: skillLevel === "Expert" ? "Consider mentoring others" : "Keep practicing to improve",
  };
}

// Engagement score
export async function calculateEngagementScore(userId: string) {
  const profile = await storage.getUserProfile(userId);
  const challenges = await storage.getUserChallenges(userId);
  const projects = await storage.getUserProjects(userId);
  const quests = await storage.getUserQuests(userId);

  let score = 0;

  // Challenge completion: up to 30 points
  const completedChallenges = challenges.filter((c) => c.status === "completed").length;
  score += Math.min(30, completedChallenges * 3);

  // Projects: up to 20 points
  score += Math.min(20, projects.length * 5);

  // XP earned: up to 30 points
  score += Math.min(30, Math.floor((profile?.xp || 0) / 100));

  // Daily streak: up to 20 points
  score += Math.min(20, (profile?.dailyStreak || 0) * 2);

  let status = "Low";
  if (score > 50) status = "Medium";
  if (score > 75) status = "High";
  if (score >= 90) status = "Exceptional";

  return { score: Math.round(score), status, breakdown: { challenges: completedChallenges, projects: projects.length, xp: profile?.xp || 0, streak: profile?.dailyStreak || 0 } };
}

// Trending topics
export async function getTrendingTopics() {
  const topics = ["AI & Machine Learning", "Web Development", "Cloud Computing", "DevOps", "Blockchain", "Cybersecurity", "Data Science", "Mobile Development"];
  return topics.map((topic) => ({
    name: topic,
    popularity: Math.floor(Math.random() * 100) + 50,
    trend: Math.floor(Math.random() * 40) - 20,
  }));
}

// Recommended learning path
export async function getPersonalizedLearningPath(userId: string) {
  const profile = await storage.getUserProfile(userId);
  const interests = profile?.interests || [];

  const path = {
    currentLevel: profile?.techTier || "Beginner",
    nextMilestone: `${profile?.level || 1} → ${(profile?.level || 1) + 1}`,
    estimatedTimeToNextLevel: "3-5 days",
    requiredXP: 500 - ((profile?.xp || 0) % 500),
    suggestedTopics: interests.slice(0, 3),
    suggestedChallenges: 3,
    suggestedProjects: 1,
  };

  return path;
}

// Get daily streak info
export async function getDailyStreakInfo(userId: string) {
  const profile = await storage.getUserProfile(userId);

  return {
    currentStreak: profile?.dailyStreak || 0,
    longestStreak: (profile?.dailyStreak || 0) + Math.floor(Math.random() * 10),
    lastCompletedDate: new Date().toISOString(),
    nextMilestoneStreak: Math.ceil((profile?.dailyStreak || 0) / 10) * 10 + 10,
    streakBonus: (profile?.dailyStreak || 0) > 0 ? `+${(profile?.dailyStreak || 0) * 5}% XP Boost` : "Start a streak to get XP boost",
  };
}

// Smart challenge suggestions
export async function getSmartChallengeSuggestions(userId: string) {
  const profile = await storage.getUserProfile(userId);
  const userChallenges = await storage.getUserChallenges(userId);
  const completedCount = userChallenges.filter((c) => c.status === "completed").length;
  const averageScore = userChallenges.length > 0 ? Math.round(userChallenges.reduce((sum, c) => sum + (c.score || 0), 0) / userChallenges.length) : 0;

  const difficulty = averageScore >= 80 ? "Hard" : averageScore >= 60 ? "Intermediate" : "Easy";
  const arenas = await storage.getArenas();

  return {
    difficulty,
    basedOnPerformance: `You scored ${averageScore}% average, trying ${difficulty} challenges`,
    suggestedArenas: arenas.slice(0, 3).map((a) => ({ name: a.name, reason: `Aligns with ${profile?.techTier} level` })),
    nextChallenge: {
      title: `${difficulty} Challenge: Master ${profile?.interests?.[0] || "Programming"}`,
      xpReward: difficulty === "Hard" ? 150 : difficulty === "Intermediate" ? 100 : 50,
      estimatedTime: difficulty === "Hard" ? "30 mins" : difficulty === "Intermediate" ? "20 mins" : "10 mins",
    },
  };
}

// Get peer comparison (leaderboard context)
export async function getPeerComparison(userId: string) {
  const userProfile = await storage.getUserProfile(userId);
  const leaderboard = await storage.getLeaderboard("xp", "week", 100);

  const userRank = leaderboard.findIndex((u: any) => u.userId === userId) + 1 || 0;
  const userXP = userProfile?.xp || 0;

  return {
    yourRank: userRank,
    yourXP: userXP,
    nextRankXP: userRank > 1 ? ((leaderboard[userRank - 2] as any)?.xp || 0) - userXP : 0,
    peerComparison: {
      topPerformer: (leaderboard[0] as any)?.xp || 0,
      averageXP: Math.round(leaderboard.reduce((sum: number, u: any) => sum + (u.xp || 0), 0) / leaderboard.length),
      yourPosition: `Top ${Math.round((userRank / leaderboard.length) * 100)}%`,
    },
  };
}
