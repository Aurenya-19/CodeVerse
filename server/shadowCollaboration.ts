// Shadow Collaboration - Invisible Teammates System
export async function createShadowSession(userId: string, projectId: string, teamSize: number) {
  return {
    sessionId: `shadow_${Date.now()}`,
    userId,
    projectId,
    teamSize,
    shadowTeammates: generateShadowTeammates(teamSize),
    status: "active",
    createdAt: new Date(),
    config: {
      visibilityMode: "invisible",
      contributionTracking: true,
      syncFrequency: "real-time",
      ghostMode: true,
    },
  };
}

function generateShadowTeammates(count: number) {
  const skills = ["Frontend", "Backend", "DevOps", "Testing", "Design", "Security"];
  const teammates = [];

  for (let i = 0; i < count; i++) {
    teammates.push({
      id: `shadow_${Date.now()}_${i}`,
      name: `Teammate ${i + 1}`,
      role: skills[i % skills.length],
      expertise: `Expert in ${skills[i % skills.length]}`,
      invisibleUntilComplete: true,
      contributionScore: 0,
    });
  }

  return teammates;
}

export async function getShadowTeammateContributions(sessionId: string) {
  return {
    sessionId,
    contributions: [
      {
        id: "contrib_1",
        teammateName: "Teammate 1",
        task: "Implemented authentication logic",
        completionTime: "8 minutes",
        quality: 92,
        revealedAt: null,
      },
      {
        id: "contrib_2",
        teammateName: "Teammate 2",
        task: "Wrote unit tests for API endpoints",
        completionTime: "12 minutes",
        quality: 88,
        revealedAt: null,
      },
      {
        id: "contrib_3",
        teammateName: "Teammate 3",
        task: "Optimized database queries",
        completionTime: "10 minutes",
        quality: 95,
        revealedAt: null,
      },
    ],
    projectProgress: 87,
    estimatedCompletion: "2 hours",
    invisibilityRemaining: 45,
  };
}

export async function revealShadowTeammate(sessionId: string, teammateId: string) {
  return {
    sessionId,
    revealed: true,
    teammate: {
      id: teammateId,
      name: "Alex Chen",
      realName: "Alex Chen",
      expertise: "Full-stack Development",
      level: 12,
      stats: {
        projectsCompleted: 45,
        contributionScore: 8750,
        averageQuality: 91,
        speed: "2x faster than average",
      },
    },
    contribution: {
      filesModified: 8,
      linesAdded: 342,
      linesRemoved: 127,
      quality: 94,
    },
    surpriseBonus: {
      xpBonus: 250,
      title: "Ghost Developer",
      message: "Amazing invisible teammate revealed!",
    },
  };
}

export async function getShadowSessionStats(sessionId: string) {
  return {
    sessionId,
    totalContribution: 87,
    teamworkScore: 92,
    speedMultiplier: 2.3,
    projectCompletion: 87,
    invisibleAchievements: [
      { id: "ia_1", name: "Ghost in the Code", description: "Complete a project with shadow team" },
      { id: "ia_2", name: "Phantom Developer", description: "Reach 90% quality in shadow session" },
    ],
    revealed: false,
    revealTime: new Date(Date.now() + 3600000).toISOString(),
  };
}

export async function shadowSpeedRound(sessionId: string, minutesLimit: number) {
  return {
    sessionId,
    speedRound: true,
    minutesLimit,
    objectives: [
      { id: "obj_1", task: "Setup project structure", estimatedTime: 2 },
      { id: "obj_2", task: "Implement core features", estimatedTime: 8 },
      { id: "obj_3", task: "Write tests", estimatedTime: 4 },
      { id: "obj_4", task: "Optimize code", estimatedTime: 1 },
    ],
    teamSpeedBonus: 1.5,
    startTime: new Date(),
    endTime: new Date(Date.now() + minutesLimit * 60000),
  };
}
