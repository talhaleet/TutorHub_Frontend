// main.jsx — add Toaster import and component
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast"; // ADD THIS
import App from "./App.jsx";
import "./index.css";
const queryClient = new QueryClient({
 defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
});
ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
 <QueryClientProvider client={queryClient}>
 <Toaster
 position="top-right"
 toastOptions={{
 duration: 4000,
 style: {
 fontFamily: "Inter, system-ui, sans-serif",
 fontSize: "14px",
 },
 success: { iconTheme: { primary: "#22C55E", secondary: "#fff" } },
 error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
 }}
 />
 <App />
 </QueryClientProvider>
 </React.StrictMode>
);