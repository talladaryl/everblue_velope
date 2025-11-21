import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

// Enregistrer les plugins GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(CSSRulePlugin);
}

// Composant universel pour rendre tous les types d'items (texte, image, vidéo, gif)
function RenderCardItems({ items, containerStyle = {} }: any) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", ...containerStyle }}>
      {items.map((item: any, index: number) => {
        if (item.type === "text") {
          return (
            <div
              key={index}
              style={{
                color: item.color || "#000000",
                fontSize: item.fontSize ? `${item.fontSize}px` : "16px",
                fontFamily: item.fontFamily || "Arial",
                fontWeight: item.fontWeight || "normal",
                textAlign: item.textAlign || "left",
                textShadow: item.textShadow || "none",
                marginBottom: "8px",
                wordWrap: "break-word",
              }}
            >
              {item.text}
            </div>
          );
        } else if (item.type === "image" || item.type === "gif") {
          return (
            <img
              key={index}
              src={item.src}
              alt=""
              style={{
                width: item.width ? `${item.width}px` : "150px",
                height: item.height ? `${item.height}px` : "150px",
                borderRadius: item.borderRadius ? `${item.borderRadius}px` : "0",
                opacity: item.opacity ? item.opacity / 100 : 1,
                objectFit: "cover",
                marginBottom: "8px",
                display: "block",
              }}
            />
          );
        } else if (item.type === "video") {
          return (
            <video
              key={index}
              src={item.src}
              autoPlay={item.autoPlay}
              loop={item.loop}
              muted={item.muted}
              style={{
                width: item.width ? `${item.width}px` : "200px",
                height: item.height ? `${item.height}px` : "150px",
                borderRadius: item.borderRadius ? `${item.borderRadius}px` : "0",
                opacity: item.opacity ? item.opacity / 100 : 1,
                objectFit: "cover",
                marginBottom: "8px",
                display: "block",
              }}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

// Modèle 1: Simple and Basic
export function PreviewModel1({ items, bgColor, onClose, guest }: any) {
  const envelopeRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (envelopeRef.current && letterRef.current && shadowRef.current) {
      const t1 = gsap.timeline({ paused: true });
      const flap = CSSRulePlugin.getRule(".envelope-model1::before");

      t1.to(flap, {
        duration: 0.5,
        cssRule: {
          rotateX: 180,
        },
      })
        .set(flap, {
          cssRule: {
            zIndex: 10,
          },
        })
        .to(letterRef.current, {
          y: -200,
          duration: 0.9,
          ease: "back.inOut(1.5)",
        })
        .set(letterRef.current, {
          zIndex: 40,
        })
        .to(letterRef.current, {
          duration: 0.7,
          ease: "back.out(.4)",
          y: -5,
          z: 250,
        });

      const t2 = gsap.timeline({ paused: true });
      t2.to(shadowRef.current, {
        delay: 1.4,
        width: 450,
        boxShadow: "-75px 150px 10px 5px #eeeef3",
        ease: "back.out(.2)",
        duration: 0.7,
      });

      timelineRef.current = t1;
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const openCard = () => {
    timelineRef.current?.play();
  };

  const closeCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    timelineRef.current?.reverse();
  };

  return (
    <div
      className="model-container"
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "transparent",
      }}
    >
      <div
        className="content-model1"
        style={{ position: "relative", perspective: "600px" }}
      >
        <div
          className="envelope-model1"
          ref={envelopeRef}
          onClick={openCard}
          style={{
            position: "relative",
            width: "300px",
            height: "180px",
            background: "linear-gradient(#cccbd7 0.5px, #26452b 0.5px)",
            cursor: "pointer",
          }}
        />

        <div
          className="letter-model1"
          ref={letterRef}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "280px",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
            borderRadius: "2px",
            background: "#d8d7e5",
            boxShadow: "0px 1px 7px -2px #283c2b",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "240px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#283c2b",
            }}
          >
            <span
              onClick={closeCard}
              style={{
                position: "absolute",
                right: "0",
                top: "0",
                fontSize: "30px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              x
            </span>
            <RenderCardItems 
              items={items} 
              containerStyle={{
                fontSize: "16px",
                textAlign: "center",
                fontFamily: "'Great Vibes', cursive",
                overflow: "auto",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>

        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            width: "200px",
            height: "1px",
            background: "transparent",
            borderRadius: "30%",
            boxShadow: "50px 100px 10px 5px #eeeef3",
          }}
        />

        <style>{`
          .envelope-model1::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 300px;
            border-top: 115px solid #7873A7;
            border-left: 150px solid transparent;
            border-right: 150px solid transparent;
            box-sizing: border-box;
            z-index: 30;
            transform-origin: top;
          }

          .envelope-model1::after {
            content: '';
            position: absolute;
            top: 0;
            width: 300px;
            height: 180px;
            z-index: 25;
            background: 
              linear-gradient(30deg, #162819 47%, #0c170e 50%, #283c2b 50%) 150px 90px/150px 90px no-repeat,
              linear-gradient(31deg, #283c2b 49%, #0c170e 50%, transparent 50%) 0px 0px/152px 90px no-repeat,
              linear-gradient(150deg, #283c2b 50%, #0c170e 50%, #162819 53%) 0px 90px/151px 90px no-repeat,
              linear-gradient(148.7deg, transparent 50%, #0c170e 50%, #283c2b 51%) 150px 0px/150px 90px no-repeat;
          }
        `}</style>
      </div>
    </div>
  );
}

// Modèle 2: Birthday Card
export function PreviewModel2({ items, bgColor, onClose, guest }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleEnvelope = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="model-container"
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "#feca57",
      }}
    >
      <div
        className="envelope-model2"
        onClick={toggleEnvelope}
        style={{
          width: "300px",
          height: "150px",
          background: "#ae4243",
          position: "relative",
          cursor: "pointer",
        }}
      >
        <div
          className={`envelope-top-model2 ${
            isOpen ? "envelope-top-close" : ""
          }`}
          style={{
            borderBottom: "100px solid #ae4243",
            borderLeft: "110px solid transparent",
            borderRight: "110px solid transparent",
            height: "0",
            width: "80px",
            position: "absolute",
            transform: "translateY(-100%)",
            transformOrigin: "bottom",
            transition: ".3s",
            zIndex: 3,
          }}
        />

        <div className="envelope-body-model2" style={{ position: "relative" }}>
          <div
            className="envelope-body-front-model2"
            style={{
              width: "300px",
              height: "75px",
              background: "#ff6b6b",
              position: "absolute",
              zIndex: 2,
              transform: "translateY(100%)",
            }}
          />

          <div
            className="envelope-body-left-model2"
            style={{
              width: "0",
              height: "0",
              borderTop: "75px solid transparent",
              borderLeft: "110px solid #ee5253",
              borderBottom: "75px solid transparent",
              zIndex: 3,
              position: "relative",
            }}
          />

          <div
            className="envelope-body-right-model2"
            style={{
              float: "right",
              width: "0",
              height: "0",
              borderTop: "75px solid transparent",
              borderRight: "110px solid #ee5253",
              borderBottom: "75px solid transparent",
              transform: "translateY(-100%)",
              zIndex: 3,
              position: "relative",
            }}
          />
        </div>

        <div
          className={`paper-model2 ${isOpen ? "paper-close" : ""}`}
          style={{
            background: "#fff",
            width: "260px",
            height: "100px",
            position: "absolute",
            left: "50%",
            marginLeft: "-135px",
            marginTop: "-60px",
            textAlign: "center",
            padding: "5px",
            lineHeight: "4em",
            fontSize: "1.5em",
            zIndex: 3,
            transition: ".2s",
          }}
        >
          <RenderCardItems 
            items={items} 
            containerStyle={{
              fontSize: "16px",
              padding: "10px",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>

        <style>{`
          .envelope-top-close {
            transform: translateY(-100%) rotateX(180deg) !important;
            border-bottom: 100px solid #ef5b5b !important;
            z-index: 4 !important;
          }
          .paper-close {
            margin-top: 0 !important;
            z-index: 2 !important;
          }
        `}</style>
      </div>
    </div>
  );
}

// Modèle 3: Simple and Basic Card
export function PreviewModel3({ items, bgColor, onClose, guest }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "transparent",
      }}
    >
      <div
        className="envelope-model3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          cursor: "pointer",
          width: "250px",
          height: "200px",
        }}
      >
        <div
          className="back-model3"
          style={{
            position: "relative",
            width: "250px",
            height: "200px",
            backgroundColor: "#ffcea1",
          }}
        />

        <div
          className={`letter-model3 ${isHovered ? "letter-hover" : ""}`}
          style={{
            position: "absolute",
            backgroundColor: "#fff",
            width: "230px",
            height: "180px",
            top: "10px",
            left: "10px",
            transition: ".2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <RenderCardItems 
            items={items} 
            containerStyle={{
              fontSize: "14px",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>

        <div
          className="front-model3"
          style={{
            position: "absolute",
            borderRight: "130px solid #facba0",
            borderTop: "100px solid transparent",
            borderBottom: "100px solid transparent",
            height: "0",
            width: "0",
            top: "0",
            left: "120px",
            zIndex: 3,
          }}
        />

        <div
          className={`top-model3 ${isHovered ? "top-hover" : ""}`}
          style={{
            position: "absolute",
            borderTop: "105px solid #ffc894",
            borderLeft: "125px solid transparent",
            borderRight: "125px solid transparent",
            height: "0",
            width: "0",
            top: "0",
            transformOrigin: "top",
            transition: ".4s",
          }}
        />

        <div
          className="shadow-model3"
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.1)",
            width: "250px",
            height: "10px",
            top: "220px",
            borderRadius: "50%",
          }}
        />

        <style>{`
          .letter-hover {
            transform: translateY(-100px) !important;
            z-index: 2 !important;
          }
          .top-hover {
            transform: rotateX(160deg) !important;
          }
        `}</style>
      </div>
    </div>
  );
}

