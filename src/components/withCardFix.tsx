// components/withCardFix.tsx
import React from 'react';

export function withCardFix(WrappedComponent: React.ComponentType<any>) {
  return function FixedCardWrapper(props: any) {
    // Style FORCÉ du conteneur - TRANSPARENT et BORDS CARRÉS
    const containerStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: 'transparent', // IMPORTANT: transparent
      borderRadius: '0px',           // IMPORTANT: bords carrés
      padding: '0',
      margin: '0',
      border: 'none',
      boxShadow: 'none',
      overflow: 'hidden',
      position: 'relative' as const,
    };

    // Passez le style forcé au composant enfant
    return (
      <div style={containerStyle}>
        <WrappedComponent 
          {...props}
          containerStyle={containerStyle}
          forceNoBackground={true}
          forceSquareCorners={true}
          forceRemoveTextBackground={true}
        />
      </div>
    );
  };
}