import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { supabase } from "./api/supabaseClient.ts";

const authenticateUser = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "automationtest@codegem.co.uk",
      password: "codegemcouk",
    });

    if (error) {
      console.error("Authentication Error:", error.message);
    } else {
      console.log("User logged in:", data.user);
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
  }
};

// ✅ Call authentication before rendering
authenticateUser().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
