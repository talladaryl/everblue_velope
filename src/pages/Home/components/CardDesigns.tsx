import React from "react";

interface CardDesignProps {
  type: string;
  colors: string[];
  scale?: number;
}

export const CardDesigns: React.FC<CardDesignProps> = ({ type, colors, scale = 1 }) => {
  const renderDesign = () => {
    switch (type) {
      case "birthday-split":
        return (
          <div className="w-full h-full flex">
            <div 
              className="w-1/2 flex items-center justify-center"
              style={{ backgroundColor: colors[0] }}
            >
              <img
                src="https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Birthday"
                className="w-full h-full object-cover"
              />
            </div>
            <div 
              className="w-1/2 flex flex-col items-center justify-center p-2"
              style={{ backgroundColor: colors[1] }}
            >
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Pacifico', cursive" }}>
                Joyeux
              </h2>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center" style={{ fontFamily: "'Pacifico', cursive" }}>
                Anniversaire
              </h1>
            </div>
          </div>
        );

      case "wedding-elegant":
        return (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative"
            style={{ backgroundColor: colors[2] }}
          >
            <div className="absolute top-3 left-3 right-3 bottom-3 sm:top-6 sm:left-6 sm:right-6 sm:bottom-6 border-2" style={{ borderColor: colors[0] }} />
            <h3 className="text-[10px] sm:text-sm lg:text-xl mb-1 sm:mb-3 text-center px-2" style={{ fontFamily: "'Great Vibes', cursive", color: colors[0] }}>
              Vous êtes invités au mariage de
            </h3>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-1 sm:mb-2" style={{ fontFamily: "'Playfair Display', serif", color: colors[0] }}>
              Jean & Marie
            </h1>
            <p className="text-[10px] sm:text-sm lg:text-lg mt-1 sm:mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors[0] }}>
              15 Juin 2024
            </p>
          </div>
        );

      case "baptism-collage":
        return (
          <div 
            className="w-full h-full p-2 sm:p-4 relative"
            style={{ backgroundColor: colors[1] }}
          >
            <div className="absolute top-6 left-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-6">
              <img src="https://images.pexels.com/photos/1648387/pexels-photo-1648387.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 right-4 w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-lg overflow-hidden shadow-lg transform rotate-12">
              <img src="https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-14 left-6 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-lg overflow-hidden shadow-lg transform rotate-3">
              <img src="https://images.pexels.com/photos/1648358/pexels-photo-1648358.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-10 right-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-12">
              <img src="https://images.pexels.com/photos/1648398/pexels-photo-1648398.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-5 lg:p-6 rounded-2xl shadow-xl text-center">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1" style={{ fontFamily: "'Quicksand', sans-serif", color: colors[0] }}>
                  Baptême
                </h2>
                <p className="text-sm sm:text-lg lg:text-xl" style={{ fontFamily: "'Quicksand', sans-serif", color: colors[2] }}>
                  de Lucas
                </p>
              </div>
            </div>
          </div>
        );







      case "anniversary-romantic":
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-3 sm:p-6 lg:p-8 relative"
            style={{ backgroundColor: colors[0] }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-5xl sm:text-7xl lg:text-9xl">❤️</div>
            </div>
            <div className="text-center z-10">
              <h3 className="text-xs sm:text-lg lg:text-2xl text-white mb-1 sm:mb-3" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Joyeux Anniversaire
              </h3>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                25 Ans
              </h1>
              <p className="text-[10px] sm:text-base lg:text-xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                d'Amour & de Bonheur
              </p>
            </div>
          </div>
        );



      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>Design non disponible</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      {renderDesign()}
    </div>
  );
};
