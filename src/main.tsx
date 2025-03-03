import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './api/supabaseClient.ts';

const { data, error } = await supabase.auth.signInWithPassword({
  email: "automationtest@codegem.co.uk",
  password: "codegemcouk",
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);