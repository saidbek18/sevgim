import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const messages = [
  {
    side: "them",
    text: "Menimcha, bizga biroz vaqt kerak...",
    time: "23:41",
  },
  {
    side: "me",
    text: "Tushundim.",
    time: "23:42",
  },
  {
    side: "them",
    text: "Kechir...",
    time: "23:43",
  },
];

function App() {
  const [phase, setPhase] = useState(0);
  const [released, setReleased] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouse = (e) => {
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animation;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.35 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y += p.speed;

        if (p.y > canvas.height) {
          p.y = -5;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });

      animation = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const triggerGlitch = () => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 500);
  };

  const release = () => {
    setReleased(true);
    triggerGlitch();
  };

  return (
    <div className={`app ${glitch ? "glitch-active" : ""}`}>
      <canvas ref={canvasRef} className="particles" />

      <div className="cursor-light" />

      <div className="noise" />

      <nav className="nav">
        <div className="logo">
          <span>AFTER</span>
          <small>// 00:00</small>
        </div>

        <div className="nav-links">
          <button onClick={() => scrollTo("#remains")}>01</button>
          <button onClick={() => scrollTo("#messages")}>02</button>
          <button onClick={() => scrollTo("#anger")}>03</button>
          <button onClick={() => scrollTo("#release")}>04</button>
        </div>

        <div className="status">
          <i />
          SYSTEM ONLINE
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-grid" />

          <div className="hero-content">
            <div className="eyebrow">
              <span>PERSONAL ARCHIVE</span>
              <span>08 / 18 / 2026</span>
            </div>

            <h1>
              <span className="line">SHE</span>
              <span className="line outline">LEFT.</span>
            </h1>

            <div className="hero-bottom">
              <p>
                Some people leave.
                <br />
                Some silence stays.
              </p>

              <div className="scroll">
                <span>SCROLL TO REMEMBER</span>
                <div className="scroll-line" />
              </div>
            </div>
          </div>

          <div className="hero-number">001</div>
        </section>

        {/* REMAINS */}
        <section id="remains" className="section remains">
          <div className="section-index">01 / WHAT REMAINS</div>

          <div className="section-main">
            <div className="big-word">
              <span>WHAT</span>
              <span>REMAINS</span>
            </div>

            <div className="quote">
              <div className="quote-mark">“</div>

              <p>
                Ba'zi odamlar hayotingga kiradi.
                <br />
                Keyin ketadi.
                <br />
                Lekin ular qoldirgan jimlik
                <br />
                bir muddat sen bilan qoladi.
              </p>

              <span className="quote-author">— AFTER // ARCHIVE</span>
            </div>
          </div>
        </section>

        {/* MESSAGES */}
        <section id="messages" className="section messages">
          <div className="section-index">02 / NO MORE TEXTS</div>

          <div className="phone-wrap">
            <div className="phone">
              <div className="phone-top">
                <span>9:47</span>
                <span>● ● ●</span>
              </div>

              <div className="chat-header">
                <div className="avatar">?</div>
                <div>
                  <strong>UNKNOWN</strong>
                  <small>last seen recently</small>
                </div>
              </div>

              <div className="chat-body">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.side}`}
                    style={{ animationDelay: `${index * 0.25}s` }}
                  >
                    <span>{message.text}</span>
                    <small>{message.time}</small>
                  </div>
                ))}

                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="deleted">
                  message unavailable
                </div>
              </div>

              <div className="chat-input">
                <span>Message</span>
                <b>↑</b>
              </div>
            </div>
          </div>

          <div className="message-caption">
            <span>CONNECTION LOST</span>
            <strong>NO MORE TEXTS.</strong>
          </div>
        </section>

        {/* ANGER */}
        <section id="anger" className="section anger">
          <div className="section-index">03 / ANGER</div>

          <div className="anger-center">
            <div className="anger-ring ring-one" />
            <div className="anger-ring ring-two" />
            <div className="anger-ring ring-three" />

            <button
              className="anger-word"
              onClick={triggerGlitch}
              data-text="ANGER"
            >
              ANGER
            </button>

            <span className="anger-hint">
              CLICK TO BREAK THE SILENCE
            </span>
          </div>

          <div className="anger-side left">
            I AM NOT
            <br />
            BROKEN.
          </div>

          <div className="anger-side right">
            I AM
            <br />
            CHANGING.
          </div>
        </section>

        {/* RELEASE */}
        <section id="release" className={`section release ${released ? "released" : ""}`}>
          <div className="release-content">
            {!released ? (
              <>
                <div className="section-index">04 / RELEASE</div>

                <h2>
                  LET
                  <br />
                  IT GO.
                </h2>

                <p>
                  You don't need an apology
                  <br />
                  to move forward.
                </p>

                <button className="release-btn" onClick={release}>
                  <span>RELEASE</span>
                  <i>→</i>
                </button>
              </>
            ) : (
              <div className="final-message">
                <div className="final-small">SYSTEM RESET COMPLETE</div>

                <h2>
                  YOU LOST
                  <br />
                  SOMEONE.
                </h2>

                <h3>
                  YOU DIDN'T
                  <br />
                  LOSE YOURSELF.
                </h3>

                <div className="final-line" />

                <span>— SAIDBEK</span>

                <div className="rebuild">
                  <span>REBUILDING...</span>
                  <strong>100%</strong>
                </div>
              </div>
            )}
          </div>
        </section>

        <footer>
          <span>AFTER // 00:00</span>
          <span>END OF ARCHIVE</span>
          <span>© 2026</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
