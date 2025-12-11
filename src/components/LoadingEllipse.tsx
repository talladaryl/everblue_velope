import React from 'react';

interface LoadingEllipseProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LoadingEllipse: React.FC<LoadingEllipseProps> = ({
  size = 'md',
  message = 'Chargement...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Ellipse de fond */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        
        {/* Ellipse animée bleu */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 border-r-blue-600 rounded-full animate-ellipse-spin"></div>
        
        {/* Ellipse animée blanche (décalée) */}
        <div className="absolute inset-0 border-4 border-transparent border-b-white border-l-white rounded-full animate-ellipse-spin-reverse"></div>
      </div>
      
      {message && (
        <p className="mt-3 text-sm text-gray-600 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Composant overlay pour couvrir toute la page
export const LoadingOverlay: React.FC<LoadingEllipseProps> = (props) => {
  return (
    <div className="fixed inset-0 bg-white/80 loading-overlay flex items-center justify-center z-50">
      <LoadingEllipse {...props} />
    </div>
  );
};

// Hook pour gérer l'état de chargement
export const useLoading = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState('Chargement...');

  const startLoading = (message?: string) => {
    if (message) setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  };
};