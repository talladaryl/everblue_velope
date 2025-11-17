// src/components/home/ModelComponents.tsx
import React from "react";

// Modèle 1 - Simple & Basic
export const Model1 = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="model1-container">
      <div className="model1-content">
        <div
          className={`model1-envelope ${isOpen ? "opened" : ""}`}
          onClick={() => setIsOpen(true)}
        />
        <div className={`model1-letter ${isOpen ? "visible" : ""}`}>
          <div className="model1-body">
            <span
              className="model1-close"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              ×
            </span>
            <div className="model1-message">fin.</div>
          </div>
        </div>
        <div className="model1-shadow" />
      </div>
    </div>
  );
};

// Modèle 2 - Birthday Card
export const Model2 = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="model2-envelope" onClick={() => setIsOpen(!isOpen)}>
      <div
        className={`model2-envelope_top ${
          isOpen ? "model2-envelope_top_close" : ""
        }`}
      />
      <div className="model2-envelope_body">
        <div className={`model2-paper ${isOpen ? "model2-paper_close" : ""}`}>
          <span>Happy Birthday!</span>
        </div>
        <div className="model2-envelope_body_front" />
        <div className="model2-envelope_body_left" />
        <div className="model2-envelope_body_right" />
      </div>
    </div>
  );
};

// Modèle 3 - Simple Hover
export const Model3 = () => {
  const [isHover, setIsHover] = React.useState(false);

  return (
    <div
      className="model3-envelope"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="model3-back" />
      <div className={`model3-letter ${isHover ? "model3-lift" : ""}`}>
        <div className="model3-text">Remember To Change The World!</div>
      </div>
      <div className="model3-front" />
      <div className="model3-top" />
      <div className="model3-shadow" />
    </div>
  );
};

// Modèle 4 - Love Card
export const Model4 = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`model4-envlope-wrapper ${isOpen ? "open" : "close"}`}>
      <div
        className={`model4-envelope ${isOpen ? "open" : "close"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="model4-front model4-flap" />
        <div className="model4-front model4-pocket" />
        <div className="model4-letter">
          <div className="model4-words model4-line1" />
          <div className="model4-words model4-line2" />
          <div className="model4-words model4-line3" />
          <div className="model4-words model4-line4" />
        </div>
        <div className="model4-hearts">
          <div className="model4-heart model4-a1" />
          <div className="model4-heart model4-a2" />
          <div className="model4-heart model4-a3" />
        </div>
      </div>
    </div>
  );
};

// Modèle 5 - Valentine Card
export const Model5 = () => {
  const [isActive, setIsActive] = React.useState(false);

  return (
    <div className="model5-container-valentine">
      <div
        className={`model5-envelope ${isActive ? "active" : ""}`}
        onClick={() => setIsActive(!isActive)}
      >
        <div className="model5-envelope-back" />
        <div className="model5-envelope-inner" />
        <div className="model5-letter">
          {isActive && (
            <div className="model5-letter-content">Your message</div>
          )}
        </div>
        <div className="model5-envelope-front" />
        <div className="model5-envelope-flap" />
      </div>
    </div>
  );
};

// Modèle 7 - Extravagant Card
export const Model7 = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="model7-envelop" onClick={() => setIsOpen(!isOpen)}>
      <div className="model7-envelop__front-paper" />
      <div className="model7-envelop__back-paper" />
      <div className="model7-envelop__up-paper" />
      <div className="model7-envelop__sticker" />
      <div className="model7-envelop__false-sticker" />
      <div className="model7-envelop__content">
        <div className="model7-love-notes">
          <div className="model7-note">
            <div className="model7-note__text">
              <p>Hola amor...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modèle 8 - Basic Card
export const Model8 = () => {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <div className="model8-page1" onClick={() => setIsOpened(true)}>
      <div className={`model8-envelope-wrapper ${isOpened ? "open" : ""}`}>
        <div className={`model8-envelope ${isOpened ? "open" : ""}`}>
          <div className="model8-flap" />
          <div className="model8-stripe" />
        </div>
        <div className={`model8-letter ${isOpened ? "popped" : ""}`}>
          Hey Lorraine... <button className="model8-next-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

// Modèle 9 - Fly Card
export const Model9 = () => (
  <div className="model9-envelope_form_wrap">
    <div className="model9-env_wrap">
      <div className="model9-env_form_wrap">
        <h3>Drop in your email</h3>
      </div>
      <div className="model9-env_top" />
      <div className="model9-env_bottom_wrap">
        <div className="model9-env_bottom" />
      </div>
    </div>
  </div>
);

// Modèle 11 - Heart Card
export const Model11 = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <div className="model11-letter_ct">
      <input
        type="checkbox"
        id="model11-check"
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
        className="model11-check"
      />
      <label htmlFor="model11-check" className="model11-label">
        <span className="model11-letter model11-main"></span>
        <div className="model11-note">
          <p className="model11-int">Dear [NAME],</p>
          <p>
            [MESSAGE]
            <br />
            [MESSAGE]
          </p>
          <p className="model11-sign">
            [greeting],
            <br />
            [OWN NAME]
          </p>
        </div>
        <span className="model11-front"></span>
        <span className="model11-letter model11-flap-bg"></span>
        <span className="model11-letter model11-flap"></span>
        <span className="model11-heart"></span>
      </label>
    </div>
  );
};
