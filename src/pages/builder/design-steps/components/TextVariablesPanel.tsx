// src/pages/builder/components/TextVariablesPanel.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Eye, Copy } from "lucide-react";

export function TextVariablesPanel({
  ctx,
  onClose,
}: {
  ctx: any;
  onClose: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const textVariables = ctx.textVariables || [
    {
      name: "Prénom",
      token: "{{first_name}}",
      description: "Prénom du destinataire",
    },
    { name: "Nom", token: "{{last_name}}", description: "Nom du destinataire" },
    { name: "Email", token: "{{email}}", description: "Adresse email" },
    { name: "RSVP", token: "{{rsvp_url}}", description: "Lien RSVP" },
    {
      name: "Événement",
      token: "{{event_name}}",
      description: "Nom de l'événement",
    },
    {
      name: "Date",
      token: "{{event_date}}",
      description: "Date de l'événement",
    },
    {
      name: "Lieu",
      token: "{{event_location}}",
      description: "Lieu de l'événement",
    },
    {
      name: "Heure",
      token: "{{event_time}}",
      description: "Heure de l'événement",
    },
  ];

  const filteredVariables = textVariables.filter((v: any) =>
    `${v.name} ${v.token} ${v.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleInsertVariable = (token: string) => {
    if (ctx.handleInsertVariable) {
      ctx.handleInsertVariable(token);
    } else {
      // Fallback implementation
      const selected = ctx.items.find((i: any) => i.id === ctx.selectedId);
      if (selected && selected.type === "text") {
        ctx.setItems((prev: any[]) =>
          prev.map((p: any) =>
            p.id === ctx.selectedId
              ? { ...p, text: `${p.text || ""}${token}` }
              : p
          )
        );
      } else {
        // Create new text element with variable
        const newItem = {
          id: `txt_${Date.now()}`,
          type: "text",
          text: token,
          color: "#000000",
          fontSize: 20,
          fontWeight: 600,
          fontFamily: "system-ui",
          x: 50,
          y: 50,
          letterSpacing: 0,
          textAlign: "center",
        };
        ctx.setItems((prev: any[]) => [...prev, newItem]);
        ctx.setSelectedId(newItem.id);
      }
    }
    onClose();
  };

  const previewVariable = (variable: any) => {
    const guestSample = ctx.guests?.[0];
    if (guestSample && ctx.replaceVariables) {
      return ctx.replaceVariables(variable.token, guestSample);
    }
    return variable.token;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Variables de texte</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Rechercher une variable..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="max-h-80 overflow-auto space-y-3">
          {filteredVariables.map((variable: any) => (
            <div
              key={variable.token}
              className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{variable.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {variable.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleInsertVariable(variable.token)}
                >
                  Insérer
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {variable.token}
                </code>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(variable.token);
                      ctx.toast?.("Copié!", {
                        description: "Token copié dans le presse-papier",
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      ctx.toast?.(variable.name, {
                        description: `Aperçu: ${previewVariable(variable)}`,
                      });
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredVariables.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune variable trouvée
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <p>
            Les variables seront remplacées par les vraies valeurs dans l'étape
            suivante
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
