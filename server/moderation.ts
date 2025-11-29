import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Content safety filters
const BANNED_KEYWORDS = [
  "explicit",
  "adult content",
  "nsfw",
  "inappropriate",
  "harassment",
  "hate speech",
];

const CRINGE_PATTERNS = [
  /\b(simping|thirst|daddy)\b/i,
  /\b(nudes?|sexy|horny)\b/i,
  /\b(hate|kill|attack)\s+(group|people|race)\b/i,
];

// Check if content is safe
export function isSafeContent(text: string): {
  safe: boolean;
  reason?: string;
  severity?: "low" | "medium" | "high";
} {
  const lowerText = text.toLowerCase();

  // Check banned keywords
  for (const keyword of BANNED_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        safe: false,
        reason: `Content contains inappropriate keyword: "${keyword}"`,
        severity: "high",
      };
    }
  }

  // Check cringe patterns
  for (const pattern of CRINGE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        safe: false,
        reason: "Content violates community standards",
        severity: "medium",
      };
    }
  }

  // Check for spam-like behavior (too many repeated characters)
  if (/(.)\1{4,}/.test(text)) {
    return {
      safe: false,
      reason: "Content appears to be spam",
      severity: "low",
    };
  }

  return { safe: true };
}

// AI-powered content analysis
export async function analyzeContentWithAI(
  content: string,
  context: string = "community discussion"
): Promise<{
  safe: boolean;
  score: number;
  issues: string[];
  recommendation: "approve" | "review" | "reject";
}> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      safe: true,
      score: 100,
      issues: [],
      recommendation: "approve",
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a content moderation expert for a professional tech learning platform. Analyze content for appropriateness, professionalism, and community safety. Return JSON with: {safe: boolean, score: 0-100, issues: string[], recommendation: 'approve'|'review'|'reject'}",
        },
        {
          role: "user",
          content: `Analyze this ${context} for safety and professionalism:\n\n"${content}"\n\nReturn only valid JSON.`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      safe: result.safe !== false,
      score: result.score || 0,
      issues: result.issues || [],
      recommendation: result.recommendation || "review",
    };
  } catch (error) {
    return {
      safe: true,
      score: 50,
      issues: ["Unable to analyze with AI"],
      recommendation: "review",
    };
  }
}

// Report content
export async function reportContent(
  contentId: string,
  reportedBy: string,
  reason: string,
  description: string
) {
  return {
    reportId: `report_${Date.now()}`,
    contentId,
    reportedBy,
    reason,
    description,
    status: "pending_review",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Flag user behavior
export async function flagUserBehavior(
  userId: string,
  behavior: string,
  severity: "low" | "medium" | "high"
) {
  return {
    flagId: `flag_${Date.now()}`,
    userId,
    behavior,
    severity,
    status: "active",
    createdAt: new Date(),
  };
}

// Community guidelines
export const COMMUNITY_GUIDELINES = {
  title: "TechHive Community Guidelines",
  rules: [
    {
      id: 1,
      title: "Be Respectful",
      description: "Treat all members with respect and courtesy. No harassment, bullying, or hate speech.",
    },
    {
      id: 2,
      title: "Keep It Professional",
      description: "Maintain professional language. This is a tech learning platform, not a dating site.",
    },
    {
      id: 3,
      title: "No Explicit Content",
      description: "Do not share sexual, adult, or explicit content. This applies to all discussions and projects.",
    },
    {
      id: 4,
      title: "No Spam",
      description: "Do not spam, flood, or post repetitive content.",
    },
    {
      id: 5,
      title: "Tech-Focused Communities",
      description: "Communities must be focused on learning and sharing tech knowledge.",
    },
    {
      id: 6,
      title: "No Misinformation",
      description: "Share accurate information. Deliberately spreading false info will result in warnings.",
    },
    {
      id: 7,
      title: "Respect Privacy",
      description: "Do not share others' personal information without consent.",
    },
    {
      id: 8,
      title: "Report Violations",
      description: "Use the report feature to flag violations. We take all reports seriously.",
    },
  ],
};

// Get moderation status
export async function getModerationStatus(userId: string) {
  return {
    userId,
    status: "good_standing",
    warnings: 0,
    flags: 0,
    suspensions: 0,
    lastViolation: null,
    guidelines_accepted: true,
  };
}
