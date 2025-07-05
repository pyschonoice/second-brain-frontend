// Placeholder for NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link to="/" className="mt-8 text-accent-foreground hover:underline">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;