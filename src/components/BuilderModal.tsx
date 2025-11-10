import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import * as Tone from "tone";

interface BuilderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const COLORS = ["#2C2C54", "#EA2027", "#FDA7DC", "#EAB543", "#1B9CFC"] as const;

type Color = typeof COLORS[number];

export function BuilderModal({ open, onOpenChange }: BuilderModalProps) {
  const [selected, setSelected] = useState<Color>(COLORS[0]);
  const [isOpen, setIsOpen] = useState(false);
  const envelopeRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const letterRef = useRef<HTMLDivElement | null>(null);
  const synthRef = useRef<Tone.PolySynth | null>(null);

  useEffect(() => {
    if (open) {
      // Lazy init Tone synth on open (will start on user gesture)
      if (!synthRef.current) {
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "triangle" },
        }).toDestination();
      }
      // Reset state/positions
      setIsOpen(false);
      gsap.set(flapRef.current, { rotateX: 0 });
      gsap.set(letterRef.current, { y: 0 });
    }
  }, [open]);

  const playBell = async () => {
    try {
      // Ensure audio ctx is started on first interaction
      if (Tone.context.state !== "running") {
        await Tone.start();
      }
      synthRef.current?.triggerAttackRelease(["C5"], "8n");
    } catch {
      // noop
    }
  };

  const createSparkles = () => {
    const root = envelopeRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const colors = ["#ffffff", "#ffed7f", "#ffd323", "#c6ff00", "#18ffff"];

    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.borderRadius = "50%";
      el.style.pointerEvents = "none";
      el.style.zIndex = "60";
      document.body.appendChild(el);

      const size = gsap.utils.random(5, 10);
      gsap.set(el, { width: size, height: size, x: centerX, y: centerY });
      gsap.to(el, {
        duration: gsap.utils.random(0.5, 1.3),
        x: centerX + gsap.utils.random(-140, 140),
        y: centerY + gsap.utils.random(-140, 140),
        scale: 0,
        opacity: 0,
        rotation: gsap.utils.random(-360, 360),
        ease: "power2.out",
        onComplete: () => el.remove(),
      });
    }
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
    const openNow = !isOpen;
    if (openNow) {
      playBell();
      createSparkles();
      gsap
        .timeline()
        .to(flapRef.current, { duration: 0.4, rotateX: 160, transformOrigin: "top", ease: "power2.inOut" })
        .to(
          letterRef.current,
          { duration: 0.6, y: -140, ease: "back.out(1.7)" },
          "-=0.2"
        );
    } else {
      gsap
        .timeline()
        .to(letterRef.current, { duration: 0.6, y: 0, ease: "power2.inOut" })
        .to(
          flapRef.current,
          { duration: 0.4, rotateX: 0, transformOrigin: "top", ease: "power2.inOut" },
          "-=0.3"
        );
    }
  };

  const palette = useMemo(() => COLORS, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Créer votre propre design</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Preview/Animation */}
          <div className="relative">
            <div
              ref={envelopeRef}
              className={cn(
                "relative mx-auto w-[260px] h-[210px] select-none",
                "[perspective:800px]"
              )}
            >
              {/* Back panel */}
              <div
                className="absolute inset-0 rounded-sm shadow"
                style={{ background: selected }}
              />

              {/* Letter */}
              <div
                ref={letterRef}
                className="absolute left-2 top-2 right-2 h-[170px] rounded-sm bg-card flex items-center justify-center text-center px-3"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <p className="text-sm font-medium">Souvenez-vous de changer le monde en étant vous-même !</p>
              </div>

              {/* Front triangles (sides) */}
              <div
                className="absolute left-0 top-0 border-t-[100px] border-b-[100px] border-l-[130px] border-l-transparent"
                style={{ borderTopColor: "transparent", borderBottomColor: "transparent", borderRightColor: selected }}
              />
              <div
                className="absolute left-[-120px] top-[-100px] border-t-[100px] border-b-[100px] border-r-[130px] border-r-transparent"
                style={{ borderTopColor: "transparent", borderBottomColor: "transparent", borderLeftColor: selected }}
              />
              <div
                className="absolute left-[-120px] top-[-5px] border-b-[105px] border-l-[125px] border-r-[125px] border-l-transparent border-r-transparent"
                style={{ borderBottomColor: selected }}
              />

              {/* Top flap */}
              <div
                ref={flapRef}
                className="absolute top-0 left-0 right-0 border-t-[105px] border-l-[125px] border-r-[125px] border-l-transparent border-r-transparent [transform-origin:top]"
                style={{ borderTopColor: selected }}
              />

              {/* Shadow */}
              <div className="absolute left-0 right-0 top-[210px] h-2 rounded-full" style={{ boxShadow: "0 8px 15px rgba(0,0,0,.15)" }} />
            </div>

            <Button
              onClick={toggle}
              className="mt-6 w-full"
              variant="secondary"
            >
              {isOpen ? "Refermer l'enveloppe" : "Ouvrir l'enveloppe"}
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Couleurs du thème</p>
              <div className="flex flex-wrap gap-2">
                {palette.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelected(c)}
                    className={cn(
                      "h-8 w-8 rounded-full border",
                      selected === c && "ring-2 ring-offset-2 ring-primary"
                    )}
                    style={{ background: c }}
                    aria-label={`Choisir la couleur ${c}`}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-md border p-3 bg-muted/30">
              <p className="text-sm">
                Astuce: Glissez la souris autour de l’enveloppe et cliquez pour une petite
                magie (son et paillettes) !
              </p>
            </div>

            <div className="mt-auto flex gap-3">
              <Button onClick={() => onOpenChange(false)} variant="outline">Annuler</Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-[hsl(var(--brand))] text-[hsl(var(--brand-contrast))] hover:opacity-90"
              >
                Démarrer avec ce thème
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default BuilderModal;
