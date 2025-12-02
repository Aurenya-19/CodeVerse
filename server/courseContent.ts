// Comprehensive Course Content with Notes, Lectures, Flashcards, Practice, and Quizzes

export const courseContentMap = {
  "AI & Machine Learning": {
    notes: [
      "## Neural Networks Fundamentals\n- Neurons and perceptrons\n- Activation functions (ReLU, Sigmoid, Tanh)\n- Forward and backward propagation\n- Loss functions and optimization",
      "## Deep Learning Architectures\n- Convolutional Neural Networks (CNN)\n- Recurrent Neural Networks (RNN/LSTM)\n- Transformers and attention mechanisms\n- Transfer learning concepts",
      "## ML Workflow & Best Practices\n- Data preprocessing and normalization\n- Train-test-validation split\n- Hyperparameter tuning\n- Cross-validation and metrics (precision, recall, F1)"
    ],
    lectures: [
      { title: "Introduction to Neural Networks", duration: 45, videoUrl: "https://example.com/nn-intro" },
      { title: "Deep Learning with TensorFlow", duration: 60, videoUrl: "https://example.com/tf-deep" },
      { title: "Natural Language Processing Basics", duration: 50, videoUrl: "https://example.com/nlp-basics" },
      { title: "Computer Vision Fundamentals", duration: 55, videoUrl: "https://example.com/cv-fund" }
    ],
    flashcards: [
      { front: "What is a neuron?", back: "A computational unit that applies an activation function to weighted inputs" },
      { front: "Explain backpropagation", back: "Algorithm to compute gradients by chain rule from output to input layers" },
      { front: "What is overfitting?", back: "Model learns training data noise instead of generalizing to new data" },
      { front: "Name 3 activation functions", back: "ReLU, Sigmoid, Tanh - each with different properties and use cases" }
    ],
    practice: [
      { problem: "Build a neural network to classify MNIST digits", difficulty: "medium", estimatedTime: 30 },
      { problem: "Implement gradient descent from scratch", difficulty: "hard", estimatedTime: 45 },
      { problem: "Fine-tune a pre-trained CNN on custom dataset", difficulty: "medium", estimatedTime: 40 },
      { problem: "Build an LSTM for time series prediction", difficulty: "hard", estimatedTime: 60 }
    ],
    quizzes: [
      { question: "In CNN, what does a 3x3 filter do?", options: ["Detects patterns in 3x3 regions", "Compresses image 3x", "Removes noise"], correct: 0 },
      { question: "What does dropout do in neural networks?", options: ["Removes neurons randomly to prevent overfitting", "Speeds up training", "Increases accuracy"], correct: 0 },
      { question: "RNN is better for ___ tasks", options: ["Sequential/temporal", "Image classification", "Static data"], correct: 0 }
    ]
  },
  "Web Development": {
    notes: [
      "## Frontend Fundamentals\n- HTML5 semantic elements\n- CSS Flexbox and Grid layouts\n- JavaScript ES6+ features\n- DOM manipulation and events",
      "## React Deep Dive\n- Components and JSX\n- State and hooks (useState, useEffect, useContext)\n- Component lifecycle\n- Performance optimization (memo, useMemo)",
      "## Backend & Databases\n- REST API design principles\n- SQL vs NoSQL databases\n- Authentication (JWT, OAuth)\n- Database indexing and optimization"
    ],
    lectures: [
      { title: "HTML5 & Modern CSS", duration: 40, videoUrl: "https://example.com/html5-css" },
      { title: "JavaScript ES6+ Mastery", duration: 50, videoUrl: "https://example.com/js-es6" },
      { title: "React Hooks & State Management", duration: 55, videoUrl: "https://example.com/react-hooks" },
      { title: "Building Scalable APIs with Express", duration: 60, videoUrl: "https://example.com/express-apis" }
    ],
    flashcards: [
      { front: "What's the difference between let and const?", back: "let is block-scoped and reassignable; const is block-scoped and immutable" },
      { front: "Explain React hooks", back: "Functions that let you use state and other React features in functional components" },
      { front: "What is async/await?", back: "Syntactic sugar for promises that makes asynchronous code look synchronous" },
      { front: "Name 3 HTTP methods", back: "GET (retrieve), POST (create), PUT (update), DELETE (remove)" }
    ],
    practice: [
      { problem: "Build a todo app with React hooks", difficulty: "easy", estimatedTime: 45 },
      { problem: "Create a responsive dashboard layout", difficulty: "medium", estimatedTime: 50 },
      { problem: "Implement JWT authentication", difficulty: "hard", estimatedTime: 60 },
      { problem: "Build real-time chat with WebSockets", difficulty: "hard", estimatedTime: 75 }
    ],
    quizzes: [
      { question: "useEffect without dependency array runs ___ times", options: ["After every render", "Once on mount", "Never"], correct: 0 },
      { question: "CSS Grid is used for ___ layouts", options: ["2D grid layouts", "Linear layouts", "Dropdown menus"], correct: 0 },
      { question: "What does REST mean?", options: ["Representational State Transfer", "Really Easy Service Tool", "Remote Service Terminal"], correct: 0 }
    ]
  },
  "Cybersecurity": {
    notes: [
      "## Security Fundamentals\n- Encryption (symmetric, asymmetric)\n- Hashing and salt\n- Digital signatures and certificates\n- Common attacks (SQL injection, XSS, CSRF)",
      "## Network Security\n- Firewalls and intrusion detection\n- VPN and tunneling\n- SSL/TLS protocols\n- DDoS attacks and mitigation",
      "## Application Security\n- OWASP Top 10\n- Secure coding practices\n- Penetration testing basics\n- Security headers and CORS"
    ],
    lectures: [
      { title: "Cryptography Fundamentals", duration: 50, videoUrl: "https://example.com/crypto-fund" },
      { title: "Web Application Security", duration: 55, videoUrl: "https://example.com/web-sec" },
      { title: "Penetration Testing Basics", duration: 60, videoUrl: "https://example.com/pentest" },
      { title: "Incident Response & Forensics", duration: 50, videoUrl: "https://example.com/incident-resp" }
    ],
    flashcards: [
      { front: "What is SQL injection?", back: "Attack where malicious SQL code is inserted into input fields to manipulate database" },
      { front: "Explain XSS (Cross-Site Scripting)", back: "Attacker injects malicious scripts that execute in victim's browser" },
      { front: "What is a zero-day exploit?", back: "Vulnerability unknown to vendor, exploited before patch is released" },
      { front: "Explain HTTPS", back: "HTTP with encryption (TLS/SSL) to secure data transmission" }
    ],
    practice: [
      { problem: "Identify and fix SQL injection vulnerabilities", difficulty: "medium", estimatedTime: 40 },
      { problem: "Implement secure password hashing", difficulty: "easy", estimatedTime: 25 },
      { problem: "Conduct basic penetration test", difficulty: "hard", estimatedTime: 60 },
      { problem: "Analyze network traffic for threats", difficulty: "hard", estimatedTime: 50 }
    ],
    quizzes: [
      { question: "What is the purpose of salt in hashing?", options: ["Prevent rainbow table attacks", "Speed up hashing", "Encrypt data"], correct: 0 },
      { question: "OWASP Top 10 does NOT include:", options: ["Slow loading times", "SQL Injection", "XSS"], correct: 0 },
      { question: "CORS is used to:", options: ["Control cross-origin requests", "Encrypt data", "Authenticate users"], correct: 0 }
    ]
  }
};

export function getCourseContent(category: string) {
  const categoryKey = Object.keys(courseContentMap).find(
    k => k.toLowerCase() === category.toLowerCase()
  );
  return categoryKey ? courseContentMap[categoryKey as keyof typeof courseContentMap] : null;
}

export function enrichCourseWithContent(course: any) {
  const content = getCourseContent(course.category || "Web Development");
  return {
    ...course,
    content: content || courseContentMap["Web Development"],
    hasNotes: true,
    hasLectures: true,
    hasFlashcards: true,
    hasPractice: true,
    hasQuizzes: true
  };
}
