import Image from "next/image";
import { useState } from "react";

export default function Sources({
  sources,
  isLoading,
}: {
  sources: { name: string; url: string }[];
  isLoading: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-xl shadow-gray-900/5 max-lg:-order-1 lg:flex lg:w-full lg:max-w-[320px] lg:flex-col overflow-hidden">
      
      {/* Header with modern styling */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100/80 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              Sources
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {isLoading ? 'Loading...' : `${sources.length} references`}
            </p>
          </div>
        </div>
        
        {/* Expand/Collapse toggle for mobile */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100/80 transition-colors duration-200"
        >
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div className={`flex-1 transition-all duration-300 ${
        isExpanded || window?.innerWidth >= 1024 ? 'max-h-none' : 'max-h-0 overflow-hidden lg:max-h-none lg:overflow-visible'
      }`}>
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto lg:max-h-[600px] custom-scrollbar">
          {isLoading ? (
            <LoadingSkeleton />
          ) : sources.length > 0 ? (
            sources.map((source, index) => (
              <SourceCard source={source} key={source.url} index={index} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 6 }, (_, i) => (
      <div
        key={i}
        className="h-20 rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>
    ))}
  </>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>
    <h4 className="text-sm font-semibold text-gray-900 mb-1">No sources available</h4>
    <p className="text-xs text-gray-500">Sources will appear here when available</p>
  </div>
);

const SourceCard = ({ 
  source, 
  index 
}: { 
  source: { name: string; url: string }; 
  index: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract domain for display
  const domain = new URL(source.url).hostname.replace('www.', '');
  
  // Color variants for visual variety
  const colorVariants = [
    'from-blue-500/10 to-indigo-500/10 border-blue-200/50',
    'from-violet-500/10 to-purple-500/10 border-violet-200/50',
    'from-emerald-500/10 to-teal-500/10 border-emerald-200/50',
    'from-orange-500/10 to-red-500/10 border-orange-200/50',
    'from-cyan-500/10 to-blue-500/10 border-cyan-200/50',
    'from-pink-500/10 to-rose-500/10 border-pink-200/50',
  ];
  
  const cardColor = colorVariants[index % colorVariants.length];

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] ${
        isHovered ? 'z-10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cardColor} border p-4 shadow-sm hover:shadow-lg hover:shadow-gray-900/10 transition-all duration-300`}>
        
        {/* Subtle hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center gap-4">
          {/* Favicon with fallback */}
          <div className="flex-shrink-0 relative">
            {!imageError ? (
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-200/50 flex items-center justify-center overflow-hidden">
                <Image
                  unoptimized
                  src={`https://www.google.com/s2/favicons?domain=${source.url}&sz=128`}
                  alt={domain}
                  width={24}
                  height={24}
                  onError={() => setImageError(true)}
                  className="rounded-lg"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            )}
            
            {/* External link indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h6 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
              {source.name}
            </h6>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 truncate">
                {domain}
              </span>
              <div className="w-1 h-1 rounded-full bg-gray-300"></div>
              <span className="text-xs text-gray-400 flex-shrink-0">
                Reference
              </span>
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
};

// Add custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;