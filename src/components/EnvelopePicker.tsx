// Structure de base pour le sélecteur d'enveloppes
interface EnvelopePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEnvelope: (envelope: any) => void;
}

export default function EnvelopePicker({
  isOpen,
  onClose,
  onSelectEnvelope,
}: EnvelopePickerProps) {
  // Ici vous pourrez ajouter vos modèles d'enveloppes
  const envelopeStyles = [
    { id: "classic", name: "Classique", thumbnail: "✉️" },
    { id: "elegant", name: "Élégante", thumbnail: "💌" },
    { id: "modern", name: "Moderne", thumbnail: "📨" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Choisir une enveloppe</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {envelopeStyles.map((style) => (
              <Card
                key={style.id}
                className="cursor-pointer text-center p-4"
                onClick={() => onSelectEnvelope(style)}
              >
                <div className="text-4xl mb-2">{style.thumbnail}</div>
                <p className="font-medium">{style.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
