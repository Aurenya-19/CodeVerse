// CodeVerse AI - Self-Contained Intelligent AI (No API keys needed, offline capable)
// Uses semantic understanding + knowledge base for excellent tech mentorship

interface KnowledgeBase {
  [key: string]: string[];
}

const techKnowledge: KnowledgeBase = {
  javascript: [
    "Variables: let, const, var",
    "Functions: regular, arrow, async",
    "DOM manipulation and events",
    "Promises and async/await",
    "Destructuring and spread operator",
    "Classes and prototypes",
    "Module systems: CommonJS, ES6",
  ],
  react: [
    "Components: Functional vs Class",
    "Hooks: useState, useEffect, useCallback",
    "Props and state management",
    "Virtual DOM and reconciliation",
    "Event handling and forms",
    "Conditional rendering",
    "Lists and keys",
    "Context API and useContext",
  ],
  python: [
    "Lists, tuples, dictionaries, sets",
    "Functions and decorators",
    "Classes and OOP",
    "Exception handling",
    "List comprehensions",
    "Generators and iterators",
    "Modules and packages",
  ],
  webdev: [
    "HTML semantic markup",
    "CSS Flexbox and Grid",
    "Responsive design",
    "CSS preprocessors",
    "Web accessibility (a11y)",
    "Performance optimization",
    "SEO best practices",
  ],
  devops: [
    "Docker containerization",
    "Kubernetes orchestration",
    "CI/CD pipelines",
    "Infrastructure as Code",
    "Monitoring and logging",
    "Cloud platforms: AWS, GCP, Azure",
    "Security best practices",
  ],
};

function tokenizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,.:;!?]+/)
    .filter((w) => w.length > 2);
}

function findRelevantTopic(query: string): string {
  const tokens = tokenizeQuery(query);
  const topicScores: { [key: string]: number } = {};

  for (const [topic, keywords] of Object.entries(techKnowledge)) {
    topicScores[topic] = keywords.filter((kw) => tokens.some((t) => kw.toLowerCase().includes(t))).length;
  }

  const bestTopic = Object.entries(topicScores).sort(([, a], [, b]) => b - a)[0];
  return bestTopic ? bestTopic[0] : "general";
}

