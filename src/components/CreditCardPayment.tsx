// components/CreditCardPayment.tsx
"use client";
import { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, CreditCard } from "lucide-react";

interface CreditCardPaymentProps {
  amount: number;
  currency?: string;
  planName: string;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

export const CreditCardPayment = ({
  amount,
  currency = "eur",
  planName,
  onSuccess,
  onError,
}: CreditCardPaymentProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 12px",
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // Créer un PaymentMethod
      const cardNumber = elements.getElement(CardNumberElement);

      if (!cardNumber) {
        throw new Error("Élément carte non trouvé");
      }

      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Appeler votre API pour créer un PaymentIntent
      const response = await fetch("/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Conversion en cents
          currency,
          paymentMethodId: paymentMethod.id,
          planName,
        }),
      });

      const { clientSecret, error: intentError } = await response.json();

      if (intentError) {
        throw new Error(intentError);
      }

      // Confirmer le paiement
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent);
      }
    } catch (error) {
      console.error("Erreur de paiement:", error);
      onError(error instanceof Error ? error.message : "Erreur de paiement");
    } finally {
      setIsLoading(false);
    }
  };

  const allFieldsComplete =
    cardComplete.cardNumber && cardComplete.cardExpiry && cardComplete.cardCvc;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Numéro de carte */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Numéro de carte
          </label>
          <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
            <CardNumberElement
              options={cardElementOptions}
              onChange={(e) =>
                setCardComplete((prev) => ({
                  ...prev,
                  cardNumber: e.complete,
                }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date d'expiration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Expiration
            </label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CardExpiryElement
                options={cardElementOptions}
                onChange={(e) =>
                  setCardComplete((prev) => ({
                    ...prev,
                    cardExpiry: e.complete,
                  }))
                }
              />
            </div>
          </div>

          {/* CVC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CVC</label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <CardCvcElement
                options={cardElementOptions}
                onChange={(e) =>
                  setCardComplete((prev) => ({
                    ...prev,
                    cardCvc: e.complete,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Bouton de paiement */}
        <Button
          type="submit"
          disabled={!stripe || !allFieldsComplete || isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Traitement en cours...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Payer {amount}€
            </>
          )}
        </Button>

        {/* Sécurité */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Paiement sécurisé par Stripe</span>
        </div>

        {/* Logos des cartes acceptées */}
        <div className="flex justify-center space-x-4 pt-4">
          <div className="text-xs text-gray-400">Cartes acceptées:</div>
          <div className="flex space-x-2">
            <span className="text-blue-600 font-bold">Visa</span>
            <span className="text-red-600 font-bold">Mastercard</span>
            <span className="text-yellow-600 font-bold">CB</span>
          </div>
        </div>
      </form>
    </div>
  );
};
