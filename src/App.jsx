import React, { useEffect, useState } from "react";
import "./App.css";

const hearts = Array.from({ length: 24 });

function App() {
  const [doorOpen, setDoorOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [exitAttempt, setExitAttempt] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [fireworks, setFireworks] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!fireworks) return;

    const timer = setTimeout(() => {
      setFireworks(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [fireworks]);

  const openLetter = () => {
    setExitAttempt(false);
    setDoorOpen(true);

    setTimeout(() => {
      setLetterOpen(true);
    }, 900);
  };

  const tryExit = () => {
    if (letterOpen) return;

    setExitAttempt(true);

    // Eshik biroz qimirlaydi, lekin ochilmaydi
    setTimeout(() => {
      setExitAttempt(false);
    }, 900);
  };

  const escapeNo = () => {
    const x = Math.random() * 220 - 110;
    const y = Math.random() * 140 - 70;

    setNoPos({ x, y });
  };

  const accept = () => {
    setAccepted(true);
    setFireworks(true);
  };

  const reset = () => {
    setDoorOpen(false);
    setLetterOpen(false);
    setExitAttempt(false);
    setAccepted(false);
    setFireworks(false);
    setNoPos({ x: 0, y: 0 });
  };

  return (
    <main className="app">
      {/* BACKGROUND */}
      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />

      <div className="stars">
        {Array.from({ length: 45 }).map((_, i) => (
          <span key={i} className="star" />
        ))}
      </div>

      {/* HEARTS */}
      <div className="hearts">
        {hearts.map((_, i) => (
          <span
            key={i}
            className="floating-heart"
            style={{
              "--delay": `${Math.random() * 8}s`,
              "--duration": `${7 + Math.random() * 8}s`,
              "--left": `${Math.random() * 100}%`,
              "--size": `${10 + Math.random() * 14}px`,
            }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* TOP DECORATION */}
      <header className="top">
        <div className="arabic-small">بِسْمِ اللَّهِ</div>
        <div className="top-line" />
        <div className="arabic-small">مَحَبَّة • احْتِرَام • قَدْر</div>
      </header>

      {!letterOpen ? (
        <section className="entrance">
          <div className="intro">
            <p className="eyebrow">A LITTLE MESSAGE</p>
            <h1>Bir daqiqa...</h1>
            <p className="subtitle">
              Sizlar uchun kichkina, lekin chin dildan tayyorlangan narsa bor.
            </p>
          </div>

          {/* DOOR */}
          <div
            className={`door-area ${
              exitAttempt ? "door-shake" : ""
            } ${doorOpen ? "door-open" : ""}`}
          >
            <div className="door-frame">
              <div className="door-glow" />

              <div className="door">
                <div className="door-top-ornament">✦</div>

                <div className="door-panel panel-one">
                  <span>ب</span>
                </div>

                <div className="door-panel panel-two">
                  <span>م</span>
                </div>

                <div className="door-lock">
                  <div className="lock-body">
                    <div className="lock-hole" />
                  </div>
                </div>

                <div className="door-bottom">۞</div>
              </div>
            </div>

            {exitAttempt && (
              <div className="locked-message">
                <span>🔒</span>
                <strong>Eshik qulflangan</strong>
                <small>Avval konvertni oching...</small>
              </div>
            )}
          </div>

          {/* CHOICES */}
          <div className="choices">
            <button className="choice envelope" onClick={openLetter}>
              <span className="choice-icon">✉</span>
              <span>
                <b>Konvertni ochish</b>
                <small>Ichida sizlar uchun xabar bor</small>
              </span>
            </button>

            <button className="choice exit" onClick={tryExit}>
              <span className="choice-icon">⌁</span>
              <span>
                <b>Chiqish</b>
                <small>Bu eshik orqali</small>
              </span>
            </button>
          </div>
        </section>
      ) : (
        <section className="letter-section">
          <div className="letter-glow" />

          <div className="letter">
            <div className="letter-decoration top-decoration">
              <span>﷽</span>
            </div>

            <div className="letter-arabic">
              السلام عليكم
            </div>

            <div className="divider">
              <span>✦</span>
            </div>

            <p className="letter-intro">Sizlarga bir gapim bor...</p>

            <div className="message">
              <p>
                Men sizlarni chin dildan <strong>qadrlayman</strong> va
                hurmat qilaman.
              </p>

              <p>
                Yoshim kichikroq bo‘lishi mumkin, lekin iltimos, meni faqat
                yoshimga qarab baholamanglar.
              </p>

              <p>
                Hayotimdagi ayrim voqealar sababli juda erta ulg‘ayishga
                to‘g‘ri kelgan. Shuning uchun ba'zi narsalarga boshqalardan
                boshqacharoq qarashim mumkin.
              </p>

              <p>
                Men hech kimdan o‘zimni katta ko‘rsatishni yoki boshqalardan
                ustun bo‘lishni istamayman.
              </p>

              <p>
                Faqat meni ham tushunishingizni, fikrlarimga hurmat bilan
                qarashingizni va yoshim sababli meni mensimasligingizni
                istayman.
              </p>

              <p>
                Sizlar bilan bir guruhda bo‘lish men uchun qadrlidir.
              </p>

              <p className="final-message">
                Menga yaxshi muomala qilinglar. 🤍
              </p>

              <p className="strong-final">
                Meni yoshim bilan emas,
                <br />
                fikrim va munosabatim bilan taninglar.
              </p>
            </div>

            <div className="letter-decoration bottom-decoration">
              <span>❈</span>
              <span>۞</span>
              <span>❈</span>
            </div>
          </div>

          {!accepted ? (
            <div className="question">
              <p className="question-small">Birgina savol...</p>
              <h2>Meni tushundingizmi?</h2>

              <div className="answer-area">
                <button className="yes-button" onClick={accept}>
                  HA <span>♡</span>
                </button>

                <button
                  className="no-button"
                  onMouseEnter={escapeNo}
                  onTouchStart={escapeNo}
                  onClick={escapeNo}
                  style={{
                    transform: `translate(${noPos.x}px, ${noPos.y}px)`,
                  }}
                >
                  YO‘Q
                </button>
              </div>
            </div>
          ) : (
            <div className="accepted">
              <div className="success-symbol">✦</div>
              <h2>Rahmat. 🤍</h2>
              <p>
                Sizlarni qadrlayman.
                <br />
                Har doim yaxshi munosabatda bo‘laylik.
              </p>

              <button className="again-button" onClick={reset}>
                ↺ Boshidan ko‘rish
              </button>
            </div>
          )}
        </section>
      )}

      {/* FIREWORKS */}
      {fireworks && (
        <div className="fireworks">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                "--x": `${Math.random() * 100}vw`,
                "--y": `${15 + Math.random() * 60}vh`,
                "--delay": `${Math.random() * 0.8}s`,
              }}
            >
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
          ))}
        </div>
      )}

      {/* CREATOR */}
      <a
        className="creator"
        href="https://t.me/kamolovsaidbek"
        target="_blank"
        rel="noreferrer"
      >
        <span>✦</span>
        YARATUVCHI
        <span>✦</span>
      </a>

      <div className="copyright">
        Made with respect &nbsp;•&nbsp; 2026
      </div>
    </main>
  );
}

export default App;
