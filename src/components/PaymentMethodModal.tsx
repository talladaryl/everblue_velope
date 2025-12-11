import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import StripePayment from "./StripePayment";
import {
  X,
  CreditCard,
  Smartphone,
  QrCode,
  Shield,
  ArrowLeft,
} from "lucide-react";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
  };
  onPaymentMethodSelect: (method: string, details?: any) => void;
}

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  selectedPlan,
  onPaymentMethodSelect,
}: PaymentMethodModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  // Réinitialiser selectedMethod lorsque le modal est fermé
  useEffect(() => {
    if (!isOpen) {
      setSelectedMethod(null);
    }
  }, [isOpen]);

  // Effet pour charger le SDK PayPal
  useEffect(() => {
    if (selectedMethod === "paypal" && !window.paypal) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=test&currency=EUR`;
      // Remplacez 'test' par votre client ID et ajustez la devise
      script.addEventListener("load", () => {
        // Une fois le script chargé, nous initialisons les boutons
        if (window.paypal) {
          window.paypal
            .Buttons({
              createOrder: function (data, actions) {
                // Cette fonction doit appeler votre backend pour créer une commande
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: {
                        value: selectedPlan.price.replace("€", ""), // Supprimer le symbole € pour avoir le nombre
                      },
                    },
                  ],
                });
              },
              onApprove: function (data, actions) {
                // Cette fonction capture la transaction après approbation
                return actions.order.capture().then(function (details) {
                  // Ici, nous appelons onPaymentMethodSelect avec les détails
                  onPaymentMethodSelect("paypal", details);
                  onClose();
                });
              },
            })
            .render("#paypal-button-container");
        }
      });
      document.body.appendChild(script);
    }
  }, [selectedMethod, selectedPlan, onPaymentMethodSelect, onClose]);

  const paymentMethods = [
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: () => (
        <img
          src="https://www.mtn.com/wp-content/themes/mtn-2020/assets/images/mtn-logo.svg"
          alt="MTN"
          className="h-6 w-6"
        />
      ),
      description: "Paiement via votre compte MTN Mobile Money",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "orange",
      name: "Orange Money",
      icon: () => (
        <img
          src="https://www.orange.com/sites/all/themes/custom/orange/logo.svg"
          alt="Orange"
          className="h-6 w-6"
        />
      ),
      description: "Paiement via votre compte Orange Money",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: () => (
        <img
          src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
          alt="PayPal"
          className="h-6 w-6"
        />
      ),
      description: "Paiement sécurisé via PayPal",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "visa",
      name: "Carte Bancaire",
      icon: () => (
        <img
          src="https://www.visa.com/dam/VCOM/regional/ve/romania/blogs/hero-image/visa-logo-800x450.jpg"
          alt="Visa"
          className="h-6 w-6 object-cover"
        />
      ),
      description: "Paiement par carte Visa/Mastercard",
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (!isOpen) return null;

  const handleMethodSelect = (methodId: string) => {
    if (methodId === "paypal") {
      setSelectedMethod("paypal");
    } else {
      onPaymentMethodSelect(methodId);
      onClose();
    }
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 border-0 shadow-2xl">
        <CardHeader className="relative text-center pb-4">
          <Button
            variant="ghost"
            onClick={selectedMethod ? handleBack : onClose}
            className="absolute left-4 top-4 h-8 w-8 p-0"
          >
            {selectedMethod ? (
              <ArrowLeft className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
          <CardTitle className="text-2xl font-bold text-foreground">
            {selectedMethod === "paypal"
              ? "Paiement via PayPal"
              : "Choisissez votre moyen de paiement"}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Abonnement :{" "}
            <span className="font-semibold">{selectedPlan.name}</span> -{" "}
            {selectedPlan.price}
            {selectedPlan.period}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          {!selectedMethod ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`p-4 rounded-xl border-2 border hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group bg-gradient-to-br ${method.color} text-white`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <method.icon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{method.name}</h3>
                        <p className="text-white/80 text-sm mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Paiement 100% sécurisé et chiffré</span>
              </div>
            </>
          ) : selectedMethod === "paypal" ? (
            <div>
              <div id="paypal-button-container"></div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};
