// ============================================================================
// CODEVERSE AI - REAL LLM ENGINE with Groq
// ============================================================================
// Actual large language model reasoning with multi-turn conversation
// Falls back to expert templates if API unavailable
// ============================================================================

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const HAS_GROQ = !!process.env.GROQ_API_KEY;

// System prompt for programming expert
const SYSTEM_PROMPT = `You are CodeMentor, an expert programming AI assistant specializing in:
- Debugging and error resolution
- Algorithm design and optimization
- System architecture and design patterns
- Code explanation and learning
- Performance optimization

You provide structured, detailed responses with:
1. Clear problem analysis
2. Step-by-step solutions
3. Code examples when relevant
4. Complexity analysis for algorithms
5. Best practices and common pitfalls

Always format responses clearly with headers, bullet points, and examples.
Keep responses concise but comprehensive.
When debugging, ask clarifying questions if needed.
Provide multiple approaches when applicable.`;

// Fallback responses if API is not available
function generateFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.match(/bug|error|crash|fix|debug|exception|stack|trace/)) {
    return `🔍 **Debugging Assistant**

**Approach to fixing this:**
1. Identify the exact error type
2. Find where it occurs
3. Trace the root cause
4. Test your fix
5. Prevent future occurrences

**Share your error message and code for specific help!**`;
  }
  if (msg.match(/explain|understand|how|why|what|concept|learn|teach/)) {
    return `📚 **Learning Mode**

I'll explain concepts with:
- Clear definitions
- Real examples
- Practical applications
- Common misconceptions
- When to use it

**What concept would you like to understand?**`;
  }
  if (msg.match(/algorithm|solve|code|implement|design|approach/)) {
    return `🎯 **Algorithm Design**

**My approach:**
1. Understand the problem
2. Analyze complexity
3. Design the solution
4. Code it clearly
5. Optimize if needed

**Share the problem details!**`;
  }
  if (msg.match(/optimize|faster|performance|slow/)) {
    return `⚡ **Performance Optimization**

**Optimization strategy:**
1. Measure current speed
2. Find the bottleneck
3. Reduce complexity
4. Test the improvement
5. Document changes

**Share your code and metrics!**`;
  }
  if (msg.match(/system|architecture|scale|design/)) {
    return `🏗️ **System Design**

**Design framework:**
1. Functional requirements
2. Non-functional requirements
3. Component architecture
4. Data strategy
5. Scalability plan

**What system are you designing?**`;
  }
  
  return `🚀 **CodeMentor AI - Your Programming Expert**

Ask me about:
- 🐛 Debugging errors
- 📚 Learning concepts
- 🎯 Algorithm problems
- ⚡ Performance optimization
- 🏗️ System architecture

**What can I help you with?**`;
}

// Main AI function using Groq
export async function chatWithCopilot(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // If no Groq API key, use fallback
    if (!HAS_GROQ) {
      console.log("Groq API not available, using fallback responses");
      return generateFallbackResponse(message);
    }

    // Prepare conversation for Groq
    const messages: Array<{ role: "user" | "assistant"; content: string }> = [
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Call Groq API for real LLM reasoning
    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768", // Fast and powerful open-source model
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        ...messages,
      ],
      temperature: 0.7, // Balanced creativity and consistency
      max_tokens: 2000, // Generous response length
      top_p: 1,
      stream: false,
    });

    const content = response.choices[0]?.message?.content || "";
    if (!content) {
      return generateFallbackResponse(message);
    }

    return content;
  } catch (error: any) {
    console.error("Groq API error:", error?.message);
    // Fall back to template responses on API error
    return generateFallbackResponse(message);
  }
}

// Code explanation with real LLM
export async function explainCode(code: string): Promise<string> {
  const prompt = `Analyze and explain this code thoroughly:

\`\`\`
${code}
\`\`\`

Provide:
1. What does this code do?
2. How does it work step-by-step?
3. Key concepts being used
4. Potential issues or improvements
5. Performance characteristics`;

  return chatWithCopilot(prompt);
}

// Debugging with real LLM reasoning
export async function debugCode(code: string, error: string): Promise<string> {
  const prompt = `Help me debug this code:

**Code:**
\`\`\`
${code}
\`\`\`

**Error:**
\`\`\`
${error}
\`\`\`

Provide:
1. What caused this error?
2. Where is the root cause?
3. Step-by-step fix
4. How to prevent it
5. Testing strategy`;

  return chatWithCopilot(prompt);
}

