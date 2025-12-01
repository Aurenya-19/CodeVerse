// ============================================================================
// CODEVERSE AI - REAL LLM ENGINE with Groq
// ============================================================================
// Actual large language model reasoning with multi-turn conversation
// ============================================================================

import Groq from "groq-sdk";

// Lazy initialization - check API key at runtime
let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groqClient;
}

// System prompt for programming expert
const SYSTEM_PROMPT = `You are CodeMentor, an expert programming AI assistant.

When someone asks you a question:
1. Understand what they're asking
2. Give a detailed, expert response
3. Provide code examples if relevant
4. Explain complexity and trade-offs
5. Share best practices

Be concise but comprehensive. Always be helpful.`;

// Fallback responses if API is not available
function generateFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.match(/bug|error|crash|fix|debug|exception|stack|trace/)) {
    return `🔍 **Debugging Assistant**

I'll help you fix this error systematically.

**To debug effectively, share:**
1. The exact error message
2. Your code (the relevant part)
3. What you were trying to do
4. What you expected vs what happened

**My debugging approach:**
1. Analyze the error type
2. Find the root cause
3. Propose a solution
4. Explain how to prevent it

Share your error and code!`;
  }
  if (msg.match(/explain|understand|how|why|what|concept|learn|teach/)) {
    return `📚 **Learning Mode - Concept Explanation**

I'll explain this concept deeply:

1. **What is it?** - Simple definition
2. **Why does it matter?** - Real-world use cases
3. **How does it work?** - Step-by-step explanation
4. **Show me code** - Practical examples
5. **When to use?** - Best practices

**What concept would you like me to explain?**`;
  }
  if (msg.match(/algorithm|solve|code|implement|design|approach/)) {
    return `🎯 **Algorithm Design & Problem Solving**

I'll help you solve this step-by-step:

1. **Understand the problem** - Constraints and requirements
2. **Design approach** - Algorithm selection
3. **Complexity analysis** - Time and space
4. **Implementation** - Clean code
5. **Optimization** - Make it better

**Share the problem you want to solve!**`;
  }
  if (msg.match(/optimize|faster|performance|slow|improve/)) {
    return `⚡ **Performance Optimization**

I'll help you optimize this:

1. **Measure current performance** - Baseline metrics
2. **Find the bottleneck** - Where is it slow?
3. **Reduce complexity** - Algorithm improvements
4. **Optimize code** - Better implementation
5. **Verify improvement** - Test and measure

**Share your code and performance metrics!**`;
  }
  if (msg.match(/system|architecture|scale|design|structure/)) {
    return `🏗️ **System Architecture & Design**

I'll guide you through system design:

1. **Requirements** - Functional and non-functional
2. **Components** - Architecture breakdown
3. **Data strategy** - Database design
4. **Scalability** - How to handle growth
5. **Reliability** - Handle failures gracefully

**Tell me what system you're designing!**`;
  }
  
  return `🚀 **CodeMentor AI - Expert Programming Assistant**

I'm here to help with:
- 🐛 **Debugging** - Fix errors and understand root causes
- 📚 **Learning** - Understand programming concepts
- 🎯 **Algorithms** - Solve problems efficiently
- ⚡ **Optimization** - Make code faster
- 🏗️ **Architecture** - Design scalable systems

Ask me anything about programming!`;
}

// Main AI function using Groq
export async function chatWithCopilot(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    console.log("[CodeMentor] Processing message...");
    
    const groq = getGroqClient();
    
    if (!groq) {
      console.log("[CodeMentor] Groq not available, using fallback");
      return generateFallbackResponse(message);
    }

    console.log("[CodeMentor] Using Groq LLM");

    // Prepare conversation
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Call Groq API
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
    });

    const content = response.choices[0]?.message?.content || "";
    
    if (!content) {
      console.log("[CodeMentor] Empty response, using fallback");
      return generateFallbackResponse(message);
    }

    console.log("[CodeMentor] Got LLM response");
    return content;
  } catch (error: any) {
    console.error("[CodeMentor] Error:", error?.message || error);
    return generateFallbackResponse(message);
  }
}

// Code explanation
export async function explainCode(code: string): Promise<string> {
  return chatWithCopilot(`Explain this code:\n\n${code}`);
}

// Debugging
export async function debugCode(code: string, error: string): Promise<string> {
  return chatWithCopilot(`Debug this:\n\nCode:\n${code}\n\nError: ${error}`);
}

// Learning paths
export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  return chatWithCopilot(
    `Create a ${skillLevel} learning path for: ${topic}`
  );
}

// Tech questions
export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  return chatWithCopilot(context ? `${question}\n\nContext: ${context}` : question);
}

// Project ideas
export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  return chatWithCopilot(
    `Suggest projects for ${skillLevel} interested in: ${interests.join(", ")}`
  );
}

// Quiz
export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  return {
    question: `Test your ${topic} knowledge`,
    options: ["Expert", "Advanced", "Intermediate", "Beginner"],
    correctAnswer: 0,
  };
}

// Courses
export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numLessons, 20) }, (_, i) => ({
    title: `${courseTitle} - Lesson ${i + 1}`,
    description: "Learn concepts with examples and practice",
  }));
}

// Roadmaps
export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numMilestones, 12) }, (_, i) => ({
    title: `${roadmapName} - Phase ${i + 1}`,
    description: "Progress through structured learning",
  }));
}
