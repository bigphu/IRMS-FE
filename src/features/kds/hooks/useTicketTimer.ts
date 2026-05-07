// src/features/kds/hooks/useTicketTimer.ts
import { useState, useEffect } from "react";

export const useTicketTimer = (createdAt: string, orderStatus?: string) => {
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const shouldStop = orderStatus === "READY" || orderStatus === "COMPLETED";

  useEffect(() => {
    if (shouldStop) {
      return;
    }

    const updateTimer = () => {
      const diffInSeconds = Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000);
      const minutes = Math.floor(diffInSeconds / 60);
      const seconds = diffInSeconds % 60;
      
      setElapsedTime(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
      setElapsedMinutes(minutes);
    };

    // Run immediately, then every second
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [createdAt, shouldStop]);

  return { elapsedTime, elapsedMinutes };
};