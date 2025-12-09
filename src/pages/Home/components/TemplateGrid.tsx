// components/TemplateGrid.jsx
import React, { useState, useMemo } from "react";
import TemplateCard from "./TemplateCard";
import { TemplateModal } from "./TemplateModal";
import { AddCardButton } from "./AddCardButton";

export default function TemplateGrid({ items }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (template: any) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  // Générer un pattern aléatoire mais stable pour les cartes paysage
  // Utilise l'ID du template comme seed pour la cohérence
  const landscapePattern = useMemo(() => {
    const pattern: { [key: string]: boolean } = {};
    
    items.forEach((item: any, index: number) => {
      // Créer un seed basé sur l'ID du template
      const seed = item.id.toString().split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      
      // Environ 25-30% des cartes seront en paysage
      // Mais pas plus de 2 paysages consécutifs
      const previousWasLandscape = index > 0 && pattern[items[index - 1].id];
      const beforePreviousWasLandscape = index > 1 && pattern[items[index - 2].id];
      
      // Si les 2 précédentes étaient en paysage, forcer portrait
      if (previousWasLandscape && beforePreviousWasLandscape) {
        pattern[item.id] = false;
      } else {
        // Sinon, utiliser le seed pour décider (30% de chance)
        pattern[item.id] = (seed % 10) < 3;
      }
    });
    
    return pattern;
  }, [items]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 py-4 auto-rows-auto">
        {/* Bouton Ajouter une carte en premier */}
        <AddCardButton />
        
        {/* Templates existants avec layout dynamique */}
        {items.map((item: any) => {
          const isLandscape = landscapePattern[item.id];
          
          return (
            <div
              key={item.id}
              className={`${
                isLandscape 
                  ? 'col-span-2 sm:col-span-2 lg:col-span-2 xl:col-span-2' 
                  : 'col-span-1'
              }`}
            >
              <TemplateCard 
                template={item}
                onClick={() => handleCardClick(item)}
                isLandscape={isLandscape}
              />
            </div>
          );
        })}
      </div>

      <TemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        template={selectedTemplate}
        allTemplates={items}
      />
    </>
  );
}
