import { enrichCourseWithContent } from './courseContent';

// Massive content expansion - 200+ challenges, quests, and courses
export const massiveChallenges = Array.from({ length: 200 }, (_, i) => ({
  id: `challenge_${i + 1}`,
  arenaId: ["ai", "web", "mobile", "cybersecurity", "blockchain", "devops", "gamedev", "iot", "physics", "math", "quantum", "fpga", "verification", "compilers", "hpc", "biotech", "ar-vr"][i % 17],
  title: `Challenge ${i + 1}: ${["Build", "Optimize", "Secure", "Design", "Implement", "Debug", "Analyze", "Scale"][i % 8]} ${["AI Model", "Web App", "Mobile App", "Security System", "Smart Contract", "Pipeline", "Game", "IoT Device"][i % 8]}`,
  description: `Complete this advanced challenge to master ${["deep learning", "full-stack development", "mobile architecture", "network security", "blockchain protocols", "infrastructure", "game physics", "embedded systems"][i % 8]}`,
  difficulty: ["beginner", "intermediate", "advanced", "expert"][i % 4],
  points: Math.floor((i % 4 + 1) * 25),
  xpReward: Math.floor((i % 4 + 1) * 50),
  timeLimit: Math.floor(Math.random() * 180 + 30),
  testCases: Array.from({ length: 5 }, (_, j) => ({ input: `input_${j}`, expected: `output_${j}` })),
  hints: ["Think about edge cases", "Start with a simple solution", "Optimize after correctness"],
  resources: ["Documentation", "Tutorial", "Reference Material"],
  tags: ["practice", "real-world", "assessment"],
}));

export const massiveQuests = Array.from({ length: 100 }, (_, i) => ({
  id: `quest_${i + 1}`,
  title: `Daily Quest ${i + 1}: ${["Code", "Learn", "Build", "Debug", "Review", "Optimize"][i % 6]} for 30 minutes`,
  description: `Complete ${["5 challenges", "1 course module", "1 project", "3 code reviews", "2 discussions"][i % 5]} to earn XP and rewards`,
  type: ["daily", "weekly", "monthly"][i % 3],
  xpReward: [25, 50, 100, 200][i % 4],
  target: [5, 10, 20, 50][i % 4],
  category: ["practice", "learning", "community", "achievements"][i % 4],
  badge: `quest_badge_${i % 10}`,
  tags: ["activity", "progress"],
}));

export const massiveCourses = Array.from({ length: 85 }, (_, i) => ({
  id: `course_${i + 1}`,
  title: `Master ${["AI/ML", "Web Dev", "Mobile Apps", "Security", "Blockchain", "DevOps", "Game Dev", "IoT"][i % 8]} - Course ${i + 1}`,
  description: `Comprehensive course covering fundamentals to advanced topics with ${Math.floor(Math.random() * 15 + 5)} modules and ${Math.floor(Math.random() * 20 + 10)} projects`,
  difficulty: ["beginner", "intermediate", "advanced"][i % 3],
  duration: `${Math.floor(Math.random() * 8 + 4)} weeks`,
  modules: Array.from({ length: Math.floor(Math.random() * 8 + 5) }, (_, j) => ({
    title: `Module ${j + 1}: ${["Fundamentals", "Practical Skills", "Advanced Topics", "Project Work", "Assessment"][j % 5]}`,
    lessons: Math.floor(Math.random() * 5 + 3)
  })),
  projects: Math.floor(Math.random() * 5 + 2),
  students: Math.floor(Math.random() * 10000 + 100),
  rating: Math.random() * 1 + 4,
  instructor: `Instructor ${i % 20 + 1}`,
}));
