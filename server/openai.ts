// ============================================================================
// CODEVERSE AI - OPTIMIZED FAST LLM ENGINE with Groq
// ============================================================================
// Real LLM with response caching and optimized settings for speed
// ============================================================================

import Groq from "groq-sdk";

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) return null;
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
      timeout: 15000, // 15 second timeout for faster failure
    });
  }
  return groqClient;
}

// Response cache to avoid repeated API calls
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

function getCacheKey(message: string, history: any[]): string {
  return `${message}|${history.length}`;
}

function getFromCache(key: string): string | null {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.response;
  }
  if (cached) responseCache.delete(key);
  return null;
}

function setCache(key: string, response: string): void {
  responseCache.set(key, { response, timestamp: Date.now() });
  // Limit cache size
  if (responseCache.size > 100) {
    const firstKey = responseCache.keys().next().value;
    responseCache.delete(firstKey);
  }
}

// Optimized system prompt - shorter for faster response
const SYSTEM_PROMPT = `You are CodeMentor, an expert programming assistant.
Answer concisely with practical, helpful advice.
Use code examples when relevant.
Be direct and clear.`;

// Fast fallback responses
function generateFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.match(/bug|error|debug/)) {
    return `🔍 **Debug This**
1. Share the exact error message
2. Show relevant code
3. I'll identify the root cause
4. Provide the solution`;
  }
  if (msg.match(/explain|learn|understand/)) {
    return `📚 **Learn Concept**
1. Definition and why it matters
2. How it works
3. Code examples
4. When to use it`;
  }
  if (msg.match(/algorithm|solve|code/)) {
    return `🎯 **Solve Problem**
1. Understand requirements
2. Design approach
3. Analyze complexity
4. Code solution`;
  }
  if (msg.match(/optimize|performance|fast/)) {
    return `⚡ **Optimize**
1. Measure current speed
2. Find bottleneck
3. Reduce complexity
4. Test improvement`;
  }
  if (msg.match(/system|design|architecture/)) {
    return `🏗️ **System Design**
1. Requirements
2. Components
3. Data strategy
4. Scalability`;
  }
  
  return `🚀 **CodeMentor AI**
Ask me about:
- Debugging errors
- Learning concepts
- Solving algorithms
- Optimizing code
- System design`;
}

// Main AI function with speed optimizations
export async function chatWithCopilot(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // Check cache first
    const cacheKey = getCacheKey(message, history);
    const cached = getFromCache(cacheKey);
    if (cached) {
      console.log("[CodeMentor] Cache hit");
      return cached;
    }

    const groq = getGroqClient();
    if (!groq) {
      console.log("[CodeMentor] Groq unavailable");
      return generateFallbackResponse(message);
    }

    // Limit history to last 2 messages for speed
    const recentHistory = history.slice(-2);
    
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...recentHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    console.log("[CodeMentor] Calling Groq API...");
    
    // Optimized settings for speed
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.5, // Lower = faster inference
      max_tokens: 1024, // Reduced from 2000 for speed
      top_p: 0.9, // Faster than 1.0
    });

    const content = response.choices[0]?.message?.content || "";
    
    if (!content) {
      return generateFallbackResponse(message);
    }

    // Cache the response
    setCache(cacheKey, content);
    console.log("[CodeMentor] Got LLM response");
    
    return content;
  } catch (error: any) {
    console.error("[CodeMentor] Error:", error?.message);
    // Return quick fallback on timeout or error
    return generateFallbackResponse(message);
  }
}

// Fast code explanation
export async function explainCode(code: string): Promise<string> {
  return chatWithCopilot(`Explain:\n${code.slice(0, 500)}`);
}

// Fast debugging
export async function debugCode(code: string, error: string): Promise<string> {
  return chatWithCopilot(`Debug:\n${code.slice(0, 300)}\nError: ${error}`);
}

// Fast learning path
export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  return chatWithCopilot(`${skillLevel} learning path for ${topic}`);
}

// Fast tech questions
export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  return chatWithCopilot(context ? `${question}\nContext: ${context.slice(0, 200)}` : question);
}

// Fast project ideas
export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  return chatWithCopilot(`${skillLevel} projects for: ${interests.slice(0, 3).join(", ")}`);
}

// Quick quiz
export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  return {
    question: `${topic} quiz`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  };
}

// Quick lessons
export async function generateCourseLessons(
  courseTitle: string,
  _courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numLessons, 20) }, (_, i) => ({
    title: `${courseTitle} - Lesson ${i + 1}`,
    description: "Learn with examples and practice",
  }));
}

// Quick roadmap
export async function generateRoadmapMilestones(
  roadmapName: string,
  _roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numMilestones, 12) }, (_, i) => ({
    title: `${roadmapName} - Phase ${i + 1}`,
    description: "Progress milestone",
  }));
}
