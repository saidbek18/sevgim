import React, { useEffect, useState } from "react";
import "./App.css";

/* =========================================================
   SVG ICONS
========================================================= */

function Heart({ filled = false, className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon ${filled ? "icon-filled" : ""} ${className}`}
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    </svg>
  );
}

function Sparkle({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`icon icon-sparkle ${className}`}
      aria-hidden="true"
    >
      <path d="M12 1.5 14 9l7.5 2-7.5 2-2 7.5-2-7.5-7.5-2L10 9l2-7.5Z" />
      <path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="icon-arrow"
      aria-hidden="true"
    >
      <path d="M5 12h13" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function Rose({ className = "" }) {
  return (
    <svg
      viewBox="0 0 100 120"
      className={`rose-svg ${className}`}
      aria-hidden="true"
    >
      <path
        className="rose-stem"
        d="M51 50c1 19-1 43-10 66"
      />

      <path
        className="rose-leaf"
        d="M45 76C31 68 18 73 13 84c13 4 24 1 32-8Z"
      />

      <path
        className="rose-leaf"
        d="M48 66c12-9 25-7 33 2-11 8-23 9-33-2Z"
      />

      <path
        className="rose-flower"
        d="M51 59C31 57 20 44 24 29 28 15 43 7 56 15c12-8 28 1 27 16-1 17-14 28-32 28Z"
      />

      <path
        className="rose-petal"
        d="M36 29c5-11 19-14 28-6-8-1-14 2-17 8 6-3 12-1 15 4-8 7-19 5-26-6Z"
      />

      <path
        className="rose-center"
        d="M47 25c-6 6-6 14 0 19 6-5 8-11 4-18"
      />
    </svg>
  );
}

/* =========================================================
   PARTICLES
========================================================= */

function makeParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 5,
  }));
}

function makePetals(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3.5,
    duration: 4.5 + Math.random() * 5,
    size: 6 + Math.random() * 9,
    drift: -140 + Math.random() * 280,
    rotation: Math.random() * 360,
  }));
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [opened, setOpened] = useState(false);
  const [forgiven, setForgiven] = useState(false);
  const [particles, setParticles] = useState(() => makeParticles(60));
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    setParticles(makeParticles(65));
  }, []);

  const openEnvelope = () => {
    setOpened(true);
    setPetals(makePetals(90));
    setParticles(makeParticles(110));
  };

  const forgive = () => {
    setForgiven(true);
    setPetals(makePetals(130));
    setParticles(makeParticles(140));
  };

  return (
    <main
      className={[
        "app",
        opened ? "opened" : "",
        forgiven ? "forgiven" : "",
      ].join(" ")}
    >
      {/* BACKGROUND */}

      <div className="noise" />

      <div className="background-orb orb-a" />
      <div className="background-orb orb-b" />
      <div className="background-orb orb-c" />

      {/* STARS */}

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
            CLOSED
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
              <strong>Sevgilim</strong>

              <Heart
                filled
                className="hero-heart"
              />
            </h1>

            <p className="hero-description">
              Agar seni ranjitgan bo‘lsam,
              <br />
              meni kechir...
            </p>

            {/* ENVELOPE */}

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

                    <span>Sen uchun</span>
                    <b>bir xat</b>
                    <span>tayyorladim...</span>

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

              {/* OPEN BUTTON */}

              <button
                className="open-button"
                onClick={openEnvelope}
                type="button"
              >
                <span>Ochish</span>

                <span className="button-arrow">
                  <Arrow />
                </span>
              </button>

              <div className="open-hint">
                <Sparkle />
                <span>tegin va och</span>
                <Sparkle />
              </div>

            </div>

            <div className="under-note">
              <Heart />
              <span>Faqat sen uchun tayyorlandi</span>
              <Heart />
            </div>

          </div>
        )}

        {/* =================================================
            OPENED LETTER
        ================================================= */}

        {opened && (
          <div className="letter-scene">

            <div className="floating-rose rose-one">
              <Rose />
            </div>

            <div className="floating-rose rose-two">
              <Rose />
            </div>

            <div className="floating-rose rose-three">
              <Rose />
            </div>

            <div className="floating-rose rose-four">
              <Rose />
            </div>

            <div className="letter-aura" />

            <article className="letter-card">

              <div className="letter-border" />

              <div className="corner c1" />
              <div className="corner c2" />
              <div className="corner c3" />
              <div className="corner c4" />

              <div className="letter-heading">
                <Sparkle />
                FROM MY HEART
                <Sparkle />
              </div>

              <div className="letter-heart">
                <Heart filled />
              </div>

              <h2>Kechirasanmi?</h2>

              <div className="divider">
                <span />
                <Sparkle />
                <span />
              </div>

              <div className="message">

                <p>
                  Bilaman, balki seni xafa qilgan
                  bo‘lishim mumkin.
                </p>

                <p>
                  Balki ba'zi gaplarim yoki
                  harakatlarim seni ranjitgandir.
                </p>

                <p>
                  Lekin bir narsani chin dildan
                  bilishingni xohlayman:
                </p>

                <p className="highlight">
                  Sen men uchun juda muhimsan.
                </p>

                <p>
                  Sen bilan gaplashish, kulish va
                  oddiygina yoningda bo‘lish ham
                  men uchun alohida.
                </p>

                <p className="closing">
                  Agar xato qilgan bo‘lsam,
                  <br />
                  chin dildan kechir meni.
                </p>

              </div>

              {!forgiven ? (
                <button
                  className="forgive-button"
                  onClick={forgive}
                  type="button"
                >
                  <span>Men seni kechirdim</span>

                  <Heart filled />
                </button>
              ) : (
                <div className="forgiven-box">

                  <div className="big-heart">
                    <Heart filled />
                  </div>

                  <h3>Rahmat...</h3>

                  <p>
                    Endi faqat yana birga kulaylik.
                  </p>

                  <div className="final-divider">
                    <span />
                    <Sparkle />
                    <span />
                  </div>

                </div>
              )}

              <div className="signature">

                <span>
                  Doim seni o‘ylaydigan odamdan
                </span>

                <div className="signature-decoration">
                  <span />
                  <Heart />
                  <span />
                </div>

              </div>

            </article>

          </div>
        )}

      </section>

      <footer className="footer">
        <span>MADE WITH</span>
        <Heart filled />
        <span>JUST FOR YOU</span>
      </footer>

    </main>
  );
}