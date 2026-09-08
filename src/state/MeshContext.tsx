import React, { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { ActivityEntry, ActivityKind, LinkCondition, MeshNode, MeshState } from "../types/mesh";

const initialNodes: MeshNode[] = [
  { id: "n1", label: "Node A", hops: 1, online: true },
  { id: "n2", label: "Node B", hops: 1, online: true },
  { id: "n3", label: "Node C", hops: 2, online: true },
  { id: "n4", label: "Node D", hops: 3, online: true },
];

const initialState: MeshState = {
  internetAvailable: false,
  meshActive: true,
  linkCondition: "clear",
  nodes: initialNodes,
  activity: [
    { id: "a0", kind: "system", summary: "Mesh formed with 4 nodes", timestamp: Date.now() - 1000 * 60 * 12 },
  ],
};

type Action =
  | { type: "SET_LINK_CONDITION"; condition: LinkCondition }
  | { type: "LOG_ACTIVITY"; kind: ActivityKind; summary: string };

function reducer(state: MeshState, action: Action): MeshState {
  switch (action.type) {
    case "SET_LINK_CONDITION":
      return { ...state, linkCondition: action.condition };
    case "LOG_ACTIVITY": {
      const entry: ActivityEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        kind: action.kind,
        summary: action.summary,
        timestamp: Date.now(),
      };
      return { ...state, activity: [entry, ...state.activity].slice(0, 50) };
    }
    default:
      return state;
  }
}

interface MeshContextValue {
  state: MeshState;
  setLinkCondition: (condition: LinkCondition) => void;
  logActivity: (kind: ActivityKind, summary: string) => void;
  sendBroadcast: (message: string) => void;
  sendSOS: () => void;
}

const MeshContext = createContext<MeshContextValue | undefined>(undefined);

export function MeshProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLinkCondition = useCallback((condition: LinkCondition) => {
    dispatch({ type: "SET_LINK_CONDITION", condition });
  }, []);

  const logActivity = useCallback((kind: ActivityKind, summary: string) => {
    dispatch({ type: "LOG_ACTIVITY", kind, summary });
  }, []);

  const sendBroadcast = useCallback(
    (message: string) => {
      const onlineCount = state.nodes.filter((n) => n.online).length;
      logActivity("broadcast", `Broadcast sent to ${onlineCount} nodes: "${message}"`);
    },
    [state.nodes, logActivity]
  );

  const sendSOS = useCallback(() => {
    logActivity("sos", "SOS alert sent to all reachable nodes");
  }, [logActivity]);

  const value = useMemo(
    () => ({ state, setLinkCondition, logActivity, sendBroadcast, sendSOS }),
    [state, setLinkCondition, logActivity, sendBroadcast, sendSOS]
  );

  return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>;
}

export function useMesh() {
  const ctx = useContext(MeshContext);
  if (!ctx) throw new Error("useMesh must be used within a MeshProvider");
  return ctx;
}
