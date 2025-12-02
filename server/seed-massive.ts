import { db } from "./db";
import { arenas, challenges, quests, courses } from "@shared/schema";

export async function seedMassiveContent() {
  try {
    const ARENA_IDS = [
      "arena_1", "arena_2", "arena_3", "arena_4", "arena_5",
      "arena_6", "arena_7", "arena_8", "arena_9", "arena_10",
      "arena_11", "arena_12", "arena_13", "arena_14", "arena_15",
      "arena_16", "arena_17"
    ];

    // Generate 20 comprehensive challenges per arena (340 total)
    const challengeData: any[] = [];
    const challengeTitles = {
      ai: ["Neural Network Design", "CNN Image Classification", "RNN Text Generation", "Transformer Architecture", "Reinforcement Learning"],
      web: ["Build React Component", "Design REST API", "Implement WebSockets", "SEO Optimization", "Web Performance"],
      mobile: ["Responsive Layout", "Push Notifications", "Offline Storage", "Native Bridge", "App Performance"],
      cybersecurity: ["Password Hashing", "SQL Injection Prevention", "XSS Protection", "Encryption Algorithms", "Threat Detection"],
      blockchain: ["Smart Contract Audit", "Token Creation", "DeFi Protocol", "NFT Minting", "Gas Optimization"],
      devops: ["Docker Containerization", "K8s Deployment", "CI/CD Pipeline", "Infrastructure Code", "Log Aggregation"],
      gamedev: ["Collision Detection", "Game Physics", "Asset Loading", "Networking Sync", "Performance Optimization"],
      iot: ["Sensor Integration", "MQTT Protocol", "Edge Computing", "Firmware Update", "Power Optimization"],
      physics: ["CFD Simulation", "Molecular Dynamics", "Quantum Gates", "Particle Systems", "Field Equations"],
      math: ["Matrix Operations", "Numerical Methods", "Optimization", "Probability Models", "Statistical Analysis"],
      quantum: ["Qubit Operations", "Quantum Circuits", "Algorithm Implementation", "Error Correction", "Hardware Simulation"],
      fpga: ["Verilog Synthesis", "Hardware Design", "FPGA Programming", "Signal Processing", "Timing Analysis"],
      verification: ["Formal Methods", "Model Checking", "Proof Generation", "Constraint Solving", "Test Generation"],
      compiler: ["Lexical Analysis", "Syntax Parsing", "Semantic Analysis", "Code Generation", "Optimization"],
      hpc: ["Parallel Computing", "GPU Programming", "Load Balancing", "Memory Management", "Distributed Systems"],
      biotech: ["Protein Folding", "Gene Sequencing", "Drug Discovery", "Bioinformatics", "Data Analysis"],
      ar: ["3D Rendering", "Gesture Recognition", "Spatial Mapping", "Haptic Feedback", "Real-time Tracking"]
    };

    let challengeCount = 0;
    ARENA_IDS.forEach((arenaId, idx) => {
      const topics = Object.values(challengeTitles)[idx] || ["Problem Solving", "Algorithm Design", "Code Optimization", "System Design", "Performance"];
      
      for (let i = 0; i < 20; i++) {
        const topic = topics[i % topics.length];
        challengeCount++;
        challengeData.push({
          id: `challenge_${challengeCount}`,
          arenaId,
          title: `${topic} - Level ${Math.floor(i / 5) + 1}`,
          description: `Master ${topic} with this comprehensive challenge`,
          difficulty: i < 5 ? "beginner" : i < 12 ? "intermediate" : "expert",
          xpReward: (Math.floor(i / 5) + 1) * 50,
          timeLimit: (Math.floor(i / 5) + 1) * 60,
          type: "coding",
          instructions: `Implement a solution for: ${topic}. Follow best practices and optimize your code.`,
          starterCode: `// ${topic}\n// Your solution here\n`,
          testCases: [{ input: "test1", expected: "result1" }],
          hints: [`Hint 1: Think about edge cases`, `Hint 2: Optimize for performance`, `Hint 3: Test thoroughly`],
          tags: [topic, "practice", "debug"],
          isDaily: i % 7 === 0,
          isWeekly: i % 14 === 0,
        });
      }
    });

    // Batch insert challenges in groups of 100
    for (let i = 0; i < challengeData.length; i += 100) {
      const batch = challengeData.slice(i, i + 100);
      await db.insert(challenges).values(batch).onConflictDoNothing().execute();
    }

    // Generate quests (daily tasks) - 10 per arena
    const questData: any[] = [];
    let questCount = 0;
    ARENA_IDS.forEach((arenaId) => {
      for (let i = 0; i < 10; i++) {
        questCount++;
        questData.push({
          id: `quest_${questCount}`,
          arenaId,
          title: `Daily ${i + 1}: Problem Solver`,
          description: `Complete a coding challenge in this arena today`,
          xpReward: 25 * (i + 1),
          type: "daily",
          isDaily: true,
          isWeekly: i % 2 === 0,
          difficulty: i < 3 ? "beginner" : i < 7 ? "intermediate" : "expert",
          tags: ["daily", "quick"],
        });
      }
    });

    for (let i = 0; i < questData.length; i += 50) {
      const batch = questData.slice(i, i + 50);
      await db.insert(quests).values(batch).onConflictDoNothing().execute();
    }

    // Generate courses (structured learning paths) - 5 per arena
    const courseData: any[] = [];
    let courseCount = 0;
    ARENA_IDS.forEach((arenaId) => {
      for (let i = 0; i < 5; i++) {
        courseCount++;
        courseData.push({
          id: `course_${courseCount}`,
          arenaId,
          title: `Mastery Path ${i + 1}: Advanced Concepts`,
          description: `Learn advanced concepts and best practices in this field`,
          difficulty: i < 2 ? "intermediate" : "expert",
          duration: (i + 1) * 10,
          lessons: (i + 1) * 5,
          xpReward: (i + 1) * 100,
          tags: ["course", "structured", "comprehensive"],
          isPublished: true,
        });
      }
    });

    for (let i = 0; i < courseData.length; i += 50) {
      const batch = courseData.slice(i, i + 50);
      await db.insert(courses).values(batch).onConflictDoNothing().execute();
    }

    console.log(`✓ Seeded ${challengeCount} challenges across 17 arenas`);
    console.log(`✓ Seeded ${questCount} quests`);
    console.log(`✓ Seeded ${courseCount} courses`);
    return true;
  } catch (err) {
    console.error("Error seeding massive content:", err);
    return false;
  }
}

