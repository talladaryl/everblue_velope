import { TextVariable } from "@/types";

export const TEXT_VARIABLES: TextVariable[] = [
  {
    key: "{{nom}}",
    label: "Nom du destinataire",
    defaultValue: "Cher Invité",
  },
  {
    key: "{{prenom}}",
    label: "Prénom du destinataire",
    defaultValue: "Invité",
  },
  {
    key: "{{date}}",
    label: "Date de l'événement",
    defaultValue: "samedi 15 décembre 2024",
  },
  {
    key: "{{heure}}",
    label: "Heure de l'événement",
    defaultValue: "18:00",
  },
  {
    key: "{{lieu}}",
    label: "Lieu de l'événement",
    defaultValue: "Notre salle des fêtes",
  },
  {
    key: "{{expediteur}}",
    label: "Nom de l'expéditeur",
    defaultValue: "L'équipe organisatrice",
  },
];
