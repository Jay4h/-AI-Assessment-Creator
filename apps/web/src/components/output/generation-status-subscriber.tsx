"use client";

/** Subscribes to Socket.IO generation events for one assignment (client-only). */

import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "@vedaai/websocket";
import { generationStatusStore } from "@/lib/stores/generation-status-store";
import type { GenerationProgressEvent } from "@vedaai/types";

interface Props {
  assignmentId: string;
}

export function GenerationStatusSubscriber({ assignmentId }: Props) {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";
    const socket = io(apiUrl, {
      transports: ["polling", "websocket"], // polling first for Render free tier
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
