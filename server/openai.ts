import OpenAI from "openai";

// The newest OpenAI model is "gpt-5" which was released August 7, 2025. Do not change unless explicitly requested.
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function explainCode(code: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a helpful programming tutor. Explain code clearly and concisely for learning purposes.",
      },
      {
        role: "user",
        content: `Explain this code and what it does:\n\n${code}`,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert debugger. Help developers fix their code and understand the errors they're getting.",
      },
      {
        role: "user",
        content: `I have this code:\n\n${code}\n\nAnd I'm getting this error:\n\n${error}\n\nHow do I fix it?`,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are an expert learning path designer. Create structured, practical learning roadmaps.",
      },
      {
        role: "user",
        content: `Create a learning path for someone at ${skillLevel} level learning ${topic}. Include key concepts, projects, and milestones.`,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a helpful tech tutor on TechHive. Provide clear, practical answers with examples when helpful.",
      },
      {
        role: "user",
        content: context ? `${question}\n\nContext: ${context}` : question,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a creative project mentor. Suggest practical, achievable projects that align with user interests.",
      },
      {
        role: "user",
        content: `Suggest an interesting project for someone interested in ${interests.join(", ")} at ${skillLevel} level. Include implementation steps.`,
      },
    ],
  });

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(topic: string, difficulty: string): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: 'You are a tech quiz expert. Generate multiple choice questions in JSON format: {"question": "text", "options": ["a", "b", "c", "d"], "correctAnswer": 0}',
      },
      {
        role: "user",
        content: `Generate a ${difficulty} difficulty quiz question about ${topic}. Return only valid JSON.`,
      },
    ],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(response.choices[0].message.content || "{}");
  } catch {
    return {
      question: "What is programming?",
      options: ["Writing code", "Fixing bugs", "All of the above", "None of the above"],
      correctAnswer: 2,
    };
  }
}

export async function chatWithCopilot(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: "system" as const,
      content: "You are TechHive AI Copilot, a friendly tech learning assistant. Help users learn programming, debug code, and grow their skills. Be encouraging and practical.",
    },
    ...history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    {
      role: "user" as const,
      content: message,
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages,
    max_completion_tokens: 1024,
  });

  return response.choices[0].message.content || "I'm here to help! What would you like to learn?";
}
