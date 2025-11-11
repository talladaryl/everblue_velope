import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TextVariable } from "@/types";
import { TEXT_VARIABLES } from "@/constants/textVariables";
import { Copy, HelpCircle } from "lucide-react";

interface TextVariablesPanelProps {
  onInsertVariable: (variable: string) => void;
}

export default function TextVariablesPanel({
  onInsertVariable,
}: TextVariablesPanelProps) {
  const handleVariableClick = (variable: TextVariable) => {
    onInsertVariable(variable.key);
  };

  const copyAllVariables = () => {
    const variablesText = TEXT_VARIABLES.map(
      (v) => `${v.key} - ${v.label}`
    ).join("\n");
    navigator.clipboard.writeText(variablesText);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Variables de texte
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>
              Variables qui seront remplacées automatiquement
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={copyAllVariables}>
            <Copy className="h-4 w-4 mr-2" />
            Copier tout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          {TEXT_VARIABLES.map((variable) => (
            <div
              key={variable.key}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="font-mono text-xs">
                    {variable.key}
                  </Badge>
                  <span className="text-sm font-medium">{variable.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ex: "{variable.defaultValue}"
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVariableClick(variable)}
              >
                Insérer
              </Button>
            </div>
          ))}
        </div>

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Astuce:</strong> Utilisez ces variables dans vos textes.
            Elles seront automatiquement remplacées par les informations des
            invités.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
