import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    // Changed: bg-gray-50 -> bg-stone-50 (Warmer background)
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Changed: Blue icon -> Orange/Rose gradient icon */}
            <div className="bg-gradient-to-br from-orange-400 to-rose-400 p-2 rounded-xl shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 9.464a6 6 0 010-9 6 6 0 010 9L7 19.464a6 6 0 01-9 0 6 6 0 010-9l1.414-1.414" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">API Key Pocket</h1>
          </div>
          <a 
            href="https://github.com/google/genai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-stone-500 hover:text-orange-500 transition-colors hidden sm:block"
          >
            Powered by Gemini
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-stone-500">
          <p>내 브라우저에만 저장되는 안전한 API 키 주머니입니다.</p>
          <p className="mt-1">© 2025 API Key Pocket.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
