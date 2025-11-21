// components/PayPalProvider.tsx
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const paypalOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: "EUR",
  intent: "capture",
};

export const PayPalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
};