import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

import { Provider } from "react-redux";
import { store } from "./store";

// import { QueryClientProvider } from "@tanstack/react-query";
// import { persistQueryClient, PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, localStoragePersister } from "./query";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{
            persister: localStoragePersister,
          }}
        >
          <App />
        </PersistQueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
