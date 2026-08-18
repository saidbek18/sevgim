import React, { useEffect, useState } from "react";
import "./App.css";

function Heart({ filled = false, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={`icon ${className}`}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="icon sparkle">
      <path
        d="M12 1.5 14 9l7.5 3-7.5 2-2 7.5-2-7.5L2 12l8-3 2-7.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="arrow">
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Rose() {
  return (
    <svg viewBox="0 0 100 120" className="rose-svg">
      <path
        d="M51 50c1 19-1 43-10 66"
        stroke="#4d8150"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      <path
        d="M45 76C31 68 18 73 13 84c13 4 24 1 32-8Z"
        fill="#4d8150"
      />

      <path
        d="M48 66c12-9 25-7 33 2-11 8-23 9-33-2Z"
        fill="#4d8150"
      />

      <path
        d="M51 59C31 57 20 44 24 29 28 15 43 7 56 15c12-8 28 1 27 16-1 17-14 28-32 28Z"
        fill="#dc3474"
      />

      <path
        d="M36 29c5-11 19-14 28-6-8-1-14 2-17 8 6-3 12-1 15 4-8 7-19 5-26-6Z"
        fill="#ff9abc"
      />
    </svg>
  );
}

function createParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 5,
  }));
}

function createPetals(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 4 + Math.random() * 5,
    size: 6 + Math.random() * 9,
    drift: -160 + Math.random() * 320,
    rotation: Math.random() * 360,
  }));
}

