// ============================================================================
// CODEVERSE AI - INSTANT INTELLIGENT RESPONSES
// ============================================================================

// Simple, direct question type detection
function detectQuestionType(message: string): string {
  const msg = message.toLowerCase();
  
  // Debugging questions
  if (msg.includes("error") || msg.includes("bug") || msg.includes("debug") || msg.includes("crash") || msg.includes("fix")) {
    return "debugging";
  }
  
  // Learning/concept questions
  if (msg.includes("explain") || msg.includes("understand") || msg.includes("what") || msg.includes("how") || msg.includes("learn")) {
    return "learning";
  }
  
  // Algorithm questions
  if (msg.includes("algorithm") || msg.includes("solve") || msg.includes("code") || msg.includes("implement")) {
    return "algorithm";
  }
  
  // Optimization questions
  if (msg.includes("optimize") || msg.includes("fast") || msg.includes("performance") || msg.includes("slow")) {
    return "optimization";
  }
  
  // System design questions
  if (msg.includes("system") || msg.includes("design") || msg.includes("architecture") || msg.includes("scale")) {
    return "design";
  }
  
  return "general";
}

// Build response based on question type
function buildResponse(type: string, message: string): string {
  if (type === "debugging") {
    return `🔍 **DEBUG THIS ERROR**

**My Debugging Process:**
1. Identify error type (syntax, runtime, logic)
2. Find exact line where it happens
3. Check variable initialization and scope
4. Look for null/undefined values
5. Verify data types match operations
6. Test fix with simple example
7. Add defensive checks

**For JavaScript Errors:**
- TypeError: null/undefined issue
- ReferenceError: variable not defined
- SyntaxError: bad code syntax

**For Python Errors:**
- IndentationError: fix spacing
- NameError: variable not in scope
- TypeError: type mismatch

**How to Debug:**
→ Read full error message
→ Check line number shown
→ Add console.log/print statements
→ Trace execution step by step
→ Test with minimal example

**Share your exact error message and code section!**`;
  }
  
  if (type === "learning") {
    return `📚 **LEARN THIS CONCEPT**

**My Teaching Method:**

1. **Simple Definition** - What is it?
2. **Why It Matters** - When do you need it?
3. **How It Works** - Step-by-step explanation
4. **Code Example** - See it in action
5. **When to Use** - Best practices
6. **Common Mistakes** - What NOT to do
7. **Next Level** - Advanced variations

**The Key to Learning:**
→ Read & understand
→ Code simple example  
→ Modify and predict output
→ Try edge cases
→ Teach someone else
→ Use in real project

**Learning Tips:**
- Hands-on practice is essential
- Write code yourself
- Don't just read examples
- Break into smaller concepts
- Connect to what you know

**Tell me which concept to explain!**`;
  }
  
  if (type === "algorithm") {
    return `🎯 **SOLVE THIS ALGORITHM**

**Problem-Solving Steps:**

1. **Understand**
   - Input: What do you get?
   - Output: What should you return?
   - Constraints: Time/space limits?
   - Examples: Test cases?

2. **Design**
   - Start simple (brute force)
   - Then optimize
   - Choose data structures
   - Plan algorithm

3. **Complexity Analysis**
   - Time: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)?
   - Space: How much memory?

4. **Code First in Pseudocode**
   \`\`\`
   function solve(input):
       1. Initialize
       2. Main logic
       3. Return result
   \`\`\`

5. **Then Code Real Implementation**
   \`\`\`javascript
   // Clear variable names
   // Comments for logic
   // Handle all cases
   \`\`\`

6. **Test Everything**
   - Simple examples
   - Edge cases (empty, single, boundary)
   - Complex examples
   - Verify complexity requirements

**Common Patterns:**
- Two pointers: move from ends
- Sliding window: fixed/variable window
- Dynamic programming: cache results
- Recursion: break into smaller
- Binary search: divide & conquer
- DFS/BFS: traverse structure

**Share your problem!**`;
  }
  
  if (type === "optimization") {
    return `⚡ **OPTIMIZE THIS CODE**

**Optimization Strategy:**

**Step 1: Measure**
- Record current performance
- Profile to find slow parts
- Identify bottleneck
- Check memory usage

**Step 2: Analyze**
- Algorithm complexity high?
- Redundant operations?
- Bad data structures?
- Unnecessary requests?
- Memory leaks?

**Step 3: Optimize (in order)**

**A. Algorithm** (BIGGEST impact)
- Reduce Big O complexity
- Example: O(n²) → O(n log n) = 100x faster!
- Eliminate waste
- Better data structure
- Cache results

**B. Code** (Medium impact)
- Fewer loop iterations
- Less function calls
- Batch operations
- Lazy evaluation
- Remove allocations

**C. System** (Specific impact)
- Database indexing
- Connection pooling
- Redis caching
- CDN for static
- Load balancing

**Step 4: Verify**
- Measure new speed
- Calculate improvement %
- Check for bugs
- Document changes

**Performance Rules:**
→ Measure FIRST
→ Algorithm optimization FIRST
→ Code optimization SECOND
→ System optimization THIRD

**Share your slow code!**`;
  }
  
  if (type === "design") {
    return `🏗️ **DESIGN A SYSTEM**

**System Design Framework:**

**Step 1: Requirements**
- Functional: What features?
- Non-Functional: Performance? Scale? Reliability?

**Step 2: Architecture**
\`\`\`
Users → Load Balancer → API Servers → Cache → Database
\`\`\`

**Architecture Options:**
- Monolithic: Single codebase (simple)
- Microservices: Multiple services (scalable)
- Serverless: Functions (pay-per-use)

**Step 3: Data**
- SQL: Structured, transactions
- NoSQL: Flexible, scalable
- Cache: Fast reads
- Search: Full-text indexing

**Step 4: Scalability**
- Horizontal: Add more servers (best)
- Vertical: Bigger hardware (limited)
- Caching: Reduce DB hits
- CDN: Global distribution
- Database optimization: Indexes

**Step 5: Reliability**
- Redundancy: Multiple copies
- Health checks: Monitor
- Circuit breakers: Fail gracefully
- Retry logic: Exponential backoff
- Backup: Data recovery

**Step 6: Security**
- Authentication: User identity
- Authorization: Permissions
- Encryption: In transit & at rest
- Input validation: Prevent injection
- Rate limiting: Prevent abuse

**Design Trade-offs:**
- Speed vs Storage
- Consistency vs Availability
- Simple vs Scalable
- Cost vs Performance

**Tell me your system requirements!**`;
  }
  
  // General response
  return `🚀 **CODEMENTOR AI - PROGRAMMING EXPERT**

I help with:
🐛 **Debugging** - Fix errors systematically
📚 **Learning** - Understand concepts deeply  
🎯 **Algorithms** - Solve problems efficiently
⚡ **Optimization** - Make code faster
🏗️ **System Design** - Build scalable systems

**What can I help with?**`;
}

// Main AI function
export async function chatWithCopilot(
  message: string,
  _history: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    const type = detectQuestionType(message);
    const response = buildResponse(type, message);
    console.log(`[CodeMentor] Detected: ${type}`);
    return response;
  } catch (error: any) {
    console.error("[CodeMentor] Error:", error?.message);
    return `🚀 **CODEMENTOR AI**\n\nAsk me about debugging, learning concepts, algorithms, optimization, or system design!`;
  }
}

export async function explainCode(code: string): Promise<string> {
  return `📖 **Explain Code**\n\nShare code and I'll explain:\n1. What it does\n2. How it works\n3. Key concepts\n4. Potential issues\n5. Improvements`;
}

export async function debugCode(code: string, error: string): Promise<string> {
  return `🔍 **Debug Code**\n\nError: ${error}\n\n1. Error type\n2. Root cause\n3. Solution\n4. Prevention`;
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  return `🎓 **Learning Path**\n\nTopic: ${topic}\nLevel: ${skillLevel}\n\n1. Fundamentals\n2. Core Concepts\n3. Advanced Topics\n4. Real Projects`;
}

export async function answerTechQuestion(question: string, _context: string = ""): Promise<string> {
  return chatWithCopilot(question);
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  return `💡 **Project Ideas**\n\nInterests: ${interests.join(", ")}\nLevel: ${skillLevel}\n\n1. Beginner projects\n2. Intermediate projects\n3. Advanced projects`;
}

export async function generateQuizQuestion(topic: string, difficulty: string): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  return {
    question: `${topic} - ${difficulty}`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: 0,
  };
}

export async function generateCourseLessons(courseTitle: string, _courseDescription: string, numLessons: number = 10): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numLessons, 10) }, (_, i) => ({
    title: `${courseTitle} - Lesson ${i + 1}`,
    description: "Learn with examples and practice",
  }));
}

export async function generateRoadmapMilestones(roadmapName: string, _roadmapDescription: string, numMilestones: number = 8): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: Math.min(numMilestones, 8) }, (_, i) => ({
    title: `${roadmapName} - Phase ${i + 1}`,
    description: "Progress through milestones",
  }));
}