// Learning path with reasoning
export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const prompt = `Create a structured learning path for a ${skillLevel} developer learning ${topic}.

Include:
1. Prerequisites needed
2. Core concepts to master (in order)
3. Practical exercises at each stage
4. Projects to build understanding
5. Advanced topics when ready
6. Resources and practice tips
7. Estimated timeline`;

  return chatWithCopilot(prompt);
}

// Tech questions with real reasoning
export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const prompt = context 
    ? `${question}\n\nAdditional context:\n${context}`
    : question;
  
  return chatWithCopilot(prompt);
}

// Project ideas with real LLM
export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const prompt = `Suggest innovative project ideas for a ${skillLevel} developer interested in: ${interests.join(", ")}

For each idea provide:
1. Project name and description
2. Skills it teaches
3. Technical stack recommendation
4. Implementation steps
5. Enhancement opportunities
6. Learning outcomes`;

  return chatWithCopilot(prompt);
}

// Quiz generation with LLM
export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  try {
    if (!HAS_GROQ) {
      return {
        question: `What's a key concept in ${topic}?`,
        options: ["Concept A", "Concept B", "Concept C", "Concept D"],
        correctAnswer: 0,
      };
    }

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system" as const,
          content: `Generate a ${difficulty} level multiple choice question about ${topic}. 
          Return ONLY valid JSON with: {"question": "...", "options": ["A","B","C","D"], "correctAnswer": 0-3}`,
        },
        {
          role: "user" as const,
          content: `Generate a ${difficulty} quiz question about ${topic}`,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content || "";
    try {
      return JSON.parse(content);
    } catch {
      return {
        question: `What's a key concept in ${topic}?`,
        options: ["Concept A", "Concept B", "Concept C", "Concept D"],
        correctAnswer: 0,
      };
    }
  } catch (error) {
    return {
      question: `What's a key concept in ${topic}?`,
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      correctAnswer: 0,
    };
  }
}

// Course lessons with LLM generation
export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  try {
    if (!HAS_GROQ) {
      return Array.from({ length: Math.min(numLessons, 20) }, (_, i) => ({
        title: `${courseTitle} - Lesson ${i + 1}`,
        description: "Learn key concepts with examples and practice",
      }));
    }

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system" as const,
          content: `Generate ${numLessons} course lessons as JSON array. Each lesson: {"title": "...", "description": "..."}
          Return ONLY valid JSON array.`,
        },
        {
          role: "user" as const,
          content: `Create lessons for: ${courseTitle}\nDescription: ${courseDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "";
    try {
      return JSON.parse(content);
    } catch {
      return Array.from({ length: Math.min(numLessons, 20) }, (_, i) => ({
        title: `${courseTitle} - Lesson ${i + 1}`,
        description: "Master concepts with structured learning",
      }));
    }
  } catch (error) {
    return Array.from({ length: Math.min(numLessons, 20) }, (_, i) => ({
      title: `${courseTitle} - Lesson ${i + 1}`,
      description: "Learn and practice key concepts",
    }));
  }
}

// Roadmap generation with LLM
export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  try {
    if (!HAS_GROQ) {
      return Array.from({ length: Math.min(numMilestones, 12) }, (_, i) => ({
        title: `${roadmapName} - Phase ${i + 1}`,
        description: "Progress through structured milestones",
      }));
    }

    const response = await groq.chat.completions.create({
      model: "mixtral-8x7b-32768",
      messages: [
        {
          role: "system" as const,
          content: `Generate ${numMilestones} roadmap milestones as JSON array. Each: {"title": "...", "description": "..."}
          Return ONLY valid JSON array.`,
        },
        {
          role: "user" as const,
          content: `Create milestones for: ${roadmapName}\nDescription: ${roadmapDescription}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || "";
    try {
      return JSON.parse(content);
    } catch {
      return Array.from({ length: Math.min(numMilestones, 12) }, (_, i) => ({
        title: `${roadmapName} - Phase ${i + 1}`,
        description: "Progress and learn structured content",
      }));
    }
  } catch (error) {
    return Array.from({ length: Math.min(numMilestones, 12) }, (_, i) => ({
      title: `${roadmapName} - Phase ${i + 1}`,
      description: "Work through roadmap milestones",
    }));
  }
}
