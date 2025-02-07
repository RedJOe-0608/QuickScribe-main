import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;