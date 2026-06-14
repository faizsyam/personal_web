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
    id: "tsurvey-ai-copilot",
    name: "TSurvey AI Copilot",
    subtitle: "End-to-end AI enhancement for Telkomsel's survey platform",
    domainTags: ["Gen AI", "Agentic Pipeline", "Data Intelligence"],
    status: "Active",
    context: "Telkomsel's TSurvey platform needed an integrated AI layer to streamline the entire survey lifecycle — from conceptualizing research goals to delivering presentation-ready insights.",
    description: "I helped design the system architecture for TSurvey's AI enhancements, embedding a multi-stage AI pipeline directly into the platform. The system generates theoretical research models from a topic, crafts context-aware survey questions from those models, validates and cleans incoming responses from noise, and on completed data — generates rich chart-based insights along with executive-level slide decks. All stages are seamlessly tied into the existing TSurvey user interface.",
    depthTradeoff: "We structured the pipeline as independent but context-aware stages rather than a single end-to-end prompt. This allows per-stage validation and rollback when a generated theory or question set needs revision, but trades some token efficiency and overall latency for the added control and safety.",
    stack: ["Python", "FastAPI", "LangChain", "PostgreSQL", "React", "TypeScript", "OpenAI API"],
    link: "https://survey.telkomsel.co.id",
    imagePath: "/images/agent_blueprint_1780238632736.png"
  },
  {
    id: "mira-virtual-assistant",
    name: "MIRA - Mitsubishi Virtual Assistant",
    subtitle: "Omnichannel LLM-based virtual assistant for Mitsubishi Motors Indonesia",
    domainTags: ["LLM Agents", "Chatbot", "Full-Stack"],
    status: "Active",
    context: "Mitsubishi Motors Indonesia needed a stable AI-driven virtual assistant across multiple customer touchpoints including WhatsApp, the official website, and the MyMitsubishi mobile app.",
    description: "I manage the development and maintenance of MIRA, an omnichannel virtual assistant deployed for Mitsubishi Motors Indonesia. The assistant operates across WhatsApp, the official website, and the MyMitsubishi mobile app to handle customer queries ranging from car specifications to after-sales service. I oversee knowledge base improvements, conversation flow refinement, error and hallucination monitoring, and weekly performance reporting to the client.",
    depthTradeoff: "Balancing rich LLM-generated responses with strict factual accuracy and brand safety required careful prompt engineering combined with continuous knowledge base auditing. We trade conversational fluidity for guaranteed correctness when discussing pricing, technical specs, or service procedures.",
    stack: ["LLM", "Chatbot", "WhatsApp Business API", "React", "Analytics"],
    link: "https://www.mitsubishi-motors.co.id",
    imagePath: "/images/mira.png"
  },
  {
    id: "ciamic-agents",
    name: "CIAMIC Chat Assistant",
    subtitle: "Intelligent corporate chatbot with omnichannel AI agent deployment",
    domainTags: ["LLM Agents", "RAG Pipelines", "Full-Stack"],
    status: "Completed",
    context: "Telkom needed an internal LLM-based chatbot and WhatsApp AI agent to provide rapid, reliable access to corporate intelligence and company information across its large workforce.",
    description: "I led a cross-functional team to develop CIAMIC, an omnichannel intelligent assistant that provides employees and customers with rapid access to corporate knowledge through a web chatbot and WhatsApp. The system features a React.js frontend with TailwindCSS, a Laravel backend for API management, and optimized RAG pipelines to ensure accurate and contextually relevant responses. I also built an automated Python-based analytics dashboard for real-time topic detection, user trend analysis, and agent performance tracking.",
    depthTradeoff: "We engineered a hybrid RAG pipeline that balances retrieval speed with answer accuracy. This trades some query latency for higher response quality when dealing with complex, multi-departmental knowledge across the organization.",
    stack: ["React", "Tailwind CSS", "Laravel", "Python", "RAG", "LLM"],
    link: "https://www.telkom.co.id",
    imagePath: "/images/agent_blueprint_1780238632736.png"
  },
  {
    id: "alphazero-draughts",
    name: "AlphaZero International Draughts",
    subtitle: "Deep reinforcement learning within constrained budget limits",
    domainTags: ["Reinforcement Learning", "PyTorch", "HPC"],
    status: "Research",
    context: "Deploying high-dimensional self-play models outside massive research labs is computationally prohibitive, requiring novel optimization strategies to achieve competitive results.",
    description: "My graduate thesis at Eindhoven University of Technology (TU/e). I adapted and optimized the AlphaZero algorithm to perform efficiently on limited compute. The system bootstrapping utilized a hybrid model with C++ minimax engines, allowing the model to train over 7 million self-play matches on high-performance university SLURM clusters. I proposed and validated a product-based loss function (policy + value loss) which demonstrated superior stability over standard additive loss, achieving state-of-the-art results and defeating the 7 strongest minimax opponents with only 500 MCTS simulations.",
    depthTradeoff: "To speed up early training, we used heuristic simulators (Piece Count and Minimax-based Scan engines) as initial training targets. This cut model converging times dramatically, though it introduced slight structural bias that we had to correct later with aggressive search-depth variance.",
    stack: ["Python", "PyTorch", "C++", "SLURM", "HPC Clusters"],
    link: "https://research.tue.nl/en/studentTheses/applying-alphazero-to-the-game-of-international-draughts",
    imagePath: "/images/scribe_blueprint_1780238654041.png"
  },
  {
    id: "visual-analytics-suspicious",
    name: "Visual Analytics - Suspicious Data Analysis",
    subtitle: "Streamlit-based investigation tool for link analysis and entity extraction",
    domainTags: ["Data Visualization", "NLP", "Network Analysis"],
    status: "Completed",
    context: "Investigating suspicious entities often involves analyzing disparate datasets (news, emails, reports) to uncover hidden communication networks and movement patterns.",
    description: "I developed a Streamlit-based investigation tool that leverages NetworkX to visualize communication links and movement patterns between suspicious entities. The system uses SpaCy for automated Named Entity Recognition (NER) to extract persons, locations, and organizations from unstructured text. I engineered data pipelines to integrate disparate datasets, enabling multi-perspective link analysis to uncover criminal relationships and suspicious behaviors.",
    depthTradeoff: "Integrating real-time graph visualization with NLP pipelines on a single Streamlit instance trades deployment simplicity for some performance overhead on large graph datasets. This pushes larger investigations toward pre-computed graph data rather than live processing.",
    stack: ["Python", "Streamlit", "NetworkX", "SpaCy", "NLP"],
    link: "https://drive.google.com/file/d/1M1N54DBykofBb1PzCkWrzCEKqPVki8Ou",
    imagePath: "/images/visual_layer_blueprint_1781203039742.jpg"
  },
  {
    id: "image-inpainting-celeb",
    name: "Image Inpainting on Celebrity Face Dataset",
    subtitle: "U-Net based CNNs for facial image reconstruction and mask restoration",
    domainTags: ["Computer Vision", "Deep Learning", "CNNs"],
    status: "Completed",
    context: "Restoring missing or occluded facial regions requires deep learning models that can accurately reconstruct both texture and structural details in a visually coherent way.",
    description: "I developed and compared four U-Net based CNN architectures for image reconstruction using the CelebA, Flickr, and Cityscapes datasets. I evaluated 3-channel vs. 4-channel input strategies and compared MSE loss against a combined MSE and SSIM-based loss function. The optimal configuration (4-channel input with combined loss) achieved an SSIM of 0.9770 and PSNR of 32.69 on masked regions, demonstrating that providing the mask as an additional input channel significantly improves texture blending and structural detail.",
    depthTradeoff: "Using a 4-channel input (image + mask channel) trades memory and compute demand for reconstruction quality. The gains in texture fidelity and boundary blending are substantial, especially for portrait images with complex hair and skin texture.",
    stack: ["Python", "PyTorch", "U-Net", "CNN", "CelebA"],
    link: "https://drive.google.com/file/d/1ze94hDTjwUMG87ZlDFDpOaE7-TNhgRUE",
    imagePath: "/images/workspace_layer_blueprint_1781203056668.jpg"
  },
  {
    id: "semantic-segmentation-cityscapes",
    name: "Semantic Segmentation on Urban Street Scenes",
    subtitle: "U-Net architecture for 30-class semantic segmentation on the Cityscapes dataset",
    domainTags: ["Computer Vision", "Semantic Segmentation", "AutoML"],
    status: "Completed",
    context: "Autonomous driving and urban planning require pixel-accurate scene understanding for safe navigation and environmental analysis.",
    description: "I implemented a U-Net architecture for 30-class semantic segmentation on the Cityscapes dataset, integrating convolutional blocks, batch normalization, and dropout layers to improve feature extraction and stability. I utilized Optuna for automated hyperparameter optimization across architecture parameters, dropout rates, and learning rate schedules. The model achieved a significant IoU score increase from 0.44 to 0.94 through targeted refinement, demonstrating accelerated convergence and robust performance without data augmentation.",
    depthTradeoff: "Using Optuna for extensive hyperparameter search trades computational search time for model quality. The resulting architecture parameters generalize well without requiring expensive data augmentation, making it efficient for practical deployment.",
    stack: ["Python", "PyTorch", "U-Net", "Optuna", "Cityscapes"],
    link: "https://drive.google.com/file/d/1emkHJjyHpERjQdl10knghAjTk5Yp1zvw",
    imagePath: "/images/hci_layer_blueprint_1781203023489.jpg"
  },
  {
    id: "neurovis-activation",
    name: "Neurovis Node Interpretability",
    subtitle: "An interpretability platform to demystify complex neural network outputs",
    domainTags: ["Interpretability", "Deep Learning", "Data Vis"],
    status: "Active",
    context: "Deeper convolutional layers are generally treated as black boxes, making model error diagnosis and understanding difficult for practitioners.",
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
    title: "The Passenger Problem",
    framing: "Reflections from 'Reimagining Education in the Era of AI,' a talk by Anies Baswedan and Najelaa Shihab.",
    excerpt: "After years of teaching my mathematics-professor father how to use AI, I found myself sitting in on a far harder conversation: if students can produce an answer in ten seconds, what is school even testing anymore? This piece takes that question into a talk featuring two of Indonesia's most prominent education voices, unpacking why 'be the driver, not the passenger' is more than a slogan, why teachers and policymakers may be even less ready than students, and why Indonesia's vast regional divides make this an especially high-stakes problem. It ends with an uncomfortable but clarifying idea: AI didn't create passive learners, it just gave them a faster vehicle.",
    topicTag: "Education & AI",
    date: "May 17, 2026",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_dashboard_blueprint_1780239291988.png"
  },
  {
    id: "write-2",
    title: "When AI Changes Everything: What Design Really Means Now",
    framing: "'We're doomed' — a designer's reaction to AI, and why that fear is built on a misunderstanding of what design actually is.",
    excerpt: "When a designer friend watched an AI video generator produce in minutes what his team would need weeks to build, his reaction was simple panic. This piece traces how that panic comes from conflating design with execution, and walks through what happens to a profession when its long-standing bottleneck (craft and tool mastery) suddenly disappears. Drawing a parallel to what happened to hand-drawn illustration after Photoshop, it lays out which parts of design AI can absorb, which parts remain irreducibly human, and what skills are actually worth building if you want to stay relevant in a bifurcating industry.",
    topicTag: "Design & AI",
    date: "Mar 15, 2026",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_memory_blueprint_1780239310389.png"
  },
  {
    id: "write-3",
    title: "What's Left for AI Engineers?",
    framing: "How the role of AI Engineer is changing in a fast-moving AI world.",
    excerpt: "Building a conversational AI agent used to mean wrestling with raw data, training models from scratch, and surviving nights of failed experiments. Now it can mean snapping together pre-built APIs like IKEA furniture, and that ease comes with a quiet identity crisis. This piece traces the AI engineer's evolution from builder to integrator, to orchestrator, to strategic enabler, and asks what's coming next as AI itself starts to feel less like a specialty and more like electricity. It's a short, honest look at what it feels like to watch your job get easier and harder to define at the same time.",
    topicTag: "AI Engineering",
    date: "Jun 12, 2025",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_loop_blueprint_1780239327797.png"
  },
  {
    id: "write-4",
    title: "More Than Just a 'Chatbot'",
    framing: "How a chatbot can help drive company-wide transformation.",
    excerpt: "After sitting through AI strategy sessions that never quite answered how AI creates value beyond day-to-day operations, my team and I faced a familiar problem: senior leadership wasn't excited about 'yet another internal chatbot.' This piece walks through how we reframed an internal RAG-based assistant, not as a shovel for digging, but as a treasure map showing where to dig, and lays out five reasons a simple chatbot can become the entry point for a much bigger shift in company culture, data infrastructure, and decision-making. It's a candid field report from the early, uncertain stage of trying to turn a tool into a transformation.",
    topicTag: "AI Strategy",
    date: "May 16, 2025",
    link: "https://faizsyam.medium.com/",
    imagePath: "/images/writing_creative_blueprint_1780239344330.png"
  }
];
