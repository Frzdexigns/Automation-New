import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import Home from './pages/Home';
import ProductView from './pages/ProductView';
import CheckoutInformation from './pages/checkout/CheckoutInformation';
import CheckoutOverview from './pages/checkout/CheckoutOverview';
import CheckoutComplete from './pages/checkout/CheckoutComplete';
import Admin from './pages/Admin';

const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AuthListener = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  useEffect(() => {
    if (isAuthenticated && location.pathname === '/login') {
      navigate('/', { replace: true });
    } else if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);
  
  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthListener />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/product/:id" 
            element={
              <ProtectedRoute>
                <ProductView />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/checkout/information" 
            element={
              <ProtectedRoute>
                <CheckoutInformation />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/checkout/overview" 
            element={
              <ProtectedRoute>
                <CheckoutOverview />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/checkout/complete" 
            element={
              <ProtectedRoute>
                <CheckoutComplete />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;