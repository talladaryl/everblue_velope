import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  Clock,
  Sparkles,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { PaymentFormModal } from "@/components/PaymentFormModal";
import { PaymentSuccessModal } from "@/components/PaymentSuccessModal";

const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Parfait pour débuter",
    price: "Gratuit",
    period: "",
    features: [
      "5 modèles basiques",
      "Invitations illimitées",
      "Support par email",
      "Export standard",
      "Personnalisation limitée",
    ],
    missingFeatures: [
      "Modèles premium",
      "Support prioritaire",
      "Export HD",
      "Analytiques avancées",
      "Marque blanche",
    ],
    popular: false,
    buttonText: "Commencer gratuitement",
    buttonVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Professionnel",
    description: "Le plus populaire",
    price: "19",
    period: "€/mois",
    features: [
      "50+ modèles premium",
      "Invitations illimitées",
      "Support prioritaire",
      "Export HD",
      "Analytiques basiques",
      "Personnalisation complète",
      "Sans watermark",
    ],
    missingFeatures: [
      "Marque blanche",
      "Support dédié",
      "Formation personnalisée",
    ],
    popular: true,
    buttonText: "Souscrire maintenant",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Pour les professionnels",
    price: "49",
    period: "€/mois",
    features: [
      "200+ modèles exclusifs",
      "Invitations illimitées",
      "Support dédié 24/7",
      "Export 4K",
      "Analytiques avancées",
      "Personnalisation complète",
      "Marque blanche",
      "Formation personnalisée",
      "API d'intégration",
    ],
    missingFeatures: [],
    popular: false,
    buttonText: "Souscrire maintenant",
    buttonVariant: "outline" as const,
  },
];

const features = [
  {
    icon: Zap,
    title: "Création rapide",
    description: "Générez des invitations en quelques minutes",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Vos données sont protégées et chiffrées",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Travaillez en équipe sur vos designs",
  },
  {
    icon: Clock,
    title: "Support 24/7",
    description: "Notre équipe vous accompagne à tout moment",
  },
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentMethodOpen, setIsPaymentMethodOpen] = useState(false);
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [user, setUser] = useState(null);

  const calculateYearlyPrice = (monthlyPrice: string) => {
    if (monthlyPrice === "Gratuit") return "Gratuit";
    const price = parseInt(monthlyPrice);
    return Math.floor(price * 12 * 0.8).toString();
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  const handleSubscribe = (plan: any) => {
    if (plan.id === "starter") {
      // Pour l'offre gratuite, rediriger directement vers l'authentification
      setIsAuthOpen(true);
    } else {
      // Pour les offres payantes, ouvrir le modal de sélection de paiement
      setSelectedPlan(plan);
      setIsPaymentMethodOpen(true);
    }
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setIsPaymentMethodOpen(false);
    setIsPaymentFormOpen(true);
  };

  const handlePaymentSubmit = () => {
    setIsPaymentFormOpen(false);
    setIsPaymentSuccessOpen(true);
  };

  const getPlanPrice = (plan: any) => {
    if (billingPeriod === "yearly" && plan.price !== "Gratuit") {
      return {
        price: calculateYearlyPrice(plan.price),
        period: "€/an",
      };
    }
    return {
      price: plan.price,
      period: plan.period,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header onOpenLogin={() => setIsAuthOpen(true)} user={user} />

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Plans flexibles
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Des tarifs adaptés à
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                vos besoins
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos ambitions. De la création
              simple aux besoins professionnels, nous avons la solution
              parfaite.
            </p>

            <div className="flex items-center justify-center space-x-4 mb-16">
              <span
                className={`text-lg font-medium ${
                  billingPeriod === "monthly"
                    ? "text-gray-900"
                    : "text-gray-500"
                }`}
              >
                Mensuel
              </span>
              <button
                onClick={() =>
                  setBillingPeriod(
                    billingPeriod === "monthly" ? "yearly" : "monthly"
                  )
                }
                className="relative w-16 h-8 bg-blue-600 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                    billingPeriod === "monthly" ? "left-1" : "left-9"
                  }`}
                />
              </button>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-lg font-medium ${
                    billingPeriod === "yearly"
                      ? "text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Annuel
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  -20%
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => {
              const planPrice = getPlanPrice(plan);
              return (
                <Card
                  key={plan.id}
                  className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm">
                        <Star className="h-4 w-4 mr-2 fill-current" />
                        Le plus populaire
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{plan.description}</p>

                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {planPrice.price}
                        </span>
                        {plan.price !== "Gratuit" && (
                          <span className="text-gray-600 ml-2">
                            {planPrice.period}
                          </span>
                        )}
                      </div>
                      {billingPeriod === "yearly" &&
                        plan.price !== "Gratuit" && (
                          <p className="text-sm text-gray-500 mt-2">
                            Soit {plan.price}€ par mois
                          </p>
                        )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}

                      {plan.missingFeatures.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3 opacity-50"
                        >
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-gray-400" />
                          </div>
                          <span className="text-gray-500 text-sm line-through">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full h-12 text-lg font-semibold ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                          : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                      }`}
                      onClick={() => handleSubscribe(plan)}
                    >
                      {plan.buttonText}
                    </Button>

                    {plan.id === "starter" && (
                      <p className="text-center text-sm text-gray-500">
                        Aucune carte de crédit requise
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout inclus dans chaque forfait
            </h2>
            <p className="text-xl text-gray-600">
              Profitez de fonctionnalités premium quel que soit le plan choisi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-xl text-gray-600">
                Tout ce que vous devez savoir sur nos tarifs
              </p>
            </div>

            <div className="grid gap-8">
              {[
                {
                  question: "Puis-je changer de forfait à tout moment ?",
                  answer:
                    "Oui, vous pouvez améliorer ou réduire votre forfait à tout moment. Les changements prennent effet immédiatement.",
                },
                {
                  question: "Y a-t-il des frais cachés ?",
                  answer:
                    "Non, tous nos prix sont transparents. Vous payez uniquement le montant indiqué, sans frais supplémentaires.",
                },
                {
                  question: "Proposez-vous une garantie de remboursement ?",
                  answer:
                    "Oui, nous offrons une garantie satisfait ou remboursé de 30 jours sur tous nos forfaits payants.",
                },
                {
                  question: "Puis-je utiliser Everblue pour mon entreprise ?",
                  answer:
                    "Absolument ! Notre forfait Enterprise est spécialement conçu pour les besoins professionnels avec des fonctionnalités dédiées.",
                },
              ].map((faq, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <CardContent className="p-12">
                  <h3 className="text-3xl font-bold mb-4">
                    Prêt à créer des invitations exceptionnelles ?
                  </h3>
                  <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
                    Rejoignez des milliers de clients satisfaits et transformez
                    vos événements dès aujourd'hui.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3"
                      onClick={() => setIsAuthOpen(true)}
                    >
                      Commencer gratuitement
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                    >
                      Voir une démo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <PaymentMethodModal
        isOpen={isPaymentMethodOpen}
        onClose={() => setIsPaymentMethodOpen(false)}
        selectedPlan={selectedPlan}
        onPaymentMethodSelect={handlePaymentMethodSelect}
      />

      <PaymentFormModal
        isOpen={isPaymentFormOpen}
        onClose={() => setIsPaymentFormOpen(false)}
        selectedPlan={selectedPlan}
        paymentMethod={selectedPaymentMethod}
        onPaymentSubmit={handlePaymentSubmit}
      />

      <PaymentSuccessModal
        isOpen={isPaymentSuccessOpen}
        onClose={() => setIsPaymentSuccessOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
