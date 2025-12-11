import { Mail, MessageSquare, Send } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ChannelSelectorProps {
  sendMethod: "email" | "sms" | "whatsapp" | null;
  setSendMethod: (method: "email" | "sms" | "whatsapp") => void;
}

export function ChannelSelector({
  sendMethod,
  setSendMethod,
}: ChannelSelectorProps) {
  const channels = [
    {
      id: "email",
      label: "Email",
      icon: Mail,
      description: "Envoi par email",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: "sms",
      label: "SMS",
      icon: MessageSquare,
      description: "Envoi par SMS",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: Send,
      description: "Envoi par WhatsApp",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-blue-600" />
          Canal d'envoi
        </CardTitle>
        <CardDescription>
          Choisissez comment envoyer vos invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={sendMethod || ""}
          onValueChange={(value) => setSendMethod(value as any)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = sendMethod === channel.id;

              return (
                <div key={channel.id} className="relative">
                  <RadioGroupItem
                    value={channel.id}
                    id={channel.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={channel.id}
                    className={`flex flex-col items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border hover:border hover:bg-accent"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full ${
                        isSelected ? channel.bgColor : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          isSelected ? channel.color : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">
                        {channel.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {channel.description}
                      </p>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
