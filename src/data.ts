import { Project, Writing, BackgroundItem } from './types';

export const HERO_DATA = {
  fullName: "Faizuddarain Syam",
  handle: "Faiz",
  oneLiner: "Data Scientist and AI Engineer. I design high-reliability agentic systems and train deep learning models.",
  location: "Jakarta, Indonesia · Remote available",
};

export const INTRO_PARAGRAPHS = [
  "I am an AI engineer and data scientist based in Jakarta. My day-to-day focus lies in designing LLM-powered agentic workflows, implementing robust retrieval pipelines (RAG), and training reinforcement learning systems.",
  "I enjoy bridging the gap between advanced models and actual, practical tools. To me, a model is only as good as the system wrapping it, which means focusing heavily on execution speed, tool execution accuracy, and real user needs.",
  "I appreciate clean interfaces and thoughtful design, a habit I picked up from building game mechanics and spatial interface prototypes early in my journey. Building AI that is easy to navigate and highly predictable is my target."
];

export const INTRO_EXPANDED = [
  "In my current projects, I am spending a lot of time working on multi-step agent architectures. This involves coordinating Model Context Protocol (MCP) integrations, structuring knowledge base queries, and designing structured systems that can self-correct when things fail.",
  "My graduate research at Eindhoven University of Technology was all about applying the AlphaZero reinforcement learning framework to complex, constrained game spaces. That academic focus trained me to approach deep learning with rigorous verification and experimental performance tracking.",
  "Whether I am compiling high-demand C++ engine code or implementing multi-agent pipelines with Python and TypeScript, my goal is always absolute runtime reliability, clean data pipelines, and clear user experiences."
];

export const PROJECTS: Project[] = [
  {
    id: "ciamic-agents",
    name: "CIAMIC Chat Assistant",
    subtitle: "High-reliability corporate chatbot and multi-channel system",
    domainTags: ["LLM Agents", "RAG Pipelines", "Full-Stack"],
    status: "Completed",
    context: "Traditional search methods within enterprise networks often struggle to search across non-integrated departments, leading to disjointed data retrieval.",
    description: "I led a cross-functional development team to build the application layer and API schema for CIAMIC. It provides automated, high-reliability access to company databases through a highly optimized RAG setup. The interface is built with React and Tailwind, communicating with a robust backend to handle conversational knowledge retrieval safely across WhatsApp and Web channels.",
    depthTradeoff: "We opted for a hybrid database setup, pairing structured PostgreSQL relation tables with MongoDB's loose document storage. This kept transaction logging fast and structured while letting the knowledge base scale freely, though it required custom synchronization handlers to prevent data lag.",
    stack: ["React", "Tailwind CSS", "Laravel", "PostgreSQL", "MongoDB", "Python"],
    link: "https://github.com",
    imagePath: "/images/agent_blueprint_1780238632736.png"
  },
  {
    id: "alphazero-draughts",
    name: "AlphaZero International Draughts",
    subtitle: "Deep reinforcement learning within constrained budget limits",
    domainTags: ["Reinforcement Learning", "PyTorch", "HPC"],
    status: "Research",
    context: "Deploying high-dimensional self-play models (like AlphaZero) is computationally prohibitive outside massive industry research labs.",
    description: "This was my graduate thesis project at Eindhoven University of Technology (TU/e). I adapted and optimized the AlphaZero algorithm to perform efficiently on limited compute. The system bootstrapping utilized a hybrid model with C++ minimax engines, allowing the model to train over 7 million self-play matches on high-performance university SLURM clusters.",
    depthTradeoff: "To speed up early training, we used heuristic simulators as initial training targets. This cut model converging times dramatically, though it introduced slight structural bias that we had to correct later with aggressive search-depth variance.",
    stack: ["Python", "PyTorch", "C++", "SLURM", "HPC Clusters"],
    link: "https://research.tue.nl/en/studentTheses/applying-alphazero-to-the-game-of-international-draughts",
    imagePath: "/images/scribe_blueprint_1780238654041.png"
  },
  {
    id: "neurovis-activation",
    name: "Neurovis Node Interpretability",
    subtitle: "An interpretability platform to demystify complex neural network outputs",
    domainTags: ["Interpretability", "Deep Learning", "Data Vis"],
    status: "Active",
    context: "Deeper convolutional layers are generally treated as black boxes, making model error diagnosis difficult.",
    description: "I designed and built an interactive web-based visualizer to trace and display how deep networks construct classifications. The application maps layer activations in real-time using dimensionality reduction (UMAP and t-SNE) paired with Grad-CAM heatmaps to let researchers explore custom class-activation behaviors interactively.",
    depthTradeoff: "We loaded all dimension reduction projections on the client side using optimized local layers. This bypasses server hosting latency and billing, but puts structural load on the client GPU, leading to framerate drops on older target hardware.",
    stack: ["React", "D3.js", "Python", "Flask", "TypeScript", "VGG16"],
    link: "https://drive.google.com/file/d/1v8I-xOIPv7WyK1d0Py_hDo3lguEIJB6q/",
    imagePath: "/images/latent_blueprint_1780238671995.png"
  }
];

