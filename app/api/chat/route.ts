// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simulated MCP-style context and response generation
const knowledgeBase = {
  skills: {
    backend: ["Python", "FastAPI", "Django", "REST APIs", "GraphQL", "PostgreSQL", "Redis"],
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    devops: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "GitHub Actions"],
    ai: ["Applied ML", "LLMs", "RAG Systems", "Intelligent Automation", "Log Analysis"],
  },
  experience: [
    {
      company: "American Airlines",
      role: "Senior Software Engineer (SDE-3)",
      period: "2023 - Present",
      highlights: [
        "Architected flight data caching system reducing API latency by 70%",
        "Built microservices handling 10K+ requests/second",
        "Implemented batch processing pipelines for data synchronization",
        "Led team of 4 engineers on critical production systems",
      ],
    },
    {
      company: "MaxLinear Technologies",
      role: "Software Development Engineer",
      period: "2021 - 2023",
      highlights: [
        "Improved UI engagement by 30% using React + TypeScript",
        "Built AI-assisted log analysis tool reducing debugging time by 25%",
        "Reduced deployment time by 35% with Docker CI/CD pipelines",
        "Implemented WebSocket-based real-time dashboard updates",
      ],
    },
  ],
  projects: [
    {
      name: "Flight Data Caching System",
      tech: ["Redis", "FastAPI", "Python"],
      impact: "70% faster API responses, 50% reduction in database load",
    },
    {
      name: "AI Log Analyzer",
      tech: ["Python", "ML", "ElasticSearch"],
      impact: "25% faster debugging, automated error pattern detection",
    },
    {
      name: "Real-time Dashboard",
      tech: ["React", "WebSocket", "Node.js"],
      impact: "90% reduction in server load vs polling",
    },
    {
      name: "Batch Processing Pipeline",
      tech: ["Python", "Celery", "PostgreSQL"],
      impact: "60% reduction in data sync latency",
    },
  ],
};

// Intent classification
function classifyIntent(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.match(/skill|tech|stack|know|proficient|expert/)) return "skills";
  if (lower.match(/experience|work|job|company|career|role/)) return "experience";
  if (lower.match(/project|built|created|portfolio|demo/)) return "projects";
  if (lower.match(/contact|reach|email|linkedin|github|hire|connect/)) return "contact";
  if (lower.match(/who|about|yourself|introduce|tell me/)) return "intro";
  if (lower.match(/hi|hello|hey|greet/)) return "greeting";
  if (lower.match(/performance|optimization|cache|fast|speed/)) return "performance";
  if (lower.match(/backend|api|server|database/)) return "backend";
  if (lower.match(/frontend|react|ui|ux/)) return "frontend";
  
  return "general";
}

