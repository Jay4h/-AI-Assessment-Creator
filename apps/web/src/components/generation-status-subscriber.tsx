"use client";

/**
 * Headless subscriber component that manages the Socket.IO lifecycle for a
 * single assignment.  Renders null; status updates flow into the
 * generationStatusStore (Zustand) so any sibling component can react without
 * prop-drilling.
 *
 * The single useEffect here is the only legitimate place in the codebase for
 * this pattern — it manages an imperative push-event subscription that
 * genuinely requires setup / teardown and cannot be replaced by a Server
 * Component or Server Action.
 */

import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "@vedaai/websocket";
import { generationStatusStore } from "@/lib/generation-status-store";
import type { GenerationProgressEvent } from "@vedaai/types";

interface Props {
  assignmentId: string;
}

export function GenerationStatusSubscriber({ assignmentId }: Props) {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";
    const socket = io(apiUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      socket.emit("assignment:subscribe", assignmentId);
    });

    socket.on(SOCKET_EVENTS.status, (event: GenerationProgressEvent) => {
      if (event.assignmentId !== assignmentId) return;
      generationStatusStore.getState().setStatus(event);
    });

    socket.on("connect_error", (err) => {
      console.warn("[socket] connect error", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [assignmentId]);

  return null;
}
