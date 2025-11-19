import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";

interface PayPalButtonProps {
  amount: string;
  planName: string;
  onSuccess: (details: any) => void;
  onError: (error: string) => void;
}

export const PayPalButton = ({
  amount,
  planName,
  onSuccess,
  onError,
}: PayPalButtonProps) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [isProcessing, setIsProcessing] = useState(false);

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: `Abonnement: ${planName}`,
          amount: {
            value: amount.replace("€", ""),
            currency_code: "EUR",
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    try {
      const details = await actions.order.capture();
      onSuccess(details);
    } catch (error) {
      onError("Erreur lors du traitement du paiement");
    } finally {
      setIsProcessing(false);
    }
  };

  const onPayPalError = (err: any) => {
    onError("Erreur lors de l'initialisation du paiement PayPal");
  };

  if (isPending || isProcessing) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">
          {isProcessing
            ? "Traitement du paiement..."
            : "Chargement de PayPal..."}
        </span>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "rect",
        color: "blue",
        label: "pay",
      }}
      createOrder={createOrder}
      onApprove={onApprove}
      onError={onPayPalError}
    />
  );
};
