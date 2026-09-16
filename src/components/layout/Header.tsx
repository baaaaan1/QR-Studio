import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('qr_studio_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('qr_studio_theme', 'light');
    }
    document.getElementById('app-favicon')?.setAttribute('href', nextDark ? '/favicon.svg' : '/favicon-light.svg');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="neu-button flex h-10 w-10 items-center justify-center rounded-control">
            <img
              src={isDark ? '/favicon.svg' : '/favicon-light.svg'}
              alt="QR Studio logo"
              className="h-7 w-7 transition-transform group-hover:scale-110"
              draggable={false}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-text-main">
                QR Studio
              </span>
            </div>
            <span className="text-xs text-text-muted hidden sm:inline-block">
              QR Generator & Decoder
            </span>
          </div>
        </a>

        {/* Theme Toggle Only */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={toggleTheme}
            className="neu-button flex h-10 w-10 items-center justify-center rounded-control text-text-main hover:text-primary transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <Icon
              icon={isDark ? 'solar:sun-2-outline' : 'solar:moon-outline'}
              className={`h-5 w-5 transition-transform duration-300 ${
                isDark ? 'text-yellow-accent rotate-90' : 'text-primary rotate-0'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
