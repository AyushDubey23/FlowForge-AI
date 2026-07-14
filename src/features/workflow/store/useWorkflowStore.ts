import { create } from "zustand";
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";


interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  undoStack: Array<{ nodes: Node[]; edges: Edge[] }>;
  redoStack: Array<{ nodes: Node[]; edges: Edge[] }>;
  
  // Canvas operations
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Selection
  selectNode: (nodeId: string | null) => void;
  
  // History Actions
  pushToHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  // Custom Node Mutators
  addWorkflowNode: (type: string, position: { x: number; y: number }) => void;
  deleteWorkflowNode: (nodeId: string) => void;
  duplicateWorkflowNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  clearCanvas: () => void;
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void;
}

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Helper to deep clone nodes & edges to avoid mutation reference bugs
const cloneState = (nodes: Node[], edges: Edge[]) => {
  return {
    nodes: JSON.parse(JSON.stringify(nodes)),
    edges: JSON.parse(JSON.stringify(edges)),
  };
};

export const useWorkflowStore = create<CanvasState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  selectedNodeId: null,
  undoStack: [],
  redoStack: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  onConnect: (connection) => {
    get().pushToHistory();
    set((state) => ({
      edges: addEdge(connection, state.edges),
    }));
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  pushToHistory: () => {
    const { nodes, edges, undoStack } = get();
    const cloned = cloneState(nodes, edges);
    // Limit stack size to 50 for memory bounds
    const newStack = [...undoStack, cloned].slice(-50);
    set({
      undoStack: newStack,
      redoStack: [], // Clear redo when a new action occurs
    });
  },

  undo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (undoStack.length === 0) return;

    const currentCloned = cloneState(nodes, edges);
    const previous = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      undoStack: newUndoStack,
      redoStack: [...redoStack, currentCloned],
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { undoStack, redoStack, nodes, edges } = get();
    if (redoStack.length === 0) return;

    const currentCloned = cloneState(nodes, edges);
    const next = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);

    set({
      nodes: next.nodes,
      edges: next.edges,
      undoStack: [...undoStack, currentCloned],
      redoStack: newRedoStack,
      selectedNodeId: null,
    });
  },

  addWorkflowNode: (type, position) => {
    get().pushToHistory();
    const id = `${type}_${Math.random().toString(36).substring(2, 9)}`;
    const label = type
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    const newNode: Node = {
      id,
      type,
      position,
      data: {
        label,
        // Pre-initialize standard action parameters depending on Node Type
        description: "Configure this node settings.",
        ...(type === "webhook" && { webhookUrl: `https://api.flowforge.ai/v1/trigger/${id}`, method: "POST" }),
        ...(type === "http" && { url: "https://api.example.com/v1/data", method: "GET", headers: "{}", body: "{}" }),
        ...(type === "aiPrompt" && { prompt: "Summarize this issue details:", temperature: 0.7 }),
        ...(type === "email" && { to: "", subject: "Notification Alert", body: "" }),
        ...(type === "condition" && { expression: "input.status == 'open'" }),
        ...(type === "delay" && { delaySeconds: 60 }),
        ...(type === "js" && { code: "// Write custom JavaScript here\nreturn { success: true, data: input };" }),
      },
    };

    set((state) => ({
      nodes: [...state.nodes, newNode],
      selectedNodeId: id,
    }));
  },

  deleteWorkflowNode: (nodeId) => {
    get().pushToHistory();
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    }));
  },

  duplicateWorkflowNode: (nodeId) => {
    get().pushToHistory();
    const { nodes } = get();
    const sourceNode = nodes.find((node) => node.id === nodeId);
    if (!sourceNode) return;

    const id = `${sourceNode.type}_${Math.random().toString(36).substring(2, 9)}`;
    const duplicatedNode: Node = {
      ...JSON.parse(JSON.stringify(sourceNode)),
      id,
      position: {
        x: sourceNode.position.x + 40,
        y: sourceNode.position.y + 40,
      },
      selected: false,
    };

    set((state) => ({
      nodes: [...state.nodes, duplicatedNode],
      selectedNodeId: id,
    }));
  },

  updateNodeData: (nodeId, data) => {
    // Note: avoid pushing to history for every keypress. We'll do it on blur or slider release in the panel.
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    }));
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      undoStack: [],
      redoStack: [],
    });
  },

  loadWorkflow: (nodes, edges) => {
    set({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      selectedNodeId: null,
      undoStack: [],
      redoStack: [],
    });
  },
}));
