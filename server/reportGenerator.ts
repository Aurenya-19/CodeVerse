// Generate monthly learning reports
export interface MonthlyReport {
  month: string;
  totalChallenges: number;
  completedChallenges: number;
  successRate: number;
  knowledgeGaps: { field: string; strength: "coding" | "theory" | "practical" }[];
  strengthAreas: string[];
  improvementAreas: string[];
  recommendations: string[];
}

export function generateMonthlyReport(submissions: any[], userProfile: any): MonthlyReport {
  const month = new Date().toISOString().substring(0, 7);
  const total = submissions.length;
  const completed = submissions.filter((s: any) => s.isCorrect).length;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Analyze submission patterns
  const hasBasicErrors = submissions.filter((s: any) => s.analysis?.whatWrong === "Missing core implementation").length;
  const hasLogicErrors = submissions.filter((s: any) => s.analysis?.whatWrong === "Code has an error").length;
  const hasOutputErrors = submissions.filter((s: any) => s.analysis?.why?.includes("output")).length;

  const knowledgeGaps = [
    {
      field: userProfile?.interests?.[0] || "General Coding",
      strength: hasBasicErrors > hasLogicErrors ? "coding" : "theory",
    },
  ];

  const strengthAreas = [
    successRate > 70 ? "Problem Solving" : "Keep practicing",
    submissions.length > 5 ? "Consistency" : "Need more attempts",
  ];

  const improvementAreas = [
    hasBasicErrors > 2 ? "Core Implementation" : undefined,
    hasLogicErrors > 2 ? "Logic & Algorithms" : undefined,
    hasOutputErrors > 2 ? "Output/Return Statements" : undefined,
  ].filter(Boolean) as string[];

  const recommendations = [
    `You completed ${completed} out of ${total} challenges (${successRate}% success rate)`,
    successRate < 50
      ? "Focus on understanding the problem before coding"
      : successRate < 80
        ? "Great progress! Focus on edge cases"
        : "Excellent work! Try harder challenges",
    `Your strongest area: ${strengthAreas[0]}`,
    improvementAreas.length > 0 ? `Focus on: ${improvementAreas.join(", ")}` : "Keep up the great work!",
  ];

  return {
    month,
    totalChallenges: total,
    completedChallenges: completed,
    successRate,
    knowledgeGaps,
    strengthAreas,
    improvementAreas,
    recommendations,
  };
}