// Seed elite badges
const badges = [
  { id: "badge_1", name: "Master Coder", description: "Completed 100+ challenges", rarity: "epic", requirement: "100_challenges" },
  { id: "badge_2", name: "Top Scorer", description: "Ranked in top 1% globally", rarity: "legendary", requirement: "topScorer" },
  { id: "badge_3", name: "Knowledge Expert", description: "Mastered 5+ skill arenas", rarity: "epic", requirement: "5_arenas" },
  { id: "badge_4", name: "Community Leader", description: "Created and lead a community", rarity: "rare", requirement: "community_creator" },
  { id: "badge_5", name: "Research Pioneer", description: "Completed advanced research challenges", rarity: "legendary", requirement: "research_master" },
];

// Seed advanced challenges (for level 5+ users)
const advancedChallenges = [];
const EXTREME_TOPICS = [
  "Advanced ML Architecture Design",
  "Custom Transformer Models",
  "Quantum Algorithm Implementation",
  "Hardware-Software Codesign",
  "Novel Cryptography Methods",
  "Biotech Data Analysis",
  "AR/VR Physics Engine",
];

let advCount = 0;
for (let i = 0; i < 17; i++) {
  const arenaId = `arena_${i + 1}`;
  for (let j = 0; j < 5; j++) {
    advCount++;
    advancedChallenges.push({
      id: `advanced_${advCount}`,
      arenaId,
      title: `${EXTREME_TOPICS[j % EXTREME_TOPICS.length]} - Level ${j + 1}`,
      description: "Advanced research-level challenge for elite learners",
      difficulty: j < 2 ? "advanced" : j < 4 ? "extreme" : "research",
      minLevel: 5,
      xpReward: 500 + j * 100,
      type: "research",
      instructions: "Implement a novel solution to this advanced problem",
      resources: ["https://arxiv.org/", "https://paperswithcode.com/"],
      hints: ["Think outside the box", "Reference cutting-edge research"],
      testCases: [{ input: "advanced", expected: "solution" }],
    });
  }
}

