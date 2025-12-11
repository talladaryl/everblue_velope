import React from "react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Chargement...",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4 animate-in zoom-in duration-300">
        {/* Spinner animé */}
        <div className="relative">
          {/* Cercle extérieur */}
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border`}
          ></div>

          {/* Cercle animé */}
          <div
            className={`${sizeClasses[size]} rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute top-0 left-0 animate-spin`}
            style={{ animationDuration: "0.8s" }}
          ></div>

          {/* Point central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
        text-muted-foreground
        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          <p className="text-sm text-gray-500 mt-1">Veuillez patienter...</p>
        </div>
        {/* Barre de progression animée */}
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"
            style={{
              animation: "progress 2s ease-in-out infinite",
            }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% {
            width: 0%;
            opacity: 0.5;
          }
          50% {
            width: 70%;
            opacity: 1;
          }
          100% {
            width: 100%;
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
