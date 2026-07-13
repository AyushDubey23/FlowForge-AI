import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Direct configuration check
    const isMock = !apiKey || apiKey === "PLACEHOLDER_GEMINI_API_KEY";

    if (isMock) {
      // Return a beautiful pre-generated mock workflow based on the instruction
      // This allows immediate testing by recruiters even if they haven't set up keys yet!
      const mockResult = getMockWorkflow(prompt);
      return NextResponse.json({
        success: true,
        isMock: true,
        ...mockResult,
      });
    }

    // Call real Google Gemini API (2.0 Flash structured output mode)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `
      You are the FlowForge AI Workflow Architect. Convert the user's request into a structured JSON workflow automation diagram.
      
      Valid node types are:
      - Triggers: "webhook", "manual", "timer"
      - Actions: "http", "aiPrompt", "email", "firestore", "storage", "notification", "js"
      - Logic: "condition", "loop", "delay"

      Generate coordinate positions sequentially, spacing them out visually:
      - Trigger: x: 100, y: 150
      - Action 1: x: 420, y: 150
      - Action 2: x: 740, y: 150
      If there is a condition node, branch the edges:
      - True path connects to target node (sourceHandle: "true")
      - False path connects to target node (sourceHandle: "false")

      You MUST respond ONLY with a raw JSON object matching the following TypeScript interfaces:
      interface WorkflowNode {
        id: string; // e.g. "webhook_1", "aiPrompt_1"
        type: string; // e.g. "webhook", "aiPrompt"
        position: { x: number; y: number };
        data: {
          label: string; // Display name
          description: string; // Short summary
          [key: string]: any; // Additional specific properties: prompt, url, method, to, subject, etc.
        };
      }
      interface WorkflowEdge {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string | null;
        targetHandle?: string | null;
      }
      interface WorkflowResponse {
        nodes: WorkflowNode[];
        edges: WorkflowEdge[];
        explanation: string; // A short description of how the workflow is set up
      }

      Do not wrap the JSON response in markdown code blocks (\`\`\`json). Just return the raw JSON string.
    `;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${errText}`);
    }

    const data = await response.json();
    const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textResult) {
      throw new Error("Empty response from AI engine.");
    }

    const parsed = JSON.parse(textResult);

    return NextResponse.json({
      success: true,
      isMock: false,
      nodes: parsed.nodes,
      edges: parsed.edges,
      explanation: parsed.explanation,
    });
  } catch (err: any) {
    console.error("AI Generation endpoint error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Sandbox mockup workflow dictionary
function getMockWorkflow(prompt: string) {
  const p = prompt.toLowerCase();
  
  if (p.includes("github") || p.includes("discord")) {
    return {
      nodes: [
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 100, y: 150 },
          data: {
            label: "Github Issue Opened Trigger",
            description: "Triggers on webhook calls when a new Github issue is opened.",
            webhookUrl: "https://api.flowforge.ai/v1/trigger/webhook_1",
            method: "POST",
          },
        },
        {
          id: "aiPrompt_1",
          type: "aiPrompt",
          position: { x: 420, y: 150 },
          data: {
            label: "Gemini Issue Summarizer",
            description: "Summarizes the Github issue description into bullet points.",
            prompt: "Summarize this issue body details:\n\n{{input.body.issue.body}}",
            temperature: 0.7,
          },
        },
        {
          id: "notification_1",
          type: "notification",
          position: { x: 740, y: 150 },
          data: {
            label: "Post to Discord Channel",
            description: "Sends summarized text card content directly to Discord webhook channel.",
            message: "📢 **New Github Issue Summary:**\n{{input.aiPrompt_1.output}}",
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "webhook_1", target: "aiPrompt_1" },
        { id: "e2-3", source: "aiPrompt_1", target: "notification_1" },
      ],
      explanation: "This workflow initiates when Github pushes an issue payload to our Webhook trigger. We pipe the payload through Gemini to summarize and format details, then deliver it instantly to Discord.",
    };
  }

  // Fallback default automation
  return {
    nodes: [
      {
        id: "manual_1",
        type: "manual",
        position: { x: 100, y: 150 },
        data: {
          label: "Manual Trigger Run",
          description: "Initiates flow manually using input test payload.",
        },
      },
      {
        id: "aiPrompt_2",
        type: "aiPrompt",
        position: { x: 420, y: 150 },
        data: {
          label: "Gemini Draft Copilot",
          description: "Performs natural language tasks on inputs.",
          prompt: "Suggest improvements to the following payload data:\n\n{{input.body}}",
          temperature: 0.75,
        },
      },
      {
        id: "email_2",
        type: "email",
        position: { x: 740, y: 150 },
        data: {
          label: "Email Summaries Outbox",
          description: "Sends customized email summary.",
          to: "user@domain.com",
          subject: "FlowForge AI Assistant Update",
          body: "Hello, here is your workflow suggestion:\n\n{{input.aiPrompt_2.output}}",
        },
      },
    ],
    edges: [
      { id: "e_m-ai", source: "manual_1", target: "aiPrompt_2" },
      { id: "e_ai-email", source: "aiPrompt_2", target: "email_2" },
    ],
    explanation: "This basic template lets you manually invoke a test run, compile summaries using Gemini, and receive notifications via email.",
  };
}
