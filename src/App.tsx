// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder for pages (will create them in next steps)
import SignIn from './pages/Auth/SignIn'; // Assuming this is your actual SignIn component path
import SignUp from './pages/Auth/SignUp'; // Assuming this is your actual SignUp component path
import Dashboard from './pages/Dashboard/Dashboard'; // Existing Dashboard component
import NotFound from './pages/NotFound'; // Simple 404 page
import ProtectedRoute from './components/ProtectedRoute'; // Your existing ProtectedRoute component
import SharedBrainPage from './pages/SharedBrain/SharedBrainPage'; // Import the new SharedBrainPage

// We'll put our AuthProvider here later or wrap the App
import { AuthProvider } from './hooks/useAuth'; // Your existing AuthProvider

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <Router>
      {/* AuthProvider will wrap routes that need auth context */}
      <AuthProvider>
        <div className="min-h-screen font-sans bg-background text-foreground transition-colors duration-200">

          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* New: Public route for shared content */}
            <Route path="/shared/:hash" element={<SharedBrainPage />} />
            
            {/* Protected Dashboard Route */}
            <Route
              path="/" // Dashboard is at the root path, as per your provided App.tsx
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;