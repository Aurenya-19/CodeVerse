import { db } from "./db";
import { 
  arenas, challenges, quests, courses, userProfiles, 
  feedItems, roadmaps 
} from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingArenas = await db.select().from(arenas).limit(1);
    if (existingArenas.length > 0) {
      console.log("Database already seeded, skipping seed");
      return;
    }

    console.log("Seeding database...");

    // Seed arenas
    await db.insert(arenas).values([
      {
        id: "arena_1",
        name: "AI & Machine Learning",
        slug: "ai",
        description: "Master machine learning, neural networks, and AI model development",
        icon: "Brain",
        color: "#7C3AED",
        category: "Programming",
        difficulty: "all",
        activeUsers: 1250,
        totalMissions: 45,
      },
      {
        id: "arena_2",
        name: "Cybersecurity",
        slug: "cyber",
        description: "Learn ethical hacking, network security, and cryptography",
        icon: "Shield",
        color: "#10B981",
        category: "Security",
        difficulty: "all",
        activeUsers: 890,
        totalMissions: 32,
      },
      {
        id: "arena_3",
        name: "Web Development",
        slug: "web",
        description: "Build modern websites with React, Vue, Angular and more",
        icon: "Code",
        color: "#0EA5E9",
        category: "Programming",
        difficulty: "all",
        activeUsers: 2100,
        totalMissions: 60,
      },
      {
        id: "arena_4",
        name: "Mobile App Development",
        slug: "app-dev",
        description: "Create mobile apps with React Native, Flutter, Swift",
        icon: "Smartphone",
        color: "#F97316",
        category: "Programming",
        difficulty: "all",
        activeUsers: 650,
        totalMissions: 38,
      },
      {
        id: "arena_5",
        name: "Game Development",
        slug: "game-dev",
        description: "Design and build games using Unity, Unreal Engine",
        icon: "Gamepad2",
        color: "#8B5CF6",
        category: "Creative",
        difficulty: "all",
        activeUsers: 780,
        totalMissions: 28,
      },
      {
        id: "arena_6",
        name: "DevOps & Cloud",
        slug: "devops",
        description: "Master Docker, Kubernetes, AWS, Azure deployment",
        icon: "Cloud",
        color: "#EC4899",
        category: "Infrastructure",
        difficulty: "all",
        activeUsers: 420,
        totalMissions: 25,
      },
    ]);

    // Seed challenges
    await db.insert(challenges).values([
      {
        id: "ch_1",
        arenaId: "arena_1",
        title: "Build Your First Neural Network",
        description: "Create a simple neural network using Python and TensorFlow",
        difficulty: "beginner",
        xpReward: 100,
        timeLimit: 45,
        type: "coding",
        instructions: "Build a neural network that can classify iris flowers",
        starterCode: "import tensorflow as tf\n\n# Your code here",
        testCases: [{ input: "sample", expected: "output" }],
        hints: ["Use layers", "Add activation function"],
        tags: ["Python", "ML", "TensorFlow"],
        isDaily: true,
        isWeekly: false,
      },
      {
        id: "ch_2",
        arenaId: "arena_3",
        title: "React Todo App",
        description: "Build a fully functional todo application with React",
        difficulty: "beginner",
        xpReward: 75,
        timeLimit: 60,
        type: "coding",
        instructions: "Create a todo app with add, delete, complete features",
        starterCode: "import React from 'react'\n\nexport default function TodoApp() {\n  // Your code\n}",
        hints: ["Use useState", "Handle form submission"],
        tags: ["React", "JavaScript", "Web"],
        isDaily: true,
        isWeekly: true,
      },
      {
        id: "ch_3",
        arenaId: "arena_2",
        title: "SQL Injection Prevention",
        description: "Fix a vulnerable SQL query",
        difficulty: "intermediate",
        xpReward: 150,
        timeLimit: 30,
        type: "coding",
        instructions: "Identify and fix SQL injection vulnerabilities",
        hints: ["Use parameterized queries"],
        tags: ["Security", "SQL", "Backend"],
        isDaily: false,
        isWeekly: true,
      },
    ]);

    // Seed quests
    await db.insert(quests).values([
      {
        id: "q_1",
        title: "Daily Coder",
        description: "Complete 1 challenge today",
        type: "daily",
        xpReward: 25,
        requirement: { type: "challenges", count: 1 },
        icon: "Target",
        isActive: true,
      },
      {
        id: "q_2",
        title: "Streak Master",
        description: "Maintain a 7-day streak",
        type: "weekly",
        xpReward: 100,
        requirement: { type: "streak", count: 7 },
        icon: "Flame",
        isActive: true,
      },
      {
        id: "q_3",
        title: "Arena Explorer",
        description: "Complete challenges in 3 different arenas",
        type: "weekly",
        xpReward: 80,
        requirement: { type: "arenas", count: 3 },
        icon: "Globe",
        isActive: true,
      },
      {
        id: "q_4",
        title: "100 XP Club",
        description: "Earn 100 XP today",
        type: "daily",
        xpReward: 30,
        requirement: { type: "xp", count: 100 },
        icon: "Zap",
        isActive: true,
      },
      {
        id: "q_5",
        title: "Code Reviewer",
        description: "Review 5 peer submissions",
        type: "weekly",
        xpReward: 120,
        requirement: { type: "reviews", count: 5 },
        icon: "CheckCircle",
        isActive: true,
      },
    ]);

    // Seed courses
    await db.insert(courses).values([
      {
        id: "course_1",
        title: "Python Fundamentals",
        description: "Learn Python basics from scratch",
        duration: 15,
        difficulty: "beginner",
        category: "Programming",
        icon: "BookOpen",
        content: JSON.stringify([
          { lesson: 1, title: "Variables and Types" },
          { lesson: 2, title: "Functions" },
          { lesson: 3, title: "Classes" },
        ]),
        xpReward: 200,
        enrollments: 3420,
        rating: 4,
        tags: ["Python", "Beginner"],
      },
      {
        id: "course_2",
        title: "React Advanced Patterns",
        description: "Master advanced React patterns and hooks",
        duration: 20,
        difficulty: "intermediate",
        category: "Web Development",
        icon: "Code",
        content: JSON.stringify([
          { lesson: 1, title: "Custom Hooks" },
          { lesson: 2, title: "Context API" },
          { lesson: 3, title: "Performance Optimization" },
        ]),
        xpReward: 300,
        enrollments: 2180,
        rating: 5,
        tags: ["React", "JavaScript"],
      },
      {
        id: "course_3",
        title: "Web Security Essentials",
        description: "Essential security practices for web developers",
        duration: 12,
        difficulty: "intermediate",
        category: "Security",
        icon: "Shield",
        content: JSON.stringify([
          { lesson: 1, title: "OWASP Top 10" },
          { lesson: 2, title: "Authentication" },
          { lesson: 3, title: "Data Protection" },
        ]),
        xpReward: 250,
        enrollments: 1540,
        rating: 4,
        tags: ["Security", "Web"],
      },
    ]);

    // Seed roadmaps
    await db.insert(roadmaps).values([
      {
        id: "rm_1",
        name: "Full Stack Developer",
        slug: "full-stack",
        description: "Complete journey to become a full stack developer",
        milestones: JSON.stringify([
          "Learn HTML/CSS",
          "Master JavaScript",
          "Learn React",
          "Learn Node.js",
          "Learn Databases",
          "Build Projects",
        ]),
        estimatedDays: 90,
        difficulty: "intermediate",
        icon: "Code",
      },
      {
        id: "rm_2",
        name: "AI/ML Engineer",
        slug: "ai-ml",
        description: "Journey to become an AI/ML engineer",
        milestones: JSON.stringify([
          "Python Basics",
          "NumPy & Pandas",
          "Machine Learning",
          "Deep Learning",
          "NLP",
          "Projects",
        ]),
        estimatedDays: 120,
        difficulty: "advanced",
        icon: "Brain",
      },
    ]);

    // Seed feed items
    await db.insert(feedItems).values([
      {
        id: "feed_1",
        title: "GPT-4o is out - What changed?",
        description: "OpenAI released GPT-4o with improved capabilities across vision, audio, and reasoning",
        category: "AI",
        source: "TechNews",
        imageUrl: "https://via.placeholder.com/400x200?text=GPT-4o",
        views: 5430,
      },
      {
        id: "feed_2",
        title: "React 19 Released",
        description: "New features in React 19 including compiler, Server Components, and Actions",
        category: "Web",
        source: "React Blog",
        imageUrl: "https://via.placeholder.com/400x200?text=React+19",
        views: 8920,
      },
      {
        id: "feed_3",
        title: "Kubernetes 1.31 Available",
        description: "New features for container orchestration and management",
        category: "DevOps",
        source: "Kubernetes Blog",
        imageUrl: "https://via.placeholder.com/400x200?text=Kubernetes",
        views: 3210,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