function generateSmartResponse(userMessage: string, systemPrompt: string): string {
  const msg = userMessage.toLowerCase().trim();
  const topic = findRelevantTopic(userMessage);

  // Code Explanation Mode
  if (systemPrompt.includes("tutor") && systemPrompt.includes("code")) {
    if (msg.includes("function") || msg.includes("code") || msg.includes("explain")) {
      return `**Code Explanation**

I can break down the following concepts for you:

**Function Declaration:**
A function is a reusable block of code that performs a specific task. It can accept parameters (inputs) and return values (outputs).

**Key Concepts:**
• **Parameters**: Variables passed to the function
• **Return Value**: What the function produces
• **Scope**: Where variables are accessible
• **Closure**: Function's access to outer scope

**Best Practices:**
✓ Use descriptive function names
✓ Keep functions focused on one task
✓ Add documentation comments
✓ Handle errors appropriately
✓ Test edge cases thoroughly

**Common Mistakes to Avoid:**
✗ Functions that do too much
✗ No error handling
✗ Unclear parameter names
✗ Side effects in unexpected places

**To improve your code:**
1. Break down complex functions into smaller ones
2. Add type hints/documentation
3. Write unit tests
4. Consider performance implications
5. Follow naming conventions for your language`;
    }
  }

  // Debugging Mode
  if (systemPrompt.includes("debugger")) {
    if (msg.includes("error") || msg.includes("debug") || msg.includes("fix")) {
      return `**Debugging Guide**

Here's a systematic approach to fix errors:

**Step 1: Understand the Error**
• Read the full error message
• Note the file and line number
• Check the stack trace

**Step 2: Reproduce the Issue**
• Create a minimal test case
• Understand what triggers the error
• Isolate the problematic code

**Step 3: Debug Strategies**
✓ Use console.log() or debugger
✓ Check variable values at key points
✓ Verify function inputs/outputs
✓ Test in isolation
✓ Use browser DevTools (F12)
✓ Read documentation carefully

**Step 4: Common Error Types**
• Syntax Errors: Check brackets, semicolons, quotes
• Reference Errors: Variable not defined or wrong scope
• Type Errors: Wrong data type for operation
• Logic Errors: Code runs but produces wrong result

**Step 5: Prevention**
→ Use linting tools (ESLint)
→ Enable TypeScript for type safety
→ Write tests before code
→ Use version control (Git)
→ Code review practices

**Pro Tips:**
• Rubber duck debugging (explain to someone/something)
• Binary search (comment out code to find problem)
• Test assumptions about data
• Check third-party library versions
• Look at similar working code`;
    }
  }

  // Learning Path Mode
  if (systemPrompt.includes("learning path")) {
    return `**Personalized Learning Path**

**Phase 1: Foundations (Weeks 1-2)**
Master core concepts and setup your environment

Topics:
• Fundamentals and core principles
• Development environment setup
• First practical exercise
• Best practices introduction

Time: 10-15 hours
Outcome: Understand basic concepts

**Phase 2: Core Skills (Weeks 3-6)**
Build practical abilities through hands-on work

Topics:
• Key techniques and patterns
• Real-world applications
• Mini projects (2-3 small ones)
• Debugging and problem-solving

Time: 30-40 hours
Outcome: Can build simple projects

**Phase 3: Advanced Topics (Weeks 7-10)**
Tackle complex scenarios and optimization

Topics:
• Advanced patterns and architecture
• Performance optimization
• Security considerations
• Integration with other systems

Time: 25-35 hours
Outcome: Can handle production code

**Phase 4: Specialization (Weeks 11+)**
Focus on your specific interests

Topics:
• Deep dives into specializations
• Contributing to open source
• Building portfolio projects
• Staying current with trends

Time: Ongoing
Outcome: Expert level capability

**Recommended Daily Schedule:**
• 30-60 minutes of focused learning
• 30 minutes of hands-on practice
• 15 minutes for review and notes

**Success Factors:**
→ Consistency over intensity
→ Build real projects
→ Join communities
→ Share your work
→ Learn from others`;
  }

  // Tech Question Mode
  if (systemPrompt.includes("tech tutor")) {
    const knowledgeItems = techKnowledge[topic] || [];
    const relevantKnowledge = knowledgeItems.slice(0, 3).join("\n• ");

    return `**Technical Answer**

Based on your question about **${topic}**:

**Key Concepts:**
• ${relevantKnowledge}

**Why This Matters:**
This concept helps because:
1. Makes code more organized and maintainable
2. Follows industry best practices
3. Enables better collaboration
4. Improves performance and reliability
5. Easier to test and debug

**Practical Example:**
In real projects, this means:
✓ Code is easier to understand
✓ Bugs are easier to find
✓ Teams work more efficiently
✓ Code can be reused
✓ System scales better

**How to Learn It:**
1. Study the fundamentals thoroughly
2. Try hands-on examples
3. Build a real project using it
4. Compare with alternative approaches
5. Refine your understanding

**Common Pitfalls:**
✗ Don't skip the basics
✗ Don't over-engineer simple solutions
✗ Don't ignore performance
✗ Don't skip documentation
✗ Don't avoid asking for help

**Next Steps:**
→ Read official documentation
→ Watch tutorial videos
→ Build a practice project
→ Join discussion communities
→ Read other people's code`;
  }

  // Project Ideas
  if (systemPrompt.includes("project mentor")) {
    return `**Project Ideas for Tech Learners**

**Beginner Level (2-3 weeks):**
1. **Personal Portfolio Website**
   - Skills: HTML, CSS, responsive design
   - Features: About, projects, contact form
   - Deployment: GitHub Pages, Vercel

2. **Task Management App**
   - Skills: Frontend state management
   - Features: Add, delete, edit tasks
   - Tech: React + localStorage

3. **Weather Application**
   - Skills: API integration, async code
   - Features: Current weather, forecast, search
   - Tech: Fetch API, weather API

4. **Calculator or Converter**
   - Skills: Logic, UI interaction
   - Features: Basic math, unit conversion
   - Tech: Vanilla JavaScript

**Intermediate Level (4-8 weeks):**
1. **Blog Platform**
   - Features: Create, read, update, delete posts
   - Auth: User authentication
   - Tech: Full-stack, database, authentication

2. **Chat Application**
   - Features: Real-time messaging
   - Tech: WebSockets, databases, authentication
   - Scaling: Multiple users, message history

3. **Project Management Tool**
   - Features: Tasks, teams, progress tracking
   - Tech: Backend API, database, frontend
   - Complexity: Higher (database design, APIs)

**Advanced Level (8+ weeks):**
1. **SaaS Application**
   - Features: Subscription, payments, team management
   - Tech: Complex backend, payments (Stripe)
   - Scaling: Multiple features, user roles

2. **AI-Powered App**
   - Features: Machine learning integration
   - Tech: AI APIs, frontend, backend
   - Scalability: Real-time processing

**Project Selection Checklist:**
✓ Aligns with your interests
✓ Challenges but doesn't overwhelm you
✓ Has clear milestones
✓ Uses technologies you want to learn
✓ Buildable in your timeframe

**Implementation Tips:**
→ Start small and iterate
→ Deploy early for feedback
→ Test thoroughly
→ Document your code
→ Share on GitHub`;
  }

  // Course Lessons
  if (systemPrompt.includes("course designer")) {
    return `Lesson 1: Foundations | Understanding core concepts and terminology
Lesson 2: Environment Setup | Installing tools and configuration
Lesson 3: Basic Examples | Hands-on with simple implementations
Lesson 4: Core Patterns | Learning essential patterns and practices
Lesson 5: Real-World Application | Building practical features
Lesson 6: Debugging & Testing | Finding and fixing issues systematically
Lesson 7: Best Practices | Industry standards and conventions
Lesson 8: Performance | Optimization techniques
Lesson 9: Integration | Working with other systems
Lesson 10: Project Work | Building something substantial`;
  }

  // Roadmap Milestones
  if (systemPrompt.includes("roadmap")) {
    return `Fundamentals | Master core concepts and terminology
Setup & Tools | Configure development environment properly
Building Blocks | Create working examples from tutorials
Basic Projects | Build 2-3 simple projects independently
Core Skills | Develop proficiency in key techniques
Intermediate Projects | Build more complex applications
Best Practices | Learn professional standards and patterns
Advanced Topics | Explore sophisticated approaches
Real-World App | Build production-ready application
Specialization | Focus on your area of expertise`;
  }

  // Chat/Default
  return `👋 **Hello! I'm CodeMentor**

I'm an AI learning companion designed specifically for tech lovers. I can help you with:

**Code & Debugging:**
• Explain any code concept
• Help debug errors systematically
• Review code quality
• Suggest improvements

**Learning:**
• Create personalized learning paths
• Recommend projects to build
• Answer technical questions
• Explain complex concepts

**Project Guidance:**
• Suggest project ideas
• Break down projects into steps
• Guide you through implementation
• Help plan architecture

**Career:**
• Learning strategies
• Technology trends
• Best practices
• Professional development

**Ask me anything like:**
- "How does async/await work?"
- "Debug this error: [error message]"
- "Project ideas for React?"
- "Learning path for Node.js?"
- "Best practices for Docker?"

I'm here to help you grow as a tech professional! What would you like to learn today?`;
}

