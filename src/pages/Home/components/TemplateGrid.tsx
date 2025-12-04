// components/TemplateGrid.jsx
import React, { useState } from "react";
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

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 py-4">
        {/* Bouton Ajouter une carte en premier */}
        <AddCardButton />
        
        {/* Templates existants */}
        {items.map((item: any) => (
          <TemplateCard 
            key={item.id} 
            template={item}
            onClick={() => handleCardClick(item)}
          />
        ))}
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