// Modèle 4: Love Card
export function PreviewModel4({ items, bgColor, onClose, guest }: any) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp { 
        0% { top: 0; }
        100% { top: -600px; }
      }
      @keyframes sideSway {
        0% { margin-left: 0px; }
        100% { margin-left: 50px; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "#e8f4f8",
      }}
    >
      <div className="envlope-wrapper-model4" style={{ height: "380px" }}>
        <div
          id="envelope-model4"
          className={isOpen ? "open" : "close"}
          style={{
            position: "relative",
            width: "280px",
            height: "180px",
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
            margin: "auto",
            top: "150px",
            backgroundColor: "#004d66",
            boxShadow: "0 4px 20px rgba(0,0,0,.2)",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="front flap-model4"
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              zIndex: 3,
            }}
          />

          <div
            className="front pocket-model4"
            style={{
              borderLeft: "140px solid #0077B2",
              borderRight: "140px solid #0077B2",
              borderBottom: "90px solid #006699",
              borderTop: "90px solid transparent",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
            }}
          />

          <div
            className={`letter-model4 ${isOpen ? "letter-open" : ""}`}
            style={{
              position: "relative",
              backgroundColor: "#fff",
              width: "90%",
              margin: "auto",
              height: "90%",
              top: "5%",
              borderRadius: "6px",
              boxShadow: "0 2px 26px rgba(0,0,0,.12)",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <RenderCardItems 
              items={items} 
              containerStyle={{
                fontSize: "14px",
                textAlign: "center",
                overflow: "auto",
                maxHeight: "100%",
              }}
            />
          </div>

          <div
            className="hearts-model4"
            style={{
              position: "absolute",
              top: "90px",
              left: "0",
              right: "0",
              zIndex: 2,
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`heart-model4 a${i}`}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "10%",
                  pointerEvents: "none",
                  opacity: isOpen ? 1 : 0,
                  animation: isOpen
                    ? `slideUp ${4 + i}s linear 1, sideSway ${
                        2 + i
                      }s ease-in-out ${2 + i * 2} alternate`
                    : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .flap-model4 {
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-bottom: 82px solid transparent;
          border-top: 98px solid #004d66;
          transform-origin: top;
        }
        .open .flap-model4 {
          transform: rotateX(180deg);
          transition: transform .4s ease, z-index .6s;
          z-index: 1;
        }
        .close .flap-model4 {
          transform: rotateX(0deg);
          transition: transform .4s .6s ease, z-index 1s;
          z-index: 5;
        }
        .close .letter-model4 {
          transform: translateY(0px); 
          transition: transform .4s ease, z-index 1s;
          z-index: 1;
        }
        .open .letter-model4 {
          transform: translateY(-60px);
          transition: transform .4s .6s ease, z-index .6s;
          z-index: 2;
        }
        .heart-model4:before, .heart-model4:after {
          position: absolute;
          content: "";
          left: 25px;
          top: 0;
          width: 25px;
          height: 40px;
          background: #D00000;
          border-radius: 25px 25px 0 0;
          transform: rotate(-45deg);
          transform-origin: 0 100%;
        }
        .heart-model4:after {
          left: 0;
          transform: rotate(45deg);
          transform-origin: 100% 100%;
        }
        .a1 { left: 20%; transform: scale(0.6); }
        .a2 { left: 55%; transform: scale(1); }
        .a3 { left: 10%; transform: scale(0.8); }
      `}</style>
    </div>
  );
}

// Modèle 5: Valentine Card
export function PreviewModel5({ items, bgColor, onClose, guest }: any) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ff6b6b, #f06292)",
      }}
    >
      <div
        className={`envelope-model5 ${isActive ? "active" : ""}`}
        style={{
          position: "relative",
          width: "300px",
          height: "200px",
          margin: "0 auto",
          cursor: "pointer",
        }}
        onClick={() => setIsActive(!isActive)}
      >
        <div
          className="envelope-back-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "#ff8080",
            borderRadius: "5px",
            zIndex: 1,
          }}
        />

        <div
          className="envelope-inner-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            top: "0",
            background: "white",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            zIndex: 2,
          }}
        />

        <div
          className="envelope-front-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            bottom: "0",
            background: "#ff8080",
            zIndex: 4,
          }}
        />

        <div
          className="envelope-flap-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            top: "0",
            background: "#ff6666",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            transformOrigin: "top",
            transition: "transform 0.5s ease",
            zIndex: 5,
          }}
        />

        <div
          className={`letter-model5 ${isActive ? "letter-active" : ""}`}
          style={{
            position: "absolute",
            width: "90%",
            height: "80%",
            background: "white",
            top: "10%",
            left: "5%",
            padding: "20px",
            boxSizing: "border-box",
            transition: "all 0.5s ease",
            transform: "translateY(0)",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "5px",
            zIndex: 3,
            visibility: isActive ? "visible" : "hidden",
            opacity: isActive ? 1 : 0,
          }}
        >
          <RenderCardItems 
            items={items} 
            containerStyle={{
              fontSize: "14px",
              lineHeight: "1.5",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>
      </div>

      <style>{`
        .envelope-model5.active .envelope-flap-model5 {
          transform: rotateX(180deg);
        }
        .envelope-model5.active .letter-model5 {
          transform: translateY(-80px);
          z-index: 6;
        }
      `}</style>
    </div>
  );
}

// Modèles 6-12 simplifiés pour respecter la limite de tokens
// Modèle 6: Simple Card
export function PreviewModel6({ items, bgColor, onClose, guest }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "#f2f2f2",
      }}
    >
      <div
        className="envelope-model6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "240px",
          height: "0px",
          margin: "200px auto",
        }}
      >
        <div
          className="icon-envelope-model6"
          style={{
            zIndex: 1,
            position: "relative",
            width: "240px",
            height: "45px",
            backgroundColor: "#40BAA5",
            boxShadow: "0px 5px 0px #36897F",
          }}
        />

        <div
          className={`header-model6 ${isHovered ? "header-hover" : ""}`}
          style={{
            zIndex: 2,
            position: "absolute",
            top: "-75px",
            width: "0px",
            height: "0px",
            borderStyle: "solid",
            borderWidth: "0 120px 83px 120px",
            borderColor: "transparent transparent #36897F transparent",
            transform: "rotate(180deg)",
            transition: "all 1s",
          }}
        />

        <div
          className={`letter-content-model6 ${isHovered ? "letter-hover" : ""}`}
          style={{
            zIndex: 0,
            position: "absolute",
            width: "150px",
            height: "0px",
            background: "#FFF",
            left: "45px",
            bottom: "0px",
            opacity: 1,
            transition: "all 2s",
            padding: "20px",
            overflow: "hidden",
          }}
        >
          <RenderCardItems 
            items={items} 
            containerStyle={{
              fontSize: "12px",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>

        <style>{`
          .header-model6:before {
            content: '';
            position: absolute;
            top: 9px;
            left: -120px;
            width: 0px;
            height: 0px;
            border-style: solid;
            border-width: 0 120px 75px 120px;
            border-color: transparent transparent #40BAA5 transparent;
          }
          .header-hover {
            top: -160px !important;
            transform: rotateY(180deg) !important;
            border-width: 0 120px 75px 120px !important;
          }
          .header-hover:before {
            top: 0px !important;
            box-shadow: 0px 5px 0px #36897F !important;
          }
          .letter-hover {
            height: 100px !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </div>
  );
}

// Modèle 7: Extravagant Card
export function PreviewModel7({ items, bgColor, onClose, guest }: any) {
  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",
      }}
    >
      <div
        className="envelop-model7"
        style={{
          width: "15rem",
          height: "10rem",
          position: "relative",
          margin: "auto",
        }}
      >
        <div
          className="envelop-front-paper-model7"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "0.7rem",
            border: "0.35rem solid #967b5c",
            backgroundColor: "#ba9872",
            clipPath: "polygon(100% 0%, 50% 70%, 0% 0%, 0% 100%, 100% 100%)",
            zIndex: 300,
          }}
        />

        <div
          className="letter-sheet-model7"
          style={{
            position: "absolute",
            width: "95%",
            height: "30%",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.75)",
            bottom: "60%",
            left: "2.5%",
          }}
        >
          <RenderCardItems 
            items={items.slice(0, 1)} 
            containerStyle={{
              fontSize: "12px",
              textAlign: "center",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Modèle 8: Basic Card
export function PreviewModel8({ items, bgColor, onClose, guest }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bgColor || "#ffd6ea",
      }}
    >
      <div
        className="envelope-wrapper-model8"
        style={{
          width: "340px",
          height: "220px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div
          className={`envelope-model8 ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(true)}
          style={{
            width: "320px",
            height: "180px",
            background: "linear-gradient(180deg, #ff9eb5, #ffc6d9)",
            border: "2px solid #d87a8d",
            borderRadius: "8px",
            position: "relative",
            boxShadow: "0 12px 30px rgba(20,10,40,0.12)",
            cursor: "pointer",
          }}
        >
          <div
            className="flap-model8"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "55%",
              background: "linear-gradient(180deg, #ffd6e8, #ffb6cc)",
              transformOrigin: "top center",
              transform: "rotateX(0deg)",
              borderBottom: "2px solid #d87a8d",
              zIndex: 25,
              transition: "transform 1.6s cubic-bezier(.2,.8,.25,1)",
            }}
          />

          <div
            className="stripe-model8"
            style={{
              position: "absolute",
              bottom: "18px",
              left: "10%",
              width: "80%",
              height: "10px",
              background: "rgba(255,255,255,0.35)",
              borderRadius: "6px",
              zIndex: 20,
            }}
          />
        </div>

        <div
          className={`letter-model8 ${isOpen ? "popped" : ""}`}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%) translateY(0)",
            top: "36%",
            width: "86%",
            maxWidth: "280px",
            background: "#FFFFFF",
            padding: "18px",
            boxShadow: "0 18px 40px rgba(10,5,30,0.12)",
            borderRadius: "10px",
            zIndex: 35,
            opacity: 0,
            transition:
              "transform 0.32s cubic-bezier(.2,.9,0.2,1), opacity 0.18s ease-in",
            pointerEvents: "auto",
            whiteSpace: "pre-wrap",
            lineHeight: "1.45",
            fontSize: "15px",
          }}
        >
          <RenderCardItems 
            items={items} 
            containerStyle={{
              textAlign: "center",
              overflow: "auto",
              maxHeight: "100%",
            }}
          />
        </div>

        {!isOpen && (
          <div
            className="hint-model8"
            style={{
              fontWeight: "700",
              color: "#3d3d3d",
              userSelect: "none",
              fontSize: "16px",
              transition: "opacity .35s ease",
            }}
          >
            Click the mail to open
          </div>
        )}
      </div>

      <style>{`
        .envelope-model8.open .flap-model8 {
          transform: rotateX(-180deg);
        }
        .letter-model8.popped {
          transform: translateX(-50%) translateY(-260px) !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

// Modèle 9: Fly Card
export function PreviewModel9({ items, bgColor, onClose, guest }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(20deg, rgba(0,31,73,1) 0%, rgba(46,30,66,1) 100%)",
      }}
    >
      <div
        className="envelope_form_wrap-model9"
        style={{ maxWidth: "100%", width: "500px" }}
      >
        <div
          id="envelope_form-model9"
          className={isHovered ? "hovered" : ""}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: "100%" }}
        >
          <div
            className="env_wrap-model9"
            style={{
              position: "relative",
              overflow: "hidden",
              paddingTop: "110%",
              background:
                "linear-gradient(0deg, #c7c2c5 0%, #c7c2c5 55%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)",
              width: "100%",
            }}
          >
            <div
              className="env_form_wrap-model9"
              style={{
                width: "calc(100% - 2rem)",
                left: "1rem",
                padding: "1rem 3rem",
                background: "#1e1938",
                color: "white",
                position: "absolute",
                height: "100%",
                zIndex: 2,
                transition: "all .4s ease-in-out",
                top: isHovered ? "0" : "100%",
              }}
            >
              <RenderCardItems 
                items={items} 
                containerStyle={{
                  textAlign: "center",
                  padding: "20px",
                  overflow: "auto",
                  maxHeight: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modèle 10: Amour Card
export function PreviewModel10({ items, bgColor, onClose, guest }: any) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "darkred",
      }}
    >
      <div
        className="cssletter-model10"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className={`envelope-model10 ${isActive ? "active" : ""}`}
          style={{
            position: "relative",
            width: "300px",
            height: "200px",
            background: "Moccasin",
            boxShadow: "inset 0 0 30px -5px Peru",
          }}
        >
          <button
            className="heart-model10"
            onClick={() => setIsActive(true)}
            style={{
              zIndex: 4,
              position: "relative",
              boxShadow: "none",
              border: "none",
              width: "70px",
              aspectRatio: "1",
              background:
                "radial-gradient(circle at 60% 65%, darkred 64%, transparent 65%) top left/50% 50%, radial-gradient(circle at 40% 65%, darkred 64%, transparent 65%) top right/50% 50%, conic-gradient(from -45deg at 50% 85.5%, darkred 90deg, transparent 0) bottom/100% 50%",
              backgroundRepeat: "no-repeat",
              left: "50%",
              top: "70%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                transform: "translateY(-10px)",
                display: "block",
                color: "white",
                fontSize: "1.5rem",
              }}
            >
              Open
            </span>
          </button>

          <div
            className="envelope-flap-model10"
            style={{
              width: "100%",
              height: "71%",
              position: "absolute",
              top: 0,
              zIndex: 3,
              overflow: "hidden",
              transition: "0.6s linear all",
              transformOrigin: "top",
            }}
          />

          <div
            className={`letter-content-model10 ${isActive ? "active" : ""}`}
            style={{
              position: "absolute",
              width: "90%",
              height: "70%",
              background: "AntiqueWhite",
              top: "15%",
              left: "5%",
              padding: "20px",
              boxSizing: "border-box",
              zIndex: isActive ? 2 : 0,
              opacity: isActive ? 1 : 0,
              transition: "all 0.5s ease",
            }}
          >
            <RenderCardItems 
              items={items} 
              containerStyle={{
                fontSize: "14px",
                textAlign: "center",
                overflow: "auto",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Modèle 11: Heart Card
export function PreviewModel11({ items, bgColor, onClose, guest }: any) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#121212",
      }}
    >
      <div
        className="letter_ct-model11"
        style={{
          width: "400px",
          height: "300px",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          margin: "auto",
        }}
      >
        <input
          type="checkbox"
          id="check-model11"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          style={{ display: "none" }}
        />
        <label
          htmlFor="check-model11"
          style={{ position: "absolute", cursor: "pointer" }}
        >
          <span
            className="letter main-model11"
            style={{
              width: "400px",
              height: "300px",
              backgroundColor: "pink",
              border: "4px solid palevioletred",
              display: "grid",
              transition: "all 0.3s ease-in-out",
              position: "absolute",
              borderRadius: "0 0 7px 7px",
              boxShadow: "0 10px 30px purple",
            }}
          />

          <div
            className={`note-model11 ${isChecked ? "note-open" : ""}`}
            style={{
              zIndex: 1,
              justifyContent: "center",
              position: "absolute",
              width: "390px",
              height: "270px",
              margin: "10px 9px",
              backgroundColor: "whitesmoke",
              transform: isChecked ? "translateY(-170px)" : "translateY(0px)",
              transition: "transform 0.3s",
              transitionDelay: isChecked ? "0.8s" : "0s",
            }}
          >
            <RenderCardItems 
              items={items} 
              containerStyle={{
                margin: "15px 30px",
                fontSize: "12px",
                color: "purple",
                overflow: "auto",
                maxHeight: "100%",
              }}
            />
          </div>

          <span
            className="heart-model11"
            style={{
              position: "absolute",
              zIndex: 4,
              cursor: "pointer",
              height: "170px",
              width: "200px",
              scale: "30%",
              margin: "70px 102px",
              transition: "transform 0.3s ease-in-out",
              transform: isChecked
                ? "translateX(-60px) rotate(-70deg)"
                : "translateX(0px) rotate(0deg)",
              transformOrigin: "center 70%",
            }}
          />
        </label>
      </div>

      <style>{`
        .heart-model11:before, .heart-model11:after {
          content: "";
          position: absolute;
          width: 100px;
          height: 160px;
          background-color: rgb(178, 34, 106);
        }
        .heart-model11:before {
          left: 100px;
          transform-origin: 0 100%;
          transform: rotate(-45deg);
          border-radius: 50px 50px 0 0;
        }
        .heart-model11:after {
          right: 100px;
          transform-origin: 100% 100%;
          transform: rotate(45deg);
          border-radius: 50px 50px 0 0;
        }
      `}</style>
    </div>
  );
}

