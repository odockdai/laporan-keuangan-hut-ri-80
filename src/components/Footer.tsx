import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            &copy; 2025. Dibuat dengan{' '}
            <span className="text-red-500 dark:text-red-400">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;