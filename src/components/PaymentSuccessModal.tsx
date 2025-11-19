import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, Mail, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
  };
}

export const PaymentSuccessModal = ({
  isOpen,
  onClose,
  selectedPlan,
}: PaymentSuccessModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleContinue = () => {
    onClose();
    navigate("/designs");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Paiement réussi !
          </CardTitle>

          <p className="text-gray-600 mb-2">
            Votre abonnement{" "}
            <span className="font-semibold">{selectedPlan.name}</span> a été
            activé avec succès.
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Un email de confirmation a été envoyé à votre adresse.
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleContinue}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-lg font-medium"
            >
              Commencer à créer
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 h-10">
                <Download className="h-4 w-4 mr-2" />
                Facture
              </Button>
              <Button variant="outline" className="flex-1 h-10">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              🎉 Bienvenue dans la famille Everblue ! Vous avez maintenant accès
              à tous les modèles {selectedPlan.name.toLowerCase()}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
