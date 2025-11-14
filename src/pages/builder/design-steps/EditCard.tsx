// design-steps/EditCard.tsx
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Image as ImageIcon, Type, Trash2, Palette } from "lucide-react";
import { TextVariablesPanel } from "./components/TextVariablesPanel"; // Chemin corrigé

export function EditCard({ ctx }: { ctx: any }) {
  const {
    canvasRef,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    items,
    selectedId,
    setSelectedId,
    addText,
    setShowImagePicker,
    removeSelected,
    setItems,
    bgColor,
    setBgColor,
    setBgImage,
  } = ctx;

  const [activeTab, setActiveTab] = useState("elements");
  const [showVariables, setShowVariables] = useState(false);

  const selected = items.find((i: any) => i.id === selectedId) ?? null;

  // wrap the whole UI in a Tabs root to avoid "TabsContent must be used within Tabs" runtime error
  return (
    <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        {/* Zone de design principale */}
        <Card>
          <CardHeader>
            <CardTitle>Éditeur de carte</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={canvasRef}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              className="relative w-full aspect-[4/3] rounded-lg border-2 border-dashed border-border bg-muted shadow-lg overflow-hidden"
              style={{
                background: bgColor,
                backgroundSize: "cover",
              }}
            >
              {items.map((it: any) => (
                <div
                  key={it.id}
                  onMouseDown={(e: any) => onMouseDown(e, it.id)}
                  onClick={() => setSelectedId(it.id)}
                  className={`absolute cursor-move transition-all duration-150 p-1 ${
                    selectedId === it.id
                      ? "ring-2 ring-primary ring-offset-2 rounded"
                      : ""
                  }`}
                  style={{ left: it.x, top: it.y }}
                >
                  {it.type === "text" ? (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        setItems((prev: any[]) =>
                          prev.map((p: any) =>
                            p.id === it.id
                              ? {
                                  ...(p as any),
                                  text: e.currentTarget.innerText,
                                }
                              : p
                          )
                        )
                      }
                      className="outline-none min-w-[80px] bg-white/80 backdrop-blur-sm rounded px-2 py-1"
                      style={{
                        color: (it as any).color,
                        letterSpacing: (it as any).letterSpacing + "px",
                        fontWeight: (it as any).fontWeight,
                        fontSize: (it as any).fontSize,
                        fontFamily: (it as any).fontFamily,
                        textAlign: (it as any).textAlign,
                      }}
                    >
                      {(it as any).text}
                    </div>
                  ) : (
                    <img
                      src={(it as any).src}
                      alt=""
                      draggable={false}
                      className="rounded shadow-sm"
                      style={{
                        width: (it as any).width,
                        height: (it as any).height,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panneau de contrôle */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Tabs
                value={activeTab}
                onValueChange={(v: string) => setActiveTab(v)}
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="elements">Éléments</TabsTrigger>
                  <TabsTrigger value="background">Fond</TabsTrigger>
                  <TabsTrigger value="properties">Propriétés</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="elements" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={addText}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <Type className="h-5 w-5" />
                    <span>Ajouter du texte</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowImagePicker(true)}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                  >
                    <ImageIcon className="h-5 w-5" />
                    <span>Ajouter une image</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowVariables(true)}
                    className="flex flex-col items-center gap-2 h-auto py-4 col-span-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Variables de texte</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="background" className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Couleur de fond</Label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => {
                      setBgColor(e.target.value);
                      setBgImage(null);
                    }}
                    className="h-10 w-full rounded-md border cursor-pointer"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowImagePicker(true)}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Image de fond
                </Button>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                {selected ? (
                  <div className="space-y-4">
                    {selected.type === "text" && (
                      <>
                        <div>
                          <Label className="text-sm">Contenu</Label>
                          <Input
                            value={selected.text}
                            onChange={(e) =>
                              setItems((prev: any[]) =>
                                prev.map((p: any) =>
                                  p.id === selected.id
                                    ? { ...(p as any), text: e.target.value }
                                    : p
                                )
                              )
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm">Taille</Label>
                            <Input
                              type="number"
                              value={selected.fontSize}
                              onChange={(e) =>
                                setItems((prev: any[]) =>
                                  prev.map((p: any) =>
                                    p.id === selected.id
                                      ? {
                                          ...(p as any),
                                          fontSize: Number(e.target.value),
                                        }
                                      : p
                                  )
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Couleur</Label>
                            <input
                              type="color"
                              value={selected.color}
                              onChange={(e) =>
                                setItems((prev: any[]) =>
                                  prev.map((p: any) =>
                                    p.id === selected.id
                                      ? { ...(p as any), color: e.target.value }
                                      : p
                                  )
                                )
                              }
                              className="h-10 w-full rounded-md border cursor-pointer"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Button
                      variant="destructive"
                      onClick={removeSelected}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer l'élément
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="h-8 w-8 mx-auto mb-2" />
                    <p>Sélectionnez un élément pour modifier ses propriétés</p>
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Card>

          {/* Panneau des variables */}
          {showVariables && (
            <TextVariablesPanel
              ctx={ctx}
              onClose={() => setShowVariables(false)}
            />
          )}
        </div>
      </div>
    </Tabs>
  );
}
