import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import SharedBrainPage from "./pages/SharedBrain/SharedBrainPage";

import { AuthProvider } from "./hooks/useAuth";

function App() {
  return (
    <Router>
      {}
      <AuthProvider>
        <div className="min-h-screen font-sans bg-background text-foreground transition-colors duration-200">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {}
            <Route path="/shared/:hash" element={<SharedBrainPage />} />

            {}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
