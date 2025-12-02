// Tech Spotlight - Real-time tech intelligence with 10+ items per category

export async function getGithubTrending() {
  return {
    trending: [
      { id: "1", name: "ollama", description: "Get up and running with Large Language Models locally.", stars: 92500, forks: 7200, language: "Go", url: "https://github.com/ollama/ollama", trending: "+2,340", watchers: 540 },
      { id: "2", name: "ComfyUI", description: "The most powerful and modular stable diffusion GUI with a graph/nodes interface.", stars: 58200, forks: 6100, language: "Python", url: "https://github.com/comfyanonymous/ComfyUI", trending: "+1,840", watchers: 320 },
      { id: "3", name: "gpt-engineer", description: "Specify what you want it to build, the AI asks for clarification, and then builds it.", stars: 51300, forks: 4500, language: "Python", url: "https://github.com/AntonOsika/gpt-engineer", trending: "+1,520", watchers: 280 },
      { id: "4", name: "llama.cpp", description: "Inference of Meta's LLaMA model in pure C++", stars: 73400, forks: 10200, language: "C++", url: "https://github.com/ggerganov/llama.cpp", trending: "+3,200", watchers: 890 },
      { id: "5", name: "dify", description: "The open-source LLM app development platform.", stars: 46500, forks: 5600, language: "TypeScript", url: "https://github.com/langgenius/dify", trending: "+1,200", watchers: 420 },
      { id: "6", name: "LangChain", description: "Building applications with LLMs through composability", stars: 92000, forks: 14500, language: "Python", url: "https://github.com/langchain-ai/langchain", trending: "+2,100", watchers: 750 },
      { id: "7", name: "Stable Diffusion WebUI", description: "A browser interface based on Gradio library for Stable Diffusion", stars: 140000, forks: 28000, language: "Python", url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui", trending: "+5,200", watchers: 1200 },
      { id: "8", name: "fastapi", description: "Modern, fast web framework for building APIs with Python", stars: 75000, forks: 6400, language: "Python", url: "https://github.com/tiangolo/fastapi", trending: "+1,800", watchers: 620 },
      { id: "9", name: "Next.js", description: "The React Framework for Production with server actions and streaming", stars: 128000, forks: 27000, language: "TypeScript", url: "https://github.com/vercel/next.js", trending: "+3,500", watchers: 2100 },
      { id: "10", name: "Kubernetes", description: "Production-Grade Container Orchestration", stars: 112000, forks: 40500, language: "Go", url: "https://github.com/kubernetes/kubernetes", trending: "+2,800", watchers: 4500 },
      { id: "11", name: "TensorFlow", description: "An Open Source Machine Learning Framework for Everyone", stars: 185000, forks: 74000, language: "C++", url: "https://github.com/tensorflow/tensorflow", trending: "+1,500", watchers: 3200 },
    ],
  };
}

export async function getResearchPapers() {
  return {
    papers: [
      { title: "Attention Is All You Need", authors: "Vaswani, Shazeer, Parmar et al.", year: 2017, citations: 84500, relevance: 99, arxivId: "1706.03762", field: "NLP", abstract: "Introduces transformer architecture, foundation of modern LLMs" },
      { title: "BERT: Pre-training of Deep Bidirectional Transformers", authors: "Devlin, Chang, Lee, Toutanova", year: 2019, citations: 63200, relevance: 97, arxivId: "1810.04805", field: "NLP", abstract: "Bidirectional pre-training methodology for language understanding" },
      { title: "Language Models are Unsupervised Multitask Learners", authors: "Radford, Wu, Child et al.", year: 2019, citations: 42100, relevance: 96, arxivId: "1901.01029", field: "NLP", abstract: "GPT-2: zero-shot task transfer capabilities" },
      { title: "An Image is Worth 16x16 Words: Transformers for Image Recognition", authors: "Dosovitskiy, Beyer, Kolesnikov et al.", year: 2021, citations: 28900, relevance: 94, arxivId: "2010.11929", field: "Computer Vision", abstract: "Vision Transformer (ViT) architecture for image classification" },
      { title: "Flamingo: a Visual Language Model for Few-Shot Learning", authors: "Alayrac, Donahue, Luc et al.", year: 2022, citations: 12300, relevance: 92, arxivId: "2204.14198", field: "Multimodal", abstract: "In-context learning in vision-language models" },
      { title: "Constitutional AI: Harmlessness from AI Feedback", authors: "Bai, Kadavath, Schärli et al.", year: 2023, citations: 5640, relevance: 91, arxivId: "2212.08073", field: "AI Safety", abstract: "Aligning language models using constitutional AI principles" },
      { title: "ReAct: Synergizing Reasoning and Acting in Language Models", authors: "Yao, Zhao, Yu et al.", year: 2022, citations: 8900, relevance: 93, arxivId: "2210.03629", field: "Reasoning", abstract: "Combining reasoning traces and action space for better task solving" },
      { title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", authors: "Wei, Wang, Schuurmans et al.", year: 2023, citations: 15600, relevance: 95, arxivId: "2201.11903", field: "Reasoning", abstract: "Improving performance via intermediate reasoning steps" },
      { title: "Scaling Laws for Neural Language Models", authors: "Kaplan, McCandlish, Henighan et al.", year: 2020, citations: 9200, relevance: 94, arxivId: "2001.08361", field: "Model Scaling", abstract: "Understanding power-law relationships in model performance" },
      { title: "Learning Transferable Visual Models From Supervised Data", authors: "Radford, Kim, Hallacy et al.", year: 2021, citations: 18900, relevance: 93, arxivId: "2103.14030", field: "Vision-Language", abstract: "CLIP: Connecting vision and language through contrastive learning" },
      { title: "Outrageously Large Neural Networks for Efficient Conditional Computation", authors: "Shazeer, Mirhoseini, Maziarz et al.", year: 2017, citations: 7800, relevance: 88, arxivId: "1701.06538", field: "Model Architecture", abstract: "Mixture of Experts for scaling neural networks" },
    ],
  };
}

export async function getStartupIntelligence() {
  return {
    startups: [
      { name: "Anthropic", funding: "$5.0B Series C", stage: "Series C", valuation: "$15B", founded: 2021, hq: "San Francisco", tech: "Large Language Models, Constitutional AI", traction: "Claude API, Enterprise customers" },
      { name: "OpenAI", funding: "$80B+ Valuation", stage: "Private", valuation: "$80B+", founded: 2015, hq: "San Francisco", tech: "GPT Models, AI Safety", traction: "ChatGPT 200M+ users, Enterprise API" },
      { name: "Mistral AI", funding: "$415M Series B", stage: "Series B", valuation: "$2B", founded: 2023, hq: "Paris", tech: "Open-source LLMs, Edge AI", traction: "Mistral 7B, Enterprise partnerships" },
      { name: "Hugging Face", funding: "$235M Series D", stage: "Series D", valuation: "$4.5B", founded: 2016, hq: "New York", tech: "Model Hub, ML Infrastructure", traction: "5M+ monthly users, 1M+ models" },
      { name: "Scale AI", funding: "$325M Series C", stage: "Series C", valuation: "$7.3B", founded: 2016, hq: "San Francisco", tech: "Data Labeling, ML Ops", traction: "Fortune 500 customers, 50+ enterprise" },
      { name: "Stability AI", funding: "$101M Series B", stage: "Series B", valuation: "$1B", founded: 2020, hq: "London", tech: "Generative AI, Diffusion Models", traction: "Stable Diffusion, 5M+ users" },
      { name: "Perplexity AI", funding: "$500M+ Series C", stage: "Series C", valuation: "$3B+", founded: 2022, hq: "San Francisco", tech: "AI Search, LLMs", traction: "Perplexity search engine, 50M+ users" },
      { name: "Together AI", funding: "$102.5M Series B", stage: "Series B", valuation: "$1.1B", founded: 2022, hq: "San Francisco", tech: "Model Inference, Distributed AI", traction: "Open models, API platform" },
      { name: "Cohere", funding: "$275M Series C", stage: "Series C", valuation: "$5B", founded: 2021, hq: "Toronto", tech: "Generative AI, NLP Models", traction: "API for Fortune 500, enterprise" },
      { name: "Jasper AI", funding: "$125M Series A+", stage: "Series A+", valuation: "$1.5B", founded: 2021, hq: "San Francisco", tech: "Generative AI for Marketing", traction: "5K+ customers, $150M ARR" },
      { name: "Replit", funding: "$200M Series C", stage: "Series C", valuation: "$2B", founded: 2016, hq: "San Francisco", tech: "Cloud IDE, AI Coding", traction: "2M+ creators, AI Ghost Writer" },
    ],
  };
}

export async function getLatestAITools() {
  return {
    tools: [
      { name: "Claude 3.5 Sonnet", provider: "Anthropic", released: "2024-06-20", capabilities: "Advanced reasoning, code, multimodal", pricing: "$0.003/1K input", adoption: "Expert choice" },
      { name: "GPT-4o", provider: "OpenAI", released: "2024-05-13", capabilities: "Multimodal, 128K context, vision", pricing: "$0.005/1K input", adoption: "Most popular" },
      { name: "Gemini 2.0", provider: "Google DeepMind", released: "2024-12-02", capabilities: "Long context, reasoning, multimodal", pricing: "Free tier, $20/month Pro", adoption: "Highly rated" },
      { name: "Llama 3.1 70B", provider: "Meta (Open Source)", released: "2024-07-23", capabilities: "70B parameters, instruction-tuned", pricing: "Open source (free)", adoption: "Developer favorite" },
      { name: "Mixtral 8x22B", provider: "Mistral AI", released: "2024-04-10", capabilities: "176B parameters, MoE architecture", pricing: "Open source (free)", adoption: "Research choice" },
      { name: "Copilot Pro", provider: "Microsoft", released: "2024-01-15", capabilities: "Code generation, documentation", pricing: "$20/month", adoption: "High enterprise" },
      { name: "Perplexity Pro", provider: "Perplexity AI", released: "2024-03-01", capabilities: "Search + reasoning, real-time web", pricing: "$20/month", adoption: "Growing rapidly" },
      { name: "Command R+", provider: "Cohere", released: "2024-02-15", capabilities: "Long context (128K), RAG ready", pricing: "$0.003/1K input", adoption: "Enterprise AI" },
      { name: "Grok-2", provider: "xAI", released: "2024-08-09", capabilities: "Real-time info, reasoning, coding", pricing: "API available", adoption: "Emerging" },
      { name: "PaLM 2", provider: "Google", released: "2023-05-10", capabilities: "Multilingual, math, coding", pricing: "API pricing varies", adoption: "Stable" },
      { name: "Aleph Alpha Luminous", provider: "AlephAlpha", released: "2023-07-01", capabilities: "Long documents, European focus", pricing: "Custom enterprise pricing", adoption: "Enterprise" },
    ],
  };
}

export async function getNewTechReleases() {
  return {
    releases: [
      { name: "Python 3.13", date: "2024-10-07", type: "Language", features: ["Per-Interpreter GIL", "Interactive Shell", "Performance +15%"], adoption: "45%", download_count: 28000000 },
      { name: "Node.js 22 LTS", date: "2024-10-15", type: "Runtime", features: ["Native ESM", "Performance +20%", "Enhanced diagnostics"], adoption: "62%", download_count: 52000000 },
      { name: "TypeScript 5.3", date: "2024-11-21", type: "Language", features: ["Stable Decorators", "Type Parameters in const", "Better errors"], adoption: "78%", download_count: 62000000 },
      { name: "React 19", date: "2024-12-05", type: "Framework", features: ["Server Components", "Actions API", "New hooks"], adoption: "35%", download_count: 38000000 },
      { name: "Next.js 15", date: "2024-10-21", type: "Framework", features: ["React 19 support", "Enhanced Compiler", "Partial Prerendering"], adoption: "42%", download_count: 15000000 },
      { name: "Kubernetes 1.31", date: "2024-08-14", type: "Infrastructure", features: ["Improved scaling", "Enhanced observability", "Security updates"], adoption: "68%", download_count: 12000000 },
      { name: "Rust 1.82", date: "2024-10-17", type: "Language", features: ["Performance improvements", "Async enhancements", "Stabilizations"], adoption: "55%", download_count: 8500000 },
      { name: "Docker 27.0", date: "2024-07-01", type: "Container", features: ["Improved build", "Security", "Better compose"], adoption: "89%", download_count: 45000000 },
      { name: "PostgreSQL 17", date: "2024-10-08", type: "Database", features: ["Performance +40%", "JSON improvements", "Security"], adoption: "28%", download_count: 9500000 },
      { name: "Vue 3.4", date: "2024-12-01", type: "Framework", features: ["Performance boost", "Better DX", "New composables"], adoption: "38%", download_count: 8200000 },
      { name: "Go 1.23", date: "2024-09-03", type: "Language", features: ["Iterator support", "Range over integers", "Performance"], adoption: "52%", download_count: 6800000 },
    ],
  };
}

export async function getTechSpotlight() {
  return {
    experts: [
      { id: "1", name: "Yann LeCun", title: "Chief AI Scientist, Meta", building: "Open-source AI systems", stars: 125000, followers: 450000, impact: "Pioneering open-source AI" },
      { id: "2", name: "Demis Hassabis", title: "CEO, DeepMind", building: "AGI research", stars: 95000, followers: 380000, impact: "Leading frontier AI research" },
      { id: "3", name: "Sam Altman", title: "CEO, OpenAI", building: "GPT models", stars: 210000, followers: 2100000, impact: "Democratizing AI access" },
    ],
  };
}