// Generate contextual response
function generateResponse(intent: string, message: string): { response: string; context: Record<string, unknown> } {
  const responses: Record<string, () => { response: string; context: Record<string, unknown> }> = {
    greeting: () => ({
      response: "Hey there! 👋 I'm Vamsi's AI assistant, powered by a custom MCP backend. I have access to his complete professional profile. What would you like to know about his skills, experience, or projects?",
      context: { intent: "greeting", confidence: 0.95 },
    }),
    
    intro: () => ({
      response: `I'm the AI assistant for **Vamsi Krishna Vissapragada**, a Senior Software Engineer (SDE-3) at American Airlines.\n\n🎯 **Specialization**: Building scalable backend systems, full-stack platforms, and AI-assisted tools\n\n💼 **Current Focus**: Microservices architecture, performance optimization, and production-grade systems\n\nFeel free to ask about his skills, experience, or projects!`,
      context: { intent: "intro", dataSource: "knowledgeBase" },
    }),
    
    skills: () => ({
      response: `Here's Vamsi's technical expertise:\n\n**🔧 Backend**\n${knowledgeBase.skills.backend.join(", ")}\n\n**🎨 Frontend**\n${knowledgeBase.skills.frontend.join(", ")}\n\n**☁️ DevOps**\n${knowledgeBase.skills.devops.join(", ")}\n\n**🤖 AI/ML**\n${knowledgeBase.skills.ai.join(", ")}\n\nHe specializes in building production-grade systems that handle high traffic!`,
      context: { intent: "skills", skills: knowledgeBase.skills },
    }),
    
    experience: () => ({
      response: knowledgeBase.experience.map(exp => 
        `**${exp.company}** (${exp.period})\n*${exp.role}*\n${exp.highlights.map(h => `• ${h}`).join("\n")}`
      ).join("\n\n"),
      context: { intent: "experience", companies: knowledgeBase.experience.map(e => e.company) },
    }),
    
    projects: () => ({
      response: `Here are some notable projects:\n\n${knowledgeBase.projects.map(p => 
        `**${p.name}**\n🛠️ ${p.tech.join(", ")}\n📈 ${p.impact}`
      ).join("\n\n")}\n\nCheck out the **Performance Optimizations** section on this page for live demos!`,
      context: { intent: "projects", projectCount: knowledgeBase.projects.length },
    }),
    
    performance: () => ({
      response: `Vamsi has implemented several performance optimizations:\n\n**1. Smart Caching** (American Airlines)\nRedis caching for flight data → 70% faster responses\n\n**2. Indexed Search** (MaxLinear)\nO(log n) search algorithm → 25% faster debugging\n\n**3. Batch Processing** (American Airlines)\nConnection pooling → 60% less latency\n\n**4. WebSocket Events** (MaxLinear)\nReal-time updates → 90% less server load\n\n👇 **Try the live demos in the Performance Optimizations section!**`,
      context: { intent: "performance", hasLiveDemos: true },
    }),
    
    backend: () => ({
      response: `Vamsi's backend expertise includes:\n\n**Languages**: Python (primary), Node.js, Go\n**Frameworks**: FastAPI, Django, Express\n**Databases**: PostgreSQL, Redis, MongoDB, ElasticSearch\n**Architecture**: Microservices, Event-driven, REST/GraphQL APIs\n\n🔥 **Highlight**: Built APIs handling 10K+ requests/second at American Airlines`,
      context: { intent: "backend", focus: "scalability" },
    }),
    
    frontend: () => ({
      response: `Vamsi's frontend skills:\n\n**Core**: React, Next.js, TypeScript\n**Styling**: Tailwind CSS, CSS-in-JS, Framer Motion\n**State**: Redux, Zustand, React Query\n**Testing**: Jest, React Testing Library, Cypress\n\n✨ **This portfolio itself** showcases his frontend skills with smooth animations and responsive design!`,
      context: { intent: "frontend", showcase: "portfolio" },
    }),
    
    contact: () => ({
      response: `You can reach Vamsi at:\n\n🔗 **GitHub**: [github.com/vamsi-1234](https://github.com/vamsi-1234)\n🔗 **LinkedIn**: [Connect with Vamsi](https://linkedin.com/in/vamsi-krishna-vissapragada-801602171)\n\n💡 He's open to discussing interesting opportunities and collaborations!`,
      context: { intent: "contact", available: true },
    }),
    
    general: () => ({
      response: `That's a great question! I'm Vamsi's AI assistant with access to his complete professional profile.\n\nI can tell you about:\n• **Skills** - Technical expertise and tools\n• **Experience** - Work history and achievements\n• **Projects** - Notable work and impact\n• **Performance** - Optimization techniques (with live demos!)\n\nWhat interests you most?`,
      context: { intent: "general", suggestedTopics: ["skills", "experience", "projects"] },
    }),
  };

  const generator = responses[intent] || responses.general;
  return generator();
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();
    
    // Simulate processing time for realism
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));
    
    const intent = classifyIntent(message);
    const { response, context } = generateResponse(intent, message);
    
    return NextResponse.json({
      success: true,
      response,
      metadata: {
        intent,
        context,
        model: "mcp-assistant-v1",
        timestamp: new Date().toISOString(),
        processingTime: Math.round(300 + Math.random() * 500),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