// Modèle 12: Friend Card
export function PreviewModel12({ items, bgColor, onClose, guest }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="model-container"
      style={{
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F9F5F6",
      }}
    >
      <div
        className="letter-model12"
        id="letter-model12"
        style={{ marginBottom: "0", maxWidth: "600px", width: "100%" }}
      >
        <div
          className="envelope-model12"
          onClick={() => setIsOpen(true)}
          style={{
            position: "relative",
            display: "flex",
            cursor: "pointer",
            justifyContent: "center",
            width: "100%",
            maxWidth: "500px",
            aspectRatio: "5/3",
            backgroundColor: "#FF5C8D",
            margin: "0 auto",
          }}
        >
          <ul
            className="envelopeHeader-model12"
            style={{
              bottom: "0",
              left: "0",
              padding: "5%",
              listStyle: "none",
              position: "absolute",
              color: "#fa9ec0",
              zIndex: 5,
            }}
          >
            <li
              style={{
                display: "flex",
                fontSize: "14px",
                gap: ".4rem",
              }}
            >
              <p>from:</p>
              <p style={{ color: "#E26698" }}>{guest?.name || "Expéditeur"}</p>
            </li>
          </ul>

          <svg
            className={`cover-model12 ${isOpen ? "open" : ""}`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              fill: isOpen ? "#FF5C8D" : "#E26698",
              zIndex: 5,
              transformOrigin: "top",
              transition: "fill 0.5s ease",
            }}
            viewBox="0 0 500 300"
          >
            <path d="M 0 0 L 500 0 L 275 150 Q 250 175 225 150 L 0 0 Z" />
          </svg>

          <div
            className={`letterSheet-model12 ${isOpen ? "zoomIn" : ""}`}
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              cursor: "pointer",
              transition: "1s ease-in-out",
              width: "90%",
              padding: "5%",
              gap: "5%",
              height: "100%",
              backgroundColor: "#FCFFE7",
              overflow: "auto",
            }}
          >
            <h2
              style={{
                width: "90%",
                color: "#FF5C8D",
                fontSize: "18px",
              }}
            >
              Cher Ami
            </h2>
            <RenderCardItems 
              items={items} 
              containerStyle={{
                color: "#fa9ec0",
                fontSize: "16px",
                overflow: "auto",
                maxHeight: "100%",
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        .envelope-model12::after {
          content: '';
          position: absolute;
          bottom: 0;
          border-left: 100% solid #FDCEDF;
          border-top: 60% solid transparent;
          pointer-events: none;
          z-index: 4;
        }
        .envelope-model12::before {
          content: '';
          pointer-events: none;
          position: absolute;
          bottom: 0;
          border-right: 100% solid #fa9ec0;
          border-top: 60% solid transparent;
          transform: perspective(400px);
          z-index: 3;
        }
        .cover-model12.open {
          animation: open-letter 2s ease-in-out forwards;
        }
        .letterSheet-model12.zoomIn {
          animation: zoom-sheet-up 2s ease forwards;
        }
        @keyframes open-letter {
          0% { transform: rotateX(0deg); }
          100% { transform: translateY(1px) rotateX(180deg); z-index: 2; }
        }
        @keyframes zoom-sheet-up {
          0% { transform: translate(0%, -10%); }
          30% { transform: translate(0%,-100%); }
          100% { transform: translate(0%, -30%); z-index: 10; }
        }
      `}</style>
    </div>
  );
}
