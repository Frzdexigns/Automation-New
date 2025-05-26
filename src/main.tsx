import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './api/supabaseClient.ts';

const { data, error } = await supabase.auth.signInWithPassword({
  email: "sgyimah2002@yahoo.com",
  password: "Luvyadee@04",
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);