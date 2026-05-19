import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Service worker for offline support. On a waiting update we DON'T auto-reload —
// App.jsx shows a banner and calls window.__gsdUpdateSW() when the user confirms.
async function setupSW() {
  try {
    const { registerSW } = await import("virtual:pwa-register");
    const updateSW = registerSW({
      onNeedRefresh() {
        window.__gsdUpdateSW = () => updateSW(true); // reload into the new version
        window.dispatchEvent(new Event("gsd:sw-need-refresh"));
      },
      onOfflineReady() {
        window.dispatchEvent(new Event("gsd:sw-offline-ready"));
      },
    });
  } catch (e) {
    console.warn("SW registration skipped:", e?.message);
  }
}
setupSW();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
