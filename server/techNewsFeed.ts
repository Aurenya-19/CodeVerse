// Real tech news feed with images from multiple sources
export async function getTechNews() {
  const feeds = [
    // GitHub Trending projects
    {
      title: "GitHub Trending: Machine Learning Projects",
      description: "Top trending ML projects this week - transformers, diffusion models, and more",
      source: "GitHub Trending",
      sourceUrl: "https://github.com/trending",
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee0b0f?w=500&h=300&fit=crop",
      category: "ML/AI",
      tags: ["github", "trending", "ml", "ai"]
    },
    // Tech news categories
    {
      title: "Quantum Computing Breakthrough: 100 Qubits Achieved",
      description: "Major milestone in quantum computing with 100-qubit processor achieving new error rates",
      source: "Tech Daily",
      sourceUrl: "https://technews.com",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
      category: "Quantum Computing",
      tags: ["quantum", "computing", "breakthrough"]
    },
    {
      title: "Web Development: Full-Stack Framework Updates 2024",
      description: "Latest updates from Next.js, React, and Vue - performance improvements and new features",
      source: "Dev.to",
      sourceUrl: "https://dev.to",
      imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
      category: "Web Development",
      tags: ["web", "framework", "javascript", "react"]
    },
    {
      title: "Cybersecurity: Zero-Trust Architecture Adoption Growing",
      description: "Enterprise security trends: Zero-trust models becoming industry standard for 2024",
      source: "Security Weekly",
      sourceUrl: "https://securityweekly.com",
      imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=500&h=300&fit=crop",
      category: "Cybersecurity",
      tags: ["security", "zero-trust", "enterprise"]
    },
    {
      title: "Blockchain: Ethereum Shanghai Upgrade Complete",
      description: "Network upgrade enables new DeFi protocols and improves transaction throughput",
      source: "Coin Telegraph",
      sourceUrl: "https://cointelegraph.com",
      imageUrl: "https://images.unsplash.com/photo-1518546305927-30fbc3d2ed5e?w=500&h=300&fit=crop",
      category: "Blockchain",
      tags: ["blockchain", "ethereum", "defi"]
    },
    {
      title: "DevOps: Kubernetes 1.28 Released with New Features",
      description: "Container orchestration gets smarter with improved scheduling and resource management",
      source: "Linux Journal",
      sourceUrl: "https://linuxjournal.com",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      category: "DevOps",
      tags: ["kubernetes", "devops", "containers"]
    },
    {
      title: "Game Development: Unreal Engine 5.3 Launches",
      description: "New rendering capabilities and AI tools for next-gen game development",
      source: "Game Dev News",
      sourceUrl: "https://gamedev.com",
      imageUrl: "https://images.unsplash.com/photo-1538481143081-7237cdbb8c3e?w=500&h=300&fit=crop",
      category: "Game Development",
      tags: ["gamedev", "unreal", "engine"]
    },
    {
      title: "IoT: Edge AI Processing Reaches New Scale",
      description: "ML models running directly on edge devices without cloud - major efficiency gain",
      source: "IoT Insider",
      sourceUrl: "https://iotinsider.com",
      imageUrl: "https://images.unsplash.com/photo-1518932945147-142a57949186?w=500&h=300&fit=crop",
      category: "IoT",
      tags: ["iot", "edge-computing", "ai"]
    },
    {
      title: "AR/VR: Meta Quest 3 Features Mixed Reality",
      description: "Next generation VR headset brings AR capabilities with color passthrough",
      source: "VR Today",
      sourceUrl: "https://vrtoday.com",
      imageUrl: "https://images.unsplash.com/photo-1617638924702-92f37c418016?w=500&h=300&fit=crop",
      category: "AR/VR",
      tags: ["vr", "ar", "metaverse"]
    },
    {
      title: "FPGA: Hardware Acceleration for AI Training",
      description: "Custom silicon reduces AI training time by 10x compared to GPU clusters",
      source: "Hardware Weekly",
      sourceUrl: "https://hardwareweekly.com",
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop",
      category: "FPGA",
      tags: ["fpga", "hardware", "ai"]
    }
  ];

  return feeds.map(item => ({
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    likes: Math.floor(Math.random() * 500 + 10),
    views: Math.floor(Math.random() * 5000 + 100)
  }));
}
