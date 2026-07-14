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

    // Call real Google Gemini API (3.1 Flash Lite structured output mode)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

    const systemInstruction = `
      You are the FlowForge AI Workflow Architect. Convert the user's request into a structured JSON workflow automation diagram.
      
      CRITICAL INSTRUCTION FOR COMPLEXITY:
      No matter how simple the user's prompt is, you MUST expand it into a comprehensive, professional-grade, multi-stage branching automation diagram. You should ALWAYS include helper verification, AI reasoning, conditional paths, error logging, and notifications.
      
      For every single request:
      1. Add a trigger node ("webhook", "manual", or "timer") at x: 80, y: 220.
      2. Add a JavaScript validation/sanitization node ("js") at x: 380, y: 220 to parse inputs.
      3. Add a condition node ("condition") at x: 680, y: 220 to inspect properties.
      4. Create TWO branching execution paths:
         - A "true" handle branch (representing normal/high priority processing):
           * Add an AI prompt processing node ("aiPrompt") at x: 980, y: 80.
           * Add an output reporting/alerting node ("notification" or "email") at x: 1280, y: 80.
           * Add a database tracking node ("firestore" or "storage") at x: 1580, y: 80.
         - A "false" handle branch (representing error handling/low priority processing):
           * Add a log recorder node ("firestore") at x: 980, y: 380.
           * Add a fallback notification or http task node ("email" or "http") at x: 1280, y: 380.
      
      This ensures a highly detailed, 7-to-9 node grid layout that visualizes beautiful professional design topologies.

      Valid node types are:
      - Triggers: "webhook", "manual", "timer"
      - Actions: "http", "aiPrompt", "email", "firestore", "storage", "notification", "js"
      - Logic: "condition", "loop", "delay"

      You MUST respond ONLY with a raw JSON object matching the following TypeScript interfaces:
      interface WorkflowNode {
        id: string; // e.g. "webhook_1", "js_1", "condition_1"
        type: string; // e.g. "webhook", "js", "condition"
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

    // Robustly extract the JSON object block from the response
    const cleanJsonResponse = (text: string): string => {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        return text.substring(start, end + 1);
      }
      return text;
    };

    const cleanedText = cleanJsonResponse(textResult);
    const parsed = JSON.parse(cleanedText);

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

function getMockWorkflow(prompt: string) {
  const p = prompt.toLowerCase();
  
  if (p.includes("github") || p.includes("discord") || p.includes("slack")) {
    return {
      nodes: [
        {
          id: "webhook_1",
          type: "webhook",
          position: { x: 80, y: 220 },
          data: {
            label: "Github Webhook Trigger",
            description: "Listens for repository issue open payload events.",
            webhookUrl: "https://api.flowforge.ai/v1/trigger/webhook_1",
            method: "POST",
          },
        },
        {
          id: "condition_1",
          type: "condition",
          position: { x: 380, y: 220 },
          data: {
            label: "Check Priority Severity",
            description: "Routes logic branches depending on issue labels.",
            variable: "issue.label",
            value: "critical",
          },
        },
        // True Path (Critical Issues)
        {
          id: "aiPrompt_1",
          type: "aiPrompt",
          position: { x: 680, y: 80 },
          data: {
            label: "Gemini Critical Summarizer",
            description: "Distills critical issue details into bullet points.",
            prompt: "Summarize this issue body details:\n\n{{input.body.issue.body}}",
            temperature: 0.7,
          },
        },
        {
          id: "notification_1",
          type: "notification",
          position: { x: 980, y: 80 },
          data: {
            label: "Discord Critical Alert Channel",
            description: "Sends customized Discord card notifications.",
            message: "🚨 **CRITICAL GitHub Issue Alert:**\n{{input.aiPrompt_1.output}}",
          },
        },
        {
          id: "firestore_1",
          type: "firestore",
          position: { x: 1280, y: 80 },
          data: {
            label: "Firestore Incident Logger",
            description: "Logs critical incident entries inside the db tracker.",
            collection: "incidents",
            action: "write",
          },
        },
        // False Path (Routine Issues)
        {
          id: "email_1",
          type: "email",
          position: { x: 680, y: 380 },
          data: {
            label: "Auto-Acknowledgement Responder",
            description: "Sends standard support ticket replies to issue reporter.",
            to: "reporter@github.com",
            subject: "Thank you for reporting #{{input.body.issue.number}}",
            body: "Hello, we have received your issue report. Our team will review it shortly.",
          },
        },
        {
          id: "delay_1",
          type: "delay",
          position: { x: 980, y: 380 },
          data: {
            label: "Batch Processing Delay",
            description: "Delays next operations by 15 minutes.",
            seconds: 900,
          },
        },
        {
          id: "http_1",
          type: "http",
          position: { x: 1280, y: 380 },
          data: {
            label: "Linear Ticket Creator Task",
            description: "Pipes routine backlog items to Linear ticketing endpoints.",
            url: "https://api.linear.app/v1/issues",
            method: "POST",
          },
        },
      ],
      edges: [
        { id: "e1-2", source: "webhook_1", target: "condition_1" },
        // True branch links
        { id: "e2-3_true", source: "condition_1", target: "aiPrompt_1", sourceHandle: "true" },
        { id: "e3-4", source: "aiPrompt_1", target: "notification_1" },
        { id: "e4-5", source: "notification_1", target: "firestore_1" },
        // False branch links
        { id: "e2-6_false", source: "condition_1", target: "email_1", sourceHandle: "false" },
        { id: "e6-7", source: "email_1", target: "delay_1" },
        { id: "e7-8", source: "delay_1", target: "http_1" },
      ],
      explanation: "This workflow initiates when Github pushes an issue payload to our Webhook trigger. It routes high-severity incidents to be summarized by Gemini, alerted on Discord, and logged in Firestore. Standard tickets trigger an auto-reply and are queued into Linear after a short delay.",
    };
  }

  // Fallback default complex automation
  return {
    nodes: [
      {
        id: "manual_1",
        type: "manual",
        position: { x: 80, y: 220 },
        data: {
          label: "Manual Sandbox Run",
          description: "Initiates flow manually with custom test payloads.",
        },
      },
      {
        id: "js_1",
        type: "js",
        position: { x: 380, y: 220 },
        data: {
          label: "JS Payload Validator",
          description: "Sanitizes and normalizes input objects.",
          code: "const data = input.body;\nreturn {\n  valid: !!data.email,\n  email: data.email\n};",
        },
      },
      {
        id: "condition_2",
        type: "condition",
        position: { x: 680, y: 220 },
        data: {
          label: "Validation Gateway",
          description: "Filters validated user accounts.",
          variable: "valid",
          value: "true",
        },
      },
      // Valid path
      {
        id: "aiPrompt_2",
        type: "aiPrompt",
        position: { x: 980, y: 80 },
        data: {
          label: "Gemini Copilot Draft Generator",
          description: "Performs natural language copilot operations.",
          prompt: "Draft a personalized email for user:\n\n{{input.js_1.email}}",
          temperature: 0.75,
        },
      },
      {
        id: "email_2",
        type: "email",
        position: { x: 1280, y: 80 },
        data: {
          label: "User Onboarding Outbox",
          description: "Delivers welcome messages to the customer.",
          to: "{{input.js_1.email}}",
          subject: "Welcome to FlowForge AI!",
          body: "{{input.aiPrompt_2.output}}",
        },
      },
      // Invalid path
      {
        id: "firestore_2",
        type: "firestore",
        position: { x: 980, y: 360 },
        data: {
          label: "Firestore Error Logger",
          description: "Persists parsing failures.",
          collection: "errors",
          action: "write",
        },
      },
    ],
    edges: [
      { id: "e_m-js", source: "manual_1", target: "js_1" },
      { id: "e_js-cond", source: "js_1", target: "condition_2" },
      // Valid path links
      { id: "e_cond-ai_true", source: "condition_2", target: "aiPrompt_2", sourceHandle: "true" },
      { id: "e_ai-email", source: "aiPrompt_2", target: "email_2" },
      // Invalid path links
      { id: "e_cond-fs_false", source: "condition_2", target: "firestore_2", sourceHandle: "false" },
    ],
    explanation: "This workflow validates manually triggered payloads using custom JavaScript blocks. Validated users receive customized onboarding drafts compiled by Gemini via email, while failed payloads are logged to the Firestore database error tracker.",
  };
}
