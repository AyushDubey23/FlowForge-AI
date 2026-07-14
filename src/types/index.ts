import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  activeWorkspaceId: string;
}

export type UserRole = "owner" | "admin" | "member";

export interface WorkspaceMember {
  role: UserRole;
  invitedAt: Timestamp | Date;
  joinedAt: Timestamp | Date;
  email?: string;
}

export interface WorkspaceApiKey {
  name: string;
  prefix: string;
  hash: string;
  createdAt: Timestamp | Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  members: {
    [userId: string]: WorkspaceMember;
  };
  apiKeys?: WorkspaceApiKey[];
  tier?: "free" | "pro";
  subscriptionStatus?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface WorkflowNode {
  id: string;
  type: string; // 'webhook' | 'http' | 'aiPrompt' | 'condition' | 'loop' | 'delay' | 'email' | 'firestore' | 'storage' | 'notification' | 'js' | 'manual' | 'timer'
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  activeVersionId: string | null;
  latestVersionNumber: number;
  isActive: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface WorkflowVersion {
  id: string;
  versionNumber: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdBy: string;
  description: string;
  isPublished: boolean;
  createdAt: Timestamp | Date;
}

export interface ExecutionLog {
  timestamp: Timestamp | Date;
  nodeId?: string;
  level: "info" | "warn" | "error";
  message: string;
}

export interface ExecutionError {
  nodeId?: string;
  message: string;
  stack?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  versionId: string;
  status: "success" | "running" | "failed" | "cancelled";
  startTime: Timestamp | Date;
  endTime: Timestamp | Date | null;
  durationMs: number | null;
  triggerType: string;
  logs: ExecutionLog[];
  error: ExecutionError | null;
}

export interface Activity {
  id: string;
  workspaceId: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhotoURL: string | null;
  action: string; // e.g. 'workflow_created', 'workflow_deleted', 'version_published', 'member_joined'
  targetId: string;
  targetName: string;
  targetType: "workflow" | "version" | "workspace" | "member";
  createdAt: Timestamp | Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  downloadsCount: number;
  author: string;
  isFeatured: boolean;
  createdAt: Timestamp | Date;
}
