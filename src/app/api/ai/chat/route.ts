import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, nodes, edges } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    const isMock = !apiKey || apiKey === "PLACEHOLDER_GEMINI_API_KEY";

    if (isMock) {
      // Returns dynamic mock explanation based on the canvas nodes
      const simulatedText = getSimulatedAssistantResponse(action, nodes, edges);
      return NextResponse.json({
        success: true,
        isMock: true,
        response: simulatedText,
      });
    }

    // Call real Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let promptText = "";
    if (action === "explain") {
      promptText = `Explain the purpose and operation of this workflow automation diagram.
      Nodes list: ${JSON.stringify(nodes)}
      Edges list: ${JSON.stringify(edges)}
      Write a clear, structured explanation with bullet points outlining what happens step by step.`;
    } else if (action === "optimize") {
      promptText = `Review this workflow and suggest optimizations or potential issues:
      Nodes: ${JSON.stringify(nodes)}
      Edges: ${JSON.stringify(edges)}
      Focus on connections, missing handles, logic branch safety, and execution timeouts.`;
    } else {
      promptText = `Suggest premium improvements or additions to this workflow builder:
      Nodes: ${JSON.stringify(nodes)}
      Edges: ${JSON.stringify(edges)}
      Suggest 2 or 3 additional node configurations that could extend this automation (e.g. adding error handling alert nodes).`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Gemini API error: ${text}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({
      success: true,
      isMock: false,
      response: resultText || "AI could not process your query.",
    });
  } catch (err: any) {
    console.error("AI Chat assistant API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Generate premium mock responses for recruiters testing without keys
function getSimulatedAssistantResponse(action: string, nodes: any[], edges: any[]): string {
  const nodeCount = nodes.length;
  if (nodeCount === 0) {
    return "Your workflow is currently empty. Add a Trigger node (like a **Webhook** or **Timer**) from the node palette on the left to begin.";
  }

  const nodeTypesList = nodes.map((n) => `**${n.data.label} (${n.type})**`).join(", ");

  if (action === "explain") {
    return `### Workflow Overview
This automation consists of ${nodeCount} node(s): ${nodeTypesList}.

Here is the step-by-step logic:
1. **Trigger Phase**: The flow is initiated by ${nodes[0]?.data?.label || "the start node"}.
2. **Action/Logic Processing**: 
${nodes
  .slice(1)
  .map(
    (n, index) =>
      `   * **Step ${index + 2}**: Pipes data to ${n.data.label || n.type}. (${n.data.description || "Processes inputs"})`
  )
  .join("\n")}
3. **Completion**: The final output payload is collected.

*Note: You are currently running in **Sandbox Mode**. Connect a Gemini API Key in your \`.env.local\` to get real-time dynamic AI explanations.*`;
  }

  if (action === "optimize") {
    const hasTrigger = nodes.some((n) => ["webhook", "manual", "timer"].includes(n.type));
    const isConnected = edges.length >= nodes.length - 1;

    return `### Canvas Optimization Analysis
I have reviewed your layout structure. Here are my suggestions:

${
  !hasTrigger
    ? "* ⚠️ **Missing Trigger**: I noticed you don't have a Trigger node. Add a **Webhook** or **Manual Trigger** as the entry point of your flow.\n"
    : "* 8 **Trigger Verified**: You have a trigger entry point configured.\n"
}
${
  !isConnected
    ? "* ⚠️ **Loose Nodes**: Some nodes on your canvas are not fully connected. Make sure to drag connections between output and input handles.\n"
    : "* 8 **Connection Topology Verified**: All nodes are correctly connected sequentially.\n"
}
* ⚡ **Performance Tip**: For HTTP requests, set custom connection timeouts (e.g. 5000ms) to prevent infinite loops if the external endpoint is slow.

*Connect your Gemini API Key in \`.env.local\` to enable real-time canvas diagnostic audits.*`;
  }

  return `### Suggested Improvements
To make this automation more resilient:
1. **Error Notification**: Attach a **Notification Alert** node connected to a Discord webhook to notify you if any HTTP requests fail.
2. **Log Store**: Add a **Firestore Write** action at the end to record details of successful executions for history analytics.
3. **Edge Timeout**: Insert a **Delay** logic card before actions to avoid hitting API rate limits.

*Connect a Gemini API Key in your environment variables to stream custom design pattern suggestions.*`;
}
