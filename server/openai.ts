import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// System prompt for CodeVerse AI
const SYSTEM_PROMPT = `You are CodeMentor AI, an expert programming tutor and coding assistant for CodeVerse - a gamified learning platform. You help developers of all levels with:

🔧 **Debugging** - Systematically identify and fix code errors
📚 **Learning** - Explain concepts clearly with examples
🎯 **Algorithms** - Design efficient solutions
⚡ **Optimization** - Improve code performance
🏗️ **System Design** - Architect scalable systems
🎨 **Best Practices** - Write clean, maintainable code

**Your personality:**
- Expert but approachable
- Use emojis sparingly for clarity
- Provide code examples when helpful
- Break down complex topics into digestible parts
- Encourage learning through practice

**Response format:**
- Be concise but thorough
- Use markdown for code blocks
- Structure responses with clear sections
- Provide actionable next steps

Always tailor your responses to the user's skill level and provide practical, hands-on guidance.`;

// Main AI chat function with Groq
export async function chatWithCopilot(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const messages: any[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("Groq API error:", error);
    return `🚀 **CodeMentor AI**\n\nI'm having trouble connecting right now. Please try again in a moment.\n\nIn the meantime, I can help with:\n- Debugging code errors\n- Explaining programming concepts\n- Algorithm design\n- Code optimization\n- System architecture\n- Best practices`;
  }
}

// Explain code with AI
export async function explainCode(code: string): Promise<string> {
  try {
    const prompt = `Analyze and explain this code in detail:

\`\`\`
${code}
\`\`\`

Provide:
1. **What it does** - High-level purpose
2. **How it works** - Step-by-step breakdown
3. **Key concepts** - Important programming concepts used
4. **Potential issues** - Bugs, edge cases, or improvements
5. **Best practices** - How to make it better`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Unable to explain code at this time.";
  } catch (error) {
    console.error("Code explanation error:", error);
    return "📖 **Code Explanation**\n\nI'm having trouble analyzing the code right now. Please try again.";
  }
}

// Debug code with AI
export async function debugCode(code: string, error: string): Promise<string> {
  try {
    const prompt = `Help debug this code error:

**Error Message:**
\`\`\`
${error}
\`\`\`

**Code:**
\`\`\`
${code}
\`\`\`

Provide:
1. **Error Analysis** - What the error means
2. **Root Cause** - Why it's happening
3. **Solution** - How to fix it with code example
4. **Prevention** - How to avoid this in the future`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Unable to debug at this time.";
  } catch (error) {
    console.error("Debug error:", error);
    return "🔍 **Debug Helper**\n\nI'm having trouble analyzing the error right now. Please try again.";
  }
}

// Generate personalized learning path
export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  try {
    const prompt = `Create a comprehensive learning path for:

**Topic:** ${topic}
**Current Level:** ${skillLevel}

Structure the path with:
1. **Prerequisites** - What to know before starting
2. **Core Concepts** - Essential topics to master (with timeline)
3. **Hands-on Practice** - Projects and exercises
4. **Advanced Topics** - Next-level skills
5. **Resources** - Best learning materials

Make it actionable and realistic for someone at the ${skillLevel} level.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || "Unable to generate learning path.";
  } catch (error) {
    console.error("Learning path error:", error);
    return "🎓 **Learning Path**\n\nI'm having trouble generating a path right now. Please try again.";
  }
}

// Answer technical questions
export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  return chatWithCopilot(context ? `${context}\n\n${question}` : question);
}

// Generate project ideas
export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  try {
    const prompt = `Generate 3 project ideas for:

**Interests:** ${interests.join(", ")}
**Skill Level:** ${skillLevel}

For each project provide:
- **Name** - Catchy project title
- **Description** - What it does
- **Tech Stack** - Technologies to use
- **Difficulty** - Time estimate
- **Learning Goals** - What you'll learn

Make them practical and achievable for ${skillLevel} developers.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    });

    return completion.choices[0]?.message?.content || "Unable to generate project ideas.";
  } catch (error) {
    console.error("Project idea error:", error);
    return "💡 **Project Ideas**\n\nI'm having trouble generating ideas right now. Please try again.";
  }
}

// Generate quiz question
export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number; explanation: string }> {
  try {
    const prompt = `Generate a ${difficulty} level multiple choice question about ${topic}.

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this answer is correct"
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a quiz generator. Return only valid JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
    
    return {
      question: parsed.question || `${topic} question`,
      options: parsed.options || ["A", "B", "C", "D"],
      correctAnswer: parsed.correctAnswer || 0,
      explanation: parsed.explanation || "Correct answer explanation",
    };
  } catch (error) {
    console.error("Quiz generation error:", error);
    return {
      question: `What is an important concept in ${topic}?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: 0,
      explanation: "This is the correct answer.",
    };
  }
}

// Generate course lessons with AI
export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string; duration: string; topics: string[] }>> {
  try {
    const prompt = `Create ${numLessons} detailed lessons for a course:

**Course:** ${courseTitle}
**Description:** ${courseDescription}

Return ONLY a JSON array with this structure (no markdown):
[
  {
    "title": "Lesson title",
    "description": "What students will learn",
    "duration": "Estimated time (e.g., 45 min)",
    "topics": ["Topic 1", "Topic 2", "Topic 3"]
  }
]

Make lessons progressive, building on each other.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a curriculum designer. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
    
    return Array.isArray(parsed) ? parsed.slice(0, numLessons) : [];
  } catch (error) {
    console.error("Lesson generation error:", error);
    // Fallback lessons
    return Array.from({ length: Math.min(numLessons, 10) }, (_, i) => ({
      title: `${courseTitle} - Lesson ${i + 1}`,
      description: `Learn key concepts and practical skills for ${courseTitle}`,
      duration: "45 min",
      topics: ["Core concepts", "Practical examples", "Hands-on practice"],
    }));
  }
}

// Generate roadmap milestones with AI
export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string; skills: string[]; estimatedWeeks: number }>> {
  try {
    const prompt = `Create ${numMilestones} progressive milestones for a learning roadmap:

**Roadmap:** ${roadmapName}
**Description:** ${roadmapDescription}

Return ONLY a JSON array (no markdown):
[
  {
    "title": "Milestone title",
    "description": "What to achieve in this phase",
    "skills": ["Skill 1", "Skill 2", "Skill 3"],
    "estimatedWeeks": 2
  }
]

Make milestones build progressively from beginner to advanced.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a learning path designer. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
    
    return Array.isArray(parsed) ? parsed.slice(0, numMilestones) : [];
  } catch (error) {
    console.error("Milestone generation error:", error);
    // Fallback milestones
    return Array.from({ length: Math.min(numMilestones, 8) }, (_, i) => ({
      title: `${roadmapName} - Phase ${i + 1}`,
      description: `Master essential skills and concepts for ${roadmapName}`,
      skills: ["Core fundamentals", "Practical application", "Advanced techniques"],
      estimatedWeeks: Math.ceil((i + 1) * 1.5),
    }));
  }
}
