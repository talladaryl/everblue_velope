import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CreditCard, Smartphone, Shield, ArrowLeft } from "lucide-react";
import { PayPalButton } from "./PayPalButton";
import { CreditCardPayment } from "./CreditCardPayment";
// import { StripeProvider } from "./StripeProvider";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    name: string;
    price: string;
    period: string;
  };
  onPaymentSuccess: (method: string, details: any) => void;
  onPaymentError: (method: string, error: string) => void;
}

const MtnLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-6" fill="currentColor">
    <path d="M20 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm35 0c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5zm-50 5h5V10h-5v10zm60 0h5V10h-5v10zM10 20h5V10h-5v10zm80 0h5V10h-5v10z"/>
  </svg>
);

const OrangeLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-6" fill="currentColor">
    <circle cx="15" cy="15" r="10" fill="#FF6600"/>
    <path d="M35 8h30v14H35V8zm5 5h20v4H40v-4zm0 6h20v4H40v-4z" fill="#FF6600"/>
  </svg>
);

const PayPalLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-6" fill="currentColor">
    <path d="M80 8c-2.8 0-5 2.2-5 5v4h-2c-1.1 0-2 0.9-2 2v6c0 1.1 0.9 2 2 2h7c1.1 0 2-0.9 2-2V13c0-2.8-2.2-5-5-5zm-60 0c-2.8 0-5 2.2-5 5v9c0 1.1 0.9 2 2 2h5v-5c0-1.1 0.9-2 2-2h4c2.8 0 5-2.2 5-5s-2.2-5-5-5H20zm45 5c0-1.1 0.9-2 2-2h5c1.1 0 2 0.9 2 2v9c0 1.1-0.9 2-2 2h-5c-1.1 0-2-0.9-2-2V13z"/>
  </svg>
);

const VisaLogo = () => (
  <svg viewBox="0 0 100 30" className="h-6 w-6" fill="currentColor">
    <path d="M40 8h20v14H40V8zm-25 0h15v14H15V8zm45 0h25v14H60V8zM10 8h5v14h-5V8zm80 0h5v14h-5V8z" fill="#1A1F71"/>
    <path d="M30 15c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z" fill="#FAA41A"/>
  </svg>
);

export const PaymentMethodModal = ({
  isOpen,
  onClose,
  selectedPlan,
  onPaymentSuccess,
  onPaymentError,
}: PaymentMethodModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: "mtn",
      name: "MTN Mobile Money",
      icon: MtnLogo,
      description: "Paiement via votre compte MTN Mobile Money",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "orange",
      name: "Orange Money",
      icon: OrangeLogo,
      description: "Paiement via votre compte Orange Money",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: PayPalLogo,
      description: "Paiement sécurisé via PayPal",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "visa",
      name: "Carte Bancaire",
      icon: VisaLogo,
      description: "Paiement par carte Visa/Mastercard",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const extractAmount = (price: string): number => {
    const numericValue = price.replace(/[^\d,.]/g, '').replace(',', '.');
    return parseFloat(numericValue) || 0;
  };

  const handlePaymentSuccess = (details: any) => {
    onPaymentSuccess(selectedMethod!, details);
    onClose();
  };

  const handlePaymentError = (error: string) => {
    onPaymentError(selectedMethod!, error);
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  if (!isOpen) return null;

//   return (
//     <StripeProvider>
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//         <Card className="w-full max-w-2xl mx-4 border-0 shadow-2xl">
//           <CardHeader className="relative text-center pb-4">
//             <Button
//               variant="ghost"
//               onClick={selectedMethod ? handleBack : onClose}
//               className="absolute left-4 top-4 h-8 w-8 p-0"
//             >
//               {selectedMethod ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
//             </Button>
//             <CardTitle className="text-2xl font-bold text-gray-900">
//               {selectedMethod ? `Paiement ${selectedMethod}` : "Choisissez votre moyen de paiement"}
//             </CardTitle>
//             <p className="text-gray-600 mt-2">
//               Abonnement :{" "}
//               <span className="font-semibold">{selectedPlan.name}</span> -{" "}
//               {selectedPlan.price}
//               {selectedPlan.period}
//             </p>
//           </CardHeader>

//           <CardContent className="p-6">
//             {!selectedMethod ? (
//               <>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                   {paymentMethods.map((method) => (
//                     <button
//                       key={method.id}
//                       onClick={() => setSelectedMethod(method.id)}
//                       className={`p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left group bg-gradient-to-br ${method.color} text-white`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
//                           <method.icon />
//                         </div>
//                         <div>
//                           <h3 className="font-semibold text-lg">{method.name}</h3>
//                           <p className="text-white/80 text-sm mt-1">
//                             {method.description}
//                           </p>
//                         </div>
//                       </div>
//                     </button>
//                   ))}
//                 </div>

//                 <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//                   <Shield className="h-4 w-4" />
//                   <span>Paiement 100% sécurisé et chiffré</span>
//                 </div>
//               </>
//             ) : selectedMethod === "paypal" ? (
//               <div className="space-y-4">
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <PayPalButton
//                     amount={selectedPlan.price}
//                     planName={selectedPlan.name}
//                     onSuccess={handlePaymentSuccess}
//                     onError={handlePaymentError}
//                   />
//                 </div>
//                 <p className="text-sm text-gray-600 text-center">
//                   Vous serez redirigé vers PayPal pour compléter votre paiement
//                 </p>
//               </div>
//             ) : selectedMethod === "visa" ? (
//               <div className="space-y-4">
//                 <CreditCardPayment
//                   amount={extractAmount(selectedPlan.price)}
//                   planName={selectedPlan.name}
//                   onSuccess={handlePaymentSuccess}
//                   onError={handlePaymentError}
//                 />
//               </div>
//             ) : (
//               <div className="text-center p-8">
//                 <p className="text-gray-600">
//                   Intégration {selectedMethod} en cours de développement...
//                 </p>
//                 <Button onClick={handleBack} className="mt-4">
//                   Retour
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </StripeProvider>
//   );
};