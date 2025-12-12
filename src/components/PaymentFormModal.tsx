import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Smartphone,
  CreditCard,
  User,
  Mail,
  Lock,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface PaymentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
  };
  paymentMethod: string;
  onPaymentSubmit: () => void;
}

export const PaymentFormModal = ({
  isOpen,
  onClose,
  selectedPlan,
  paymentMethod,
  onPaymentSubmit,
}: PaymentFormModalProps) => {
  const [formData, setFormData] = useState({
    phone: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de traitement de paiement
    setTimeout(() => {
      onPaymentSubmit();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  const renderForm = () => {
    switch (paymentMethod) {
      case "mtn":
      case "orange":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Numéro de téléphone
              </Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="6 XX XX XX XX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                💡 Vous recevrez une demande de confirmation sur votre téléphone
                pour finaliser le paiement.
              </p>
            </div>
          </div>
        );

      case "paypal":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email PayPal
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                🔒 Vous serez redirigé vers PayPal pour confirmer votre
                paiement.
              </p>
            </div>
          </div>
        );

      case "visa":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="cardNumber"
                className="text-sm font-medium text-gray-700"
              >
                Numéro de carte
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="expiry"
                  className="text-sm font-medium text-gray-700"
                >
                  Date d'expiration
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="expiry"
                    name="expiry"
                    type="text"
                    placeholder="MM/AA"
                    value={formData.expiry}
                    onChange={handleChange}
                    className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="cvv"
                  className="text-sm font-medium text-gray-700"
                >
                  CVV
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="cvv"
                    name="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={handleChange}
                    className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="cardName"
                className="text-sm font-medium text-gray-700"
              >
                Nom sur la carte
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="cardName"
                  name="cardName"
                  type="text"
                  placeholder="Nom & Prenoms"
                  value={formData.cardName}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getMethodName = () => {
    switch (paymentMethod) {
      case "mtn":
        return "MTN Mobile Money";
      case "orange":
        return "Orange Money";
      case "paypal":
        return "PayPal";
      case "visa":
        return "Carte Bancaire";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl">
        <CardHeader className="relative text-center pb-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-foreground">
            Paiement sécurisé
          </CardTitle>
          <div className="space-y-1">
            <p className="text-gray-600">
              <span className="font-semibold">{selectedPlan.name}</span> -{" "}
              {selectedPlan.price}
              {selectedPlan.period}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              {getMethodName()}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderForm()}

            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>Transactions sécurisées avec chiffrement SSL</span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-lg font-medium"
            >
              Payer {selectedPlan.price}
              {selectedPlan.period}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              En cliquant sur "Payer", vous acceptez nos conditions générales de
              vente et notre politique de confidentialité.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
