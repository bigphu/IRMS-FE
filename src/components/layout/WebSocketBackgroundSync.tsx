import { useEffect, useState } from "react";
import { StompSessionProvider } from "react-stomp-hooks";
import { getWsTicket } from "../../api/kds"; 
import { KdsListener } from "../../features/kds/KdsListener";

const WEBSOCKET_URL = "ws://localhost:8080/ws-native";

export const WebSocketBackgroundSync = () => {
  const [ticket, setTicket] = useState<string | null>(null);

  useEffect(() => {
    // 1. Fetch the ticket silently in the background
    getWsTicket()
      .then((newTicket) => setTicket(newTicket))
      .catch((err) => console.error("Failed to fetch WS ticket", err));
  }, []);

  // 2. Return null while waiting. 
  // Because this component no longer wraps the app, this won't cause a blank screen!
  if (!ticket) {
    return null; 
  }

  // 3. Once we have the ticket, boot up STOMP and the Listener
  return (
    <StompSessionProvider
      url={WEBSOCKET_URL}
      connectHeaders={{
        ticket: ticket 
      }}
    >
      <KdsListener />
    </StompSessionProvider>
  );
};