export const WORK_ITEMS: BackgroundItem[] = [
  {
    id: "work-1",
    type: "work",
    role: "Machine Learning Engineer",
    organization: "PT Kreasi Media Asia (Insignia)",
    dateRange: "Jan 2026 - Present",
    popoutCopy: "Architecting agent workflows and building large-scale automated chatbots used by nationwide-level organizations. I focus on orchestration, security, and making sure the runtime behaves exactly as intended.",
    details: "I design and build enterprise LLM-based agent systems and chatbot pipelines. My work involves designing agent tools, routing client queries through stateful recovery steps, and deploying reliable architectures from prototype to production.",
    logoPath: "/logos/kma.png",
    highlights: [
      "Process complex user queries: Design and build agentic workflows with knowledge retrieval, SQL querying, and MCP integrations to automate multi-step client workflows.",
      "Support nationwide entities: Develop production-ready chatbot components to handle high volumes without throughput degradation or prompt context leakage.",
      "Ensure robust deployment: Maintain full observability across development environments, testing prompt latency, and ensuring clean model orchestration."
    ],
    skills: ["LLMs", "Agentic AI", "Prompt Engineering", "MCP", "Langfuse", "Python"]
  },
  {
    id: "work-2",
    type: "work",
    role: "Data Scientist",
    organization: "PT Telkom Indonesia",
    dateRange: "Jun 2024 - Dec 2025",
    popoutCopy: "Led enterprise LLM-based chatbot architectures, optimizing model accuracy and RAG precision while directing a multi-disciplinary development team.",
    details: "I was the technical lead for corporate AI assistant initiatives. I designed RAG pipelines, guided UI/UX standards, and synchronized structural knowledge updates across dynamic systems.",
    logoPath: "/logos/telkom.png",
    highlights: [
      "Enterprise chatbot delivery: Architected the core system behind automated WhatsApp AI agents and company information chatbots, ensuring high-reliability text generation.",
      "Boosted engagement by 850%: Successfully aligned product directions with business metrics, driving outstanding user growth and high satisfaction ratings across multiple enterprise divisions.",
      "Developed custom dashboards: Built Streamlit trend trackers and analytics engines, tracking model inference times to guide data-driven iterations."
    ],
    skills: ["RAG Pipelines", "PostgreSQL", "MongoDB", "Laravel", "Prompt Optimization", "Streamlit"]
  },
  {
    id: "work-3",
    type: "work",
    role: "C++ Programmer",
    organization: "PT Gameloft Indonesia",
    dateRange: "Apr 2018 - Apr 2019",
    popoutCopy: "Designed core gameplay physics and optimized pathfinding AI for computer-controlled opponents, creating balanced and responsive experiences.",
    details: "As a gameplay developer, I specialized in rendering optimization, visual assets integration, and algorithmic enhancements inside high-performance game instances.",
    logoPath: "/logos/gameloft.png",
    highlights: [
      "Optimized opponent AI: Built sophisticated computer-controlled units with adaptive tactics, lowering processing costs while raising player engagement.",
      "Engineered game mechanics: Coded standard gameplay physics and graphics pipelines to maintain high render framerates.",
      "Visual asset production: Created 3D graphics, texture maps, and animation keyframes to synchronize seamlessly with written game engines."
    ],
    skills: ["C++", "AI Algorithms", "3D Rendering", "Game Physics", "Cross-Functional Collaboration"]
  },
  {
    id: "work-4",
    type: "work",
    role: "Back-End Developer (Intern)",
    organization: "PT Metrodata Electronics",
    dateRange: "Jul 2016 - Sep 2016",
    popoutCopy: "Built secure back-end platforms to automate internal applicant screenings and hiring evaluations.",
    details: "Designed and prototyped candidate screening tools using Microsoft ASP.NET environments, cooperating with talent acquisition teams to establish programmatic metrics.",
    logoPath: "/logos/metrodata.png",
    highlights: [
      "Streamlined recruitment: Created an automated test-evaluation portal, improving onboarding speeds and system reliability.",
      "Constructed custom back-ends: Focused on scalability, transaction isolation, and secure database operations.",
      "Requirement analysis: Translated cross-department guidelines into technical database fields and optimized workflows."
    ],
    skills: ["C#", "ASP.NET MVC", "SQL Server", "Backend Development", "System Integration"]
  }
];

export const EDUCATION_ITEMS: BackgroundItem[] = [
  {
    id: "edu-1",
    type: "education",
    role: "MSc in Data Science in Engineering",
    organization: "Eindhoven University of Technology (TU/e)",
    dateRange: "Sep 2020 - Feb 2023",
    popoutCopy: "Researched deep reinforcement learning and model optimization, designing an efficient AlphaZero implementation tailored for constrained environments.",
    details: "My graduate curriculum centered on advanced machine learning algorithms, model interpretability, and system optimization. My research was fully funded by premium regional scholarships.",
    logoPath: "/logos/tue.png",
    highlights: [
      "Scholarships: Recipient of the prestigious Amandus H. Lundqvist Scholarship Program (ALSP) and the Holland Scholarship (HS) for academic achievements.",
      "Thesis research: Successfully adapted AlphaZero to International Draughts on high-performance high-compute clusters with 7 million self-play iterations.",
      "Rigorous model evaluation: Benchmarked Monte Carlo Tree Search optimization formulas to identify performance tradeoffs under strict hardware constraints."
    ],
    skills: ["Reinforcement Learning", "PyTorch", "Python", "SLURM", "HPC", "Optimization"]
  },
  {
    id: "edu-2",
    type: "education",
    role: "BSc in Informatics Engineering",
    organization: "Institut Teknologi Sepuluh Nopember (ITS)",
    dateRange: "Sep 2013 - Sep 2017",
    popoutCopy: "Acquired a solid grounding in software engineering, fuzzy logic, and data structures. I used my final project to design intelligent adaptive gameplay mechanics.",
    details: "Specialized in data modeling, object-oriented software patterns, and game systems. Formulated deep conceptual knowledge of lower-level compilers and parallel scripting.",
    logoPath: "/logos/its.png",
    highlights: [
      "Final Project: Developed an ANFIS fuzzy logic difficulty-balancing system in an action-adventure game to regulate interactive challenges automatically.",
      "Strong academic record: Graduated with honors and an IPK of 3.48/4.00, demonstrating consistent problem-solving capabilities.",
      "Platform optimization: Built web layouts and visual interfaces for student organizations, focusing on ergonomic layouts."
    ],
    skills: ["C++", "Java", "Fuzzy Systems", "Software Architecture", "Data Structures", "Algorithms"]
  }
];

export const WRITINGS: Writing[] = [
  {
    id: "write-1",
    title: "Can AlphaZero teach us how to build better enterprise tools?",
    framing: "Looking at the convergence of reinforcement learning and deterministic business execution layers.",
    excerpt: "We often think of AlphaZero as a gaming model. However, its decision balance under constraints offers incredible lessons for designing agent tools that operate on corporate APIs without infinite loop failures.",
    topicTag: "Reinforcement Learning",
    date: "April 2026",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_dashboard_blueprint_1780239291988.png"
  },
  {
    id: "write-2",
    title: "Beyond the hype: RAG is a data pipeline challenge, not an AI model challenge",
    framing: "Why optimizing prompt templates is secondary to cleaning up database connections.",
    excerpt: "When we deployed CIAMIC to users, we realized that 90% of model errors resulted from messy knowledge hierarchies. Getting LLMs to answer correctly starts with cleaning your document index pipelines, not choosing a larger parameter model.",
    topicTag: "RAG Pipelines",
    date: "February 2026",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_memory_blueprint_1780239310389.png"
  },
  {
    id: "write-3",
    title: "Optimizing Agentic Workflows with Model Context Protocol (MCP)",
    framing: "How structured systems can make agent operations highly predictable without infinite context expansion.",
    excerpt: "Building autonomous agents that run SQL queries or navigate knowledge stores should not mean dumping a wall of text into a prompt window. In this article, I overview building compact, secure tool endpoints using MCP.",
    topicTag: "LLM Agents",
    date: "November 2025",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_loop_blueprint_1780239327797.png"
  },
  {
    id: "write-4",
    title: "Demystifying CNNs: Visually analyzing convolutional network heatmaps",
    framing: "An overview of using Grad-CAM and dimension reduction techniques to gain instant trace inside deep layers.",
    excerpt: "How does a CNN identify a target image feature? Placing layers onto a UMAP dimension map combined with activation heatmaps shows us exactly when a model focuses on pixel noise instead of real features.",
    topicTag: "Explainable AI",
    date: "August 2025",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_creative_blueprint_1780239344330.png"
  }
];
