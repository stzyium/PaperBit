export type LinkCondition = "clear" | "degraded" | "constrained";

export interface MeshNode {
  id: string;
  label: string;
  hops: number;
  online: boolean;
}

export type ActivityKind =
  | "message"
  | "voice"
  | "broadcast"
  | "sos"
  | "system";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  summary: string;
  timestamp: number;
}

export interface MeshState {
  internetAvailable: boolean;
  meshActive: boolean;
  linkCondition: LinkCondition;
  nodes: MeshNode[];
  activity: ActivityEntry[];
}
