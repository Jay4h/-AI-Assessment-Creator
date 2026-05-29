"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "@vedaai/websocket";
import { generationStatusStore } from "@/lib/stores/generation-status-store";
import { getClientApiUrl } from "@/lib/api/config";
import type { GenerationProgressEvent } from "@vedaai/types";

interface Props {
  assignmentId: string;
  onConnected?: () => void;
  onConnectionFailed?: () => void;
}

export function GenerationStatusSubscriber({
  assignmentId,
  onConnected,
  onConnectionFailed,
}: Props) {
  useEffect(() => {
    const apiUrl = getClientApiUrl();
    const socket = io(apiUrl, {
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      onConnected?.();
      socket.emit("assignment:subscribe", assignmentId);
    });

    socket.on(SOCKET_EVENTS.status, (event: GenerationProgressEvent) => {
      if (event.assignmentId !== assignmentId) return;
      generationStatusStore.getState().setStatus(event);
    });

    socket.on("connect_error", (err) => {
      console.warn("[socket] connect error", err.message);
      onConnectionFailed?.();
    });

    const connectTimeout = window.setTimeout(() => {
      if (!socket.connected) {
        onConnectionFailed?.();
      }
    }, 8_000);

    return () => {
      window.clearTimeout(connectTimeout);
      socket.disconnect();
      generationStatusStore.getState().clearStatus(assignmentId);
    };
  }, [assignmentId, onConnected, onConnectionFailed]);

  return null;
}