// Seed learning resources into database
const learningResourcesData = [
  // AI/ML Resources
  { arenaId: 'arena_1', name: 'Deep Learning Specialization', url: 'https://www.coursera.org/specializations/deep-learning', type: 'course', difficulty: 'advanced' },
  { arenaId: 'arena_1', name: 'Papers with Code', url: 'https://paperswithcode.com/', type: 'research', difficulty: 'extreme' },
  { arenaId: 'arena_1', name: 'OpenAI Research', url: 'https://openai.com/research/', type: 'research', difficulty: 'extreme' },
  { arenaId: 'arena_1', name: 'Stanford CS231N', url: 'http://cs231n.stanford.edu/', type: 'course', difficulty: 'advanced' },
  
  // Web Dev Resources
  { arenaId: 'arena_2', name: 'MDN Web Docs', url: 'https://developer.mozilla.org/', type: 'docs', difficulty: 'intermediate' },
  { arenaId: 'arena_2', name: 'Web.dev by Google', url: 'https://web.dev/', type: 'course', difficulty: 'intermediate' },
  { arenaId: 'arena_2', name: 'React Official Docs', url: 'https://react.dev/', type: 'docs', difficulty: 'intermediate' },
  { arenaId: 'arena_2', name: 'CSS-Tricks', url: 'https://css-tricks.com/', type: 'blog', difficulty: 'intermediate' },
  
  // Mobile Dev Resources
  { arenaId: 'arena_3', name: 'React Native Docs', url: 'https://reactnative.dev/', type: 'docs', difficulty: 'intermediate' },
  { arenaId: 'arena_3', name: 'Flutter Official', url: 'https://flutter.dev/', type: 'docs', difficulty: 'intermediate' },
  { arenaId: 'arena_3', name: 'Swift.org', url: 'https://swift.org/', type: 'docs', difficulty: 'advanced' },
  
  // Cybersecurity Resources
  { arenaId: 'arena_4', name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', type: 'guide', difficulty: 'intermediate' },
  { arenaId: 'arena_4', name: 'HackTheBox', url: 'https://www.hackthebox.com/', type: 'practice', difficulty: 'advanced' },
  { arenaId: 'arena_4', name: 'TryHackMe', url: 'https://tryhackme.com/', type: 'practice', difficulty: 'intermediate' },
  { arenaId: 'arena_4', name: 'PortSwigger Web Security', url: 'https://portswigger.net/web-security', type: 'course', difficulty: 'advanced' },
  
  // Blockchain Resources
  { arenaId: 'arena_5', name: 'Ethereum Docs', url: 'https://ethereum.org/developers', type: 'docs', difficulty: 'advanced' },
  { arenaId: 'arena_5', name: 'Solidity Docs', url: 'https://docs.soliditylang.org/', type: 'docs', difficulty: 'advanced' },
  { arenaId: 'arena_5', name: 'CryptoZombies', url: 'https://cryptozombies.io/', type: 'game', difficulty: 'intermediate' },
  
  // DevOps Resources
  { arenaId: 'arena_6', name: 'Docker Documentation', url: 'https://docs.docker.com/', type: 'docs', difficulty: 'intermediate' },
  { arenaId: 'arena_6', name: 'Kubernetes.io', url: 'https://kubernetes.io/', type: 'docs', difficulty: 'advanced' },
  { arenaId: 'arena_6', name: 'AWS Documentation', url: 'https://docs.aws.amazon.com/', type: 'docs', difficulty: 'advanced' },
  
  // Game Dev Resources
  { arenaId: 'arena_7', name: 'Unity Learn', url: 'https://learn.unity.com/', type: 'course', difficulty: 'intermediate' },
  { arenaId: 'arena_7', name: 'Unreal Engine Docs', url: 'https://docs.unrealengine.com/', type: 'docs', difficulty: 'advanced' },
  { arenaId: 'arena_7', name: 'Godot Engine', url: 'https://godotengine.org/', type: 'docs', difficulty: 'intermediate' },
];