export default function App() {
  const [opened, setOpened] = useState(false);

  // 0 = kechirasanmi
  // 1 = Saidni yaxshi ko'rasanmi
  // 2 = yana oxirgi savol
  // 3 = final
  const [step, setStep] = useState(0);

  const [noPosition, setNoPosition] = useState({
    x: 0,
    y: 0,
  });

  const [particles, setParticles] = useState(() =>
    createParticles(70)
  );

  const [petals, setPetals] = useState([]);

  useEffect(() => {
    setParticles(createParticles(70));
  }, []);

  const openEnvelope = () => {
    setOpened(true);
    setPetals(createPetals(70));
  };

  const moveNoButton = () => {
    const x = Math.floor(Math.random() * 180) - 90;
    const y = Math.floor(Math.random() * 140) - 70;

    setNoPosition({ x, y });

    setPetals(createPetals(25));
  };

  const answerYes = () => {
    setStep((current) => current + 1);

    setNoPosition({
      x: 0,
      y: 0,
    });

    setParticles(createParticles(110));
    setPetals(createPetals(65));
  };

  const questions = [
    "Meni kechirasanmi?",
    "Saidni yaxshi ko'rasanmi?",
    "Meni ham yaxshi ko'rasanmi?",
  ];

  return (
    <main
      className={`app ${
        opened ? "opened" : ""
      } ${step === 3 ? "final" : ""}`}
    >
      <div className="noise" />

      <div className="background-orb orb-a" />
      <div className="background-orb orb-b" />
      <div className="background-orb orb-c" />

      {/* PARTICLES */}

      <div className="stars">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="star"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* PETALS */}

      {opened && (
        <div className="petal-layer">
          {petals.map((petal) => (
            <span
              key={petal.id}
              className="petal"
              style={{
                left: `${petal.x}%`,
                width: `${petal.size}px`,
                height: `${petal.size * 0.68}px`,
                animationDelay: `${petal.delay}s`,
                animationDuration: `${petal.duration}s`,
                "--drift": `${petal.drift}px`,
                "--rotation": `${petal.rotation}deg`,
              }}
            />
          ))}
        </div>
      )}

      <section className="scene">

        {/* =================================================
            ENVELOPE
        ================================================= */}

        {!opened && (
          <div className="closed-scene">

            <div className="eyebrow">
              <span />
              SOMETHING SPECIAL FOR YOU
              <span />
            </div>

            <h1 className="hero-title">
              <span>Mening</span>

              <strong>
                Sevgilim
              </strong>

              <Heart
                filled
                className="hero-heart"
              />
            </h1>

            <p className="hero-description">
              Agar seni ranjitgan bo'lsam,
              <br />
              meni kechir...
            </p>

            <div className="envelope-stage">

              <div className="envelope-aura" />

              <div className="envelope">

                {/* BACK */}

                <div className="envelope-back">

                  <div className="paper-grain" />

                  <div className="inside-letter">

                    <div className="inside-heart">
                      <Heart filled />
                    </div>

                    <span>
                      Sen uchun
                    </span>

                    <b>
                      bir xat
                    </b>

                    <span>
                      tayyorladim...
                    </span>

                  </div>
                </div>

                {/* FLAP */}

                <div className="envelope-flap">
                  <div className="flap-shine" />
                </div>

                {/* FRONT */}

                <div className="envelope-front">

                  <div className="fold fold-left" />
                  <div className="fold fold-right" />

                  <div className="seal">
                    <div className="seal-ring">
                      <Heart filled />
                    </div>
                  </div>

                  <div className="envelope-caption">
                    Seni uchun...
                  </div>

                </div>

              </div>

              <button
                className="open-button"
                onClick={openEnvelope}
              >
                <span>
                  Ochish
                </span>

                <span className="button-arrow">
                  <Arrow />
                </span>
              </button>

              <div className="open-hint">
                <Sparkle />
                <span>
                  tegin va och
                </span>
                <Sparkle />
              </div>

            </div>

            <div className="under-note">
              <Heart />
              <span>
                Faqat sen uchun tayyorlandi
              </span>
              <Heart />
            </div>

          </div>
        )}

        {/* =================================================
            QUESTIONS
        ================================================= */}

        {opened && step < 3 && (
          <div className="question-scene">

            <div className="question-roses">
              <div className="question-rose rose-left">
                <Rose />
              </div>

              <div className="question-rose rose-right">
                <Rose />
              </div>
            </div>

            <div className="question-card">

              <div className="question-top">
                <Sparkle />

                <span>
                  FROM MY HEART
                </span>

                <Sparkle />
              </div>

              <div className="question-heart">
                <Heart filled />
              </div>

              <div className="question-number">
                0{step + 1} / 03
              </div>

              <h2>
                {questions[step]}
              </h2>

              <div className="question-divider">
                <span />
                <Heart filled />
                <span />
              </div>

              <p className="question-text">
                {step === 0 &&
                  "Birgina haqiqatni bilishni xohlayman..."}
                {step === 1 &&
                  "Buni eshitish men uchun juda muhim..."}
                {step === 2 &&
                  "Oxirgi savolim. Rostini ayt..."}
              </p>

              <div className="answers">

                <button
                  className="yes-button"
                  onClick={answerYes}
                >
                  <span>
                    HA
                  </span>

                  <Heart filled />
                </button>

                <button
                  className="no-button"
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  onClick={moveNoButton}
                  style={{
                    transform: `
                      translate(
                        ${noPosition.x}px,
                        ${noPosition.y}px
                      )
                    `,
                  }}
                >
                  YO'Q
                </button>

              </div>

              <div className="question-hint">
                <Sparkle />
                <span>
                  to'g'risini tanla
                </span>
                <Sparkle />
              </div>

            </div>

          </div>
        )}

        {/* =================================================
            FINAL
        ================================================= */}

        {opened && step === 3 && (
          <div className="final-scene">

            <div className="final-roses">
              <div className="final-rose rose-a">
                <Rose />
              </div>

              <div className="final-rose rose-b">
                <Rose />
              </div>

              <div className="final-rose rose-c">
                <Rose />
              </div>

              <div className="final-rose rose-d">
                <Rose />
              </div>
            </div>

            <div className="final-card">

              <div className="final-sparkles">
                <Sparkle />
                <Sparkle />
                <Sparkle />
              </div>

              <div className="final-heart">
                <Heart filled />
              </div>

              <div className="final-small">
                THEN THERE IS ONLY ONE THING LEFT TO SAY
              </div>

              <h2>
                Seni ham
                <br />
                yaxshi ko'raman
              </h2>

              <div className="final-divider">
                <span />
                <Heart filled />
                <span />
              </div>

              <p>
                Har doim kulib yur.
                <br />
                Va doim baxtli bo'l.
              </p>

              <div className="final-signature">
                <span>
                  — Said
                </span>

                <div>
                  <Heart filled />
                </div>
              </div>

            </div>

          </div>
        )}

      </section>

      <footer className="footer">
        <span>
          MADE WITH
        </span>

        <Heart filled />

        <span>
          JUST FOR YOU
        </span>
      </footer>

    </main>
  );
}