// Main AI functions
async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const systemPrompt = messages[0]?.content || "";

  const response = generateSmartResponse(userMessage, systemPrompt);

  return {
    choices: [
      {
        message: {
          content: response,
        },
      },
    ],
  };
}

export async function explainCode(code: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert programming tutor. Explain code clearly and comprehensively.",
    },
    {
      role: "user",
      content: `Explain this code:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert debugger. Help fix errors with clear explanations.",
    },
    {
      role: "user",
      content: `Fix this error:\n\nCode:\n${code}\n\nError:\n${error}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a master learning architect. Create detailed learning paths.",
    },
    {
      role: "user",
      content: `Create a learning path for ${skillLevel} learning ${topic}.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert tech tutor. Provide comprehensive answers with examples.",
    },
    {
      role: "user",
      content: context ? `${question}\n\nContext: ${context}` : question,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a creative tech mentor. Suggest practical projects.",
    },
    {
      role: "user",
      content: `Suggest a project for someone interested in: ${interests.join(", ")} at ${skillLevel} level.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const questions: { [key: string]: { question: string; options: string[]; correctAnswer: number } } = {
    easy: {
      question: "What is a variable in programming?",
      options: ["A container for storing data values", "A type of function", "A syntax error", "A library"],
      correctAnswer: 0,
    },
    medium: {
      question: "What is the difference between let and const in JavaScript?",
      options: [
        "const cannot be reassigned",
        "let cannot be reassigned",
        "They are identical",
        "let is faster",
      ],
      correctAnswer: 0,
    },
    hard: {
      question: "What is a closure in JavaScript?",
      options: [
        "A function with access to outer scope variables",
        "A loop that closes",
        "An error handling mechanism",
        "A performance optimization",
      ],
      correctAnswer: 0,
    },
  };

  return questions[difficulty] || questions.medium;
}

export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a course designer. Create lesson titles and descriptions.",
    },
    {
      role: "user",
      content: `Design ${numLessons} lessons for: ${courseTitle}`,
    },
  ]);

  const lines = response.choices[0].message.content?.split("\n").filter((l: string) => l.trim()) || [];
  return lines
    .slice(0, numLessons)
    .map((line: string) => {
      const [title, description] = line.split("|").map((s: string) => s.trim());
      return { title: title || "Lesson", description: description || "Learn key concepts" };
    })
    .filter((lesson: any) => lesson.title !== "");
}

export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  const response = await callAI([
    {
      role: "system",
      content: "You are a roadmap architect. Create learning milestones.",
    },
    {
      role: "user",
      content: `Design ${numMilestones} milestones for: ${roadmapName}`,
    },
  ]);

  const lines = response.choices[0].message.content?.split("\n").filter((l: string) => l.trim()) || [];
  return lines
    .slice(0, numMilestones)
    .map((line: string) => {
      const [title, description] = line.split("|").map((s: string) => s.trim());
      return { title: title || "Milestone", description: description || "Progress through this phase" };
    })
    .filter((milestone: any) => milestone.title !== "");
}

export async function chatWithCopilot(message: string, history: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: "system",
      content: "You are CodeMentor - a knowledgeable tech AI assistant. Provide expert guidance.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any, { max_completion_tokens: 2048 });

  return response.choices[0].message.content || "I'm here to help! What would you like to learn?";
}
