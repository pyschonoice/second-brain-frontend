// src/components/layout/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { twMerge } from 'tailwind-merge';
import { LightIcon } from '../icons/LightIcon';
import { DarkIcon } from '../icons/DarkIcon';

interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onFilterChange: (type: 'all' | 'link' | 'image' | 'video' | 'text') => void;
  currentFilter: 'all' | 'link' | 'image' | 'video' | 'text';
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleDarkMode, onFilterChange, currentFilter }) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Links', value: 'link' },
    { label: 'Images', value: 'image' },
    { label: 'Videos', value: 'video' },
    { label: 'Text', value: 'text' },
  ];

  return (
    <nav className="bg-sidebar text-sidebar-foreground p-4 shadow-sm border-b border-sidebar-border">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        {/* Logo/App Title */}
        <Link to="/" className="text-2xl font-bold text-purple-500  ">
          Second Brain
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden text-sidebar-foreground focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Desktop & Mobile Menu */}
        <div
          className={twMerge(
            "w-full lg:flex lg:items-center lg:w-auto transition-all duration-300 ease-in-out overflow-hidden",
            isMobileMenuOpen ? "max-h-screen opacity-100 mt-4 lg:mt-0" : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"
          )}
        >
          <div className="text-lg lg:flex-grow lg:flex lg:items-center lg:gap-6 flex flex-col lg:flex-row space-y-2 lg:space-y-0">
            {/* Filter/Sorting Options */}
            <div className="flex flex-wrap gap-2 lg:gap-3 mt-4 lg:mt-0">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={currentFilter === option.value ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onFilterChange(option.value as 'all' | 'link' | 'image' | 'video' | 'text');
                    setIsMobileMenuOpen(false); // Close menu on selection
                  }}
                  className="w-full lg:w-auto"
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* User Info and Actions */}
            <div className="flex flex-col lg:flex-row items-center gap-4 mt-4 lg:mt-0 lg:ml-auto">
              {user && (
                <span className="text-sidebar-foreground text-base">
                  Hello, {user.username}!
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
                className="w-full lg:w-auto"
              >
                {isDarkMode ? <LightIcon/> : <DarkIcon/>}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={logout}
                className="w-full lg:w-auto"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};