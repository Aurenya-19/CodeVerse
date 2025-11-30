import Anthropic from "@anthropic-ai/sdk";

// Claude Sonnet 4 - Most powerful open LLM + Perplexity for internet knowledge
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Smart AI selection - Claude for reasoning, Perplexity for internet knowledge
async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const isInternetQuery =
    userMessage.toLowerCase().includes("recent") ||
    userMessage.toLowerCase().includes("current") ||
    userMessage.toLowerCase().includes("latest") ||
    userMessage.toLowerCase().includes("2024") ||
    userMessage.toLowerCase().includes("2025") ||
    userMessage.toLowerCase().includes("today") ||
    userMessage.toLowerCase().includes("news");

  // Use Perplexity for internet-dependent questions, Claude for everything else
  if (isInternetQuery && process.env.PERPLEXITY_API_KEY) {
    return await callPerplexity(messages, options);
  }

  // Default to Claude for superior reasoning
  return await callClaude(messages, options);
}

async function callClaude(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514", // Latest Claude - most powerful
    max_tokens: options.max_tokens || options.max_completion_tokens || 2048,
    messages: messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })) as any,
  });

  return {
    choices: [
      {
        message: {
          content: response.content[0].type === "text" ? response.content[0].text : "",
        },
      },
    ],
  };
}

async function callPerplexity(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const response = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-sonar-large-128k-online", // Large model with internet access
      messages: messages.map((msg) => ({
        role: msg.role === "system" ? "system" : (msg.role as "user" | "assistant"),
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: options.max_tokens || options.max_completion_tokens || 2048,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    choices: [
      {
        message: {
          content: data.choices?.[0]?.message?.content || "",
        },
      },
    ],
  };
}

export async function explainCode(code: string): Promise<string> {
  const response = await callClaude([
    {
      role: "system",
      content:
        "You are an expert programming tutor. Explain code clearly, concisely, and comprehensively. Include best practices and potential improvements.",
    },
    {
      role: "user",
      content: `Explain this code in detail:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callClaude([
    {
      role: "system",
      content:
        "You are an expert debugger. Help developers fix errors with clear explanations. Provide step-by-step debugging strategies.",
    },
    {
      role: "user",
      content: `Fix this error:\n\nCode:\n${code}\n\nError:\n${error}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await callClaude([
    {
      role: "system",
      content:
        "You are a master learning architect. Create detailed, progressive learning paths with milestones, projects, and resources.",
    },
    {
      role: "user",
      content: `Create an expert learning path for ${skillLevel} learning ${topic}. Include: phases, key concepts, practical projects, estimated timelines, and resources.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are an expert tech mentor on CodeVerse. Provide comprehensive, accurate answers with examples, best practices, and resources.",
    },
    {
      role: "user",
      content: context ? `Question: ${question}\n\nContext: ${context}` : question,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const response = await callClaude([
    {
      role: "system",
      content:
        "You are a creative tech mentor. Suggest ambitious, achievable projects that combine interests and build real skills. Include implementation roadmaps.",
    },
    {
      role: "user",
      content: `Suggest an excellent project for someone interested in: ${interests.join(", ")} at ${skillLevel} level. Include: overview, tech stack, features, milestones, and resources.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const response = await callClaude([
    {
      role: "system",
      content:
        'You are a tech quiz expert. Generate challenging, educational quiz questions. Return ONLY valid JSON: {"question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0}',
    },
    {
      role: "user",
      content: `Generate a ${difficulty} quiz question about ${topic}. Return ONLY JSON, nothing else.`,
    },
  ]);

  try {
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch {
    return {
      question: "What is the primary benefit of using design patterns?",
      options: [
        "To make code reusable and maintainable",
        "To make code run faster",
        "To use less memory",
        "To avoid documentation",
      ],
      correctAnswer: 0,
    };
  }
}

export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await Promise.race([
      callClaude([
        {
          role: "system",
          content:
            "You are a master course designer. Create structured, engaging lessons. Format: Lesson Title|What students will learn (one per line)",
        },
        {
          role: "user",
          content: `Design ${numLessons} lessons for: ${courseTitle}\nOverview: ${courseDescription}\nFormat each as: Title|Description`,
        },
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 20000)),
    ]);

    const lines = response.choices[0].message.content?.split("\n").filter((l: string) => l.trim()) || [];
    return lines
      .slice(0, numLessons)
      .map((line: string) => {
        const [title, description] = line.split("|").map((s: string) => s.trim());
        return { title: title || "Lesson", description: description || "Learn core concepts" };
      })
      .filter((lesson) => lesson.title !== "");
  } catch (error) {
    console.error("Course generation failed:", error);
    return Array.from({ length: numLessons }, (_, i) => ({
      title: `${courseTitle} - Module ${i + 1}`,
      description: "Master advanced concepts and practical implementation",
    }));
  }
}

export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  try {
    const response = await Promise.race([
      callClaude([
        {
          role: "system",
          content:
            "You are a learning roadmap architect. Create progressive milestones with clear objectives. Format: Milestone|What you'll accomplish (one per line)",
        },
        {
          role: "user",
          content: `Design ${numMilestones} milestones for: ${roadmapName}\nDescription: ${roadmapDescription}\nFormat each as: Title|Description`,
        },
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 20000)),
    ]);

    const lines = response.choices[0].message.content?.split("\n").filter((l: string) => l.trim()) || [];
    return lines
      .slice(0, numMilestones)
      .map((line: string) => {
        const [title, description] = line.split("|").map((s: string) => s.trim());
        return { title: title || "Milestone", description: description || "Progress through this phase" };
      })
      .filter((milestone) => milestone.title !== "");
  } catch (error) {
    console.error("Roadmap generation failed:", error);
    return Array.from({ length: numMilestones }, (_, i) => ({
      title: `${roadmapName} - Phase ${i + 1}`,
      description: "Master advanced concepts and strategies",
    }));
  }
}

export async function chatWithCopilot(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: "system",
      content:
        "You are CodeMentor - an exceptionally knowledgeable tech AI assistant. Provide expert guidance on coding, learning, and tech careers. Be encouraging, practical, and comprehensive.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any, { max_completion_tokens: 2048 });

  return response.choices[0].message.content || "I'm here to help! Ask me anything about tech, programming, learning strategies, or career guidance.";
}
