import React, { useEffect, useState } from "react";
import "./App.css";

const petals = Array.from({ length: 32 }, (_, i) => i);

export default function App() {
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const next = () => {
    setOpened(false);
    setStep((prev) => prev + 1);
  };

  return (
    <div
      className="app"
      style={{
        "--mx": `${mouse.x * 20}px`,
        "--my": `${mouse.y * 20}px`,
      }}
    >
      <div className="aurora aurora1" />
      <div className="aurora aurora2" />
      <div className="moon" />

      <div className="stars">
        {Array.from({ length: 90 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 61) % 100}%`,
              animationDelay: `${(i % 8) * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="petals">
        {petals.map((i) => (
          <i
            key={i}
            style={{
              left: `${(i * 31) % 100}%`,
              animationDelay: `${(i % 12) * 0.45}s`,
              animationDuration: `${7 + (i % 6)}s`,
            }}
          />
        ))}
      </div>

      <div className="counter">
        {String(step + 1).padStart(2, "0")} / 05
      </div>

      {step === 0 && (
        <section className="hero">
          <div className="tiny">A LITTLE SOMETHING FOR</div>

          <div className="name">
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>A</span>
            <span>R</span>
            <span>A</span>
          </div>

          <div className="line" />

          <p className="heroText">
            Ba'zan insonni xursand qilish uchun
            <br />
            katta sabab kerak emas.
          </p>

          <button className="mainButton" onClick={next}>
            <span>BU YERGA BOS</span>
            <b>→</b>
          </button>

          <div className="scrollHint">
            <span />
            davom et
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="content">
          <div className="eyebrow">01 — DINARA</div>

          <h1>
            Bugun seni
            <br />
            <em>tabassum</em> qildirmoqchiman.
          </h1>

          <p>
            Balki kuning unchalik yaxshi o'tmagandir.
            Balki nimadir kayfiyatingni tushirgandir.
            Lekin hozir shu kichkina joyda faqat bitta narsa bor:
          </p>

          <div className="quote">
            <span>“</span>
            <strong>sen.</strong>
            <span>”</span>
          </div>

          <button className="mainButton" onClick={next}>
            DAVOM ET <b>→</b>
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="content envelopeSection">
          <div className="eyebrow">02 — OPEN ME</div>

          <h1>
            Senga
            <br />
            <em>kichkina xat.</em>
          </h1>

          {!opened ? (
            <div
              className="envelope"
              onClick={() => setOpened(true)}
            >
              <div className="envelopeBack" />
              <div className="paper">
                <div>♡</div>
              </div>
              <div className="flap" />
              <div className="envelopeFront" />
              <span>OPEN</span>
            </div>
          ) : (
            <div className="letterCard">
              <div className="letterTop">FOR DINARA ♡</div>

              <p>
                Men seni doim xursand qila olaman deb
                va'da berolmayman.
                <br />
                Lekin seni xafa ko'rsam,
                hech bo'lmasa kayfiyatingni ko'tarishga
                harakat qilaman.
              </p>

              <div className="letterBottom">
                with a little love ✦
              </div>

              <button className="mainButton" onClick={next}>
                YANA BIR NARSA <b>→</b>
              </button>
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="content special">
          <div className="eyebrow">03 — ONE THING</div>

          <div className="giantHeart">♡</div>

          <h1>
            Dinara,
            <br />
            <em>sen juda qadrlisan.</em>
          </h1>

          <p>
            Shuni eslab qo'y.
            Bugungi kayfiyat o'tib ketadi.
            Lekin sening tabassuming yana qaytadi.
          </p>

          <button className="mainButton" onClick={next}>
            OXIRGISI <b>→</b>
          </button>
        </section>
      )}

      {step === 4 && (
        <section className="final">
          <div className="finalGlow" />

          <div className="eyebrow">FOR YOU, DINARA</div>

          <div className="finalName">DINARA</div>

          <div className="finalLine" />

          <h1>
            Endi faqat
            <br />
            <em>tabassum qil.</em>
          </h1>

          <p>
            Men bu saytni mukammal qilish uchun emas,
            <br />
            seni hech bo'lmasa bir soniyaga
            xursand qilish uchun qildim.
          </p>

          <div className="finalHeart">♥</div>

          <div className="signature">
            sen uchun, chin dildan.
          </div>

          <div className="finalHint">
            ✦ END ✦
          </div>
        </section>
      )}
    </div>
  );
}
