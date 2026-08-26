import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const memories = [
  "6–7 yil...",
  "Shuncha vaqt ichida juda ko‘p narsalar o‘zgardi.",
  "Lekin seni qadrlashim o‘zgarmadi.",
];

function App() {
  const [opened, setOpened] = useState(false);
  const [music, setMusic] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (music) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [music]);

  const openEnvelope = () => {
    setOpened(true);

    setTimeout(() => {
      setShowLetter(true);
    }, 1000);
  };

  const toggleMusic = () => {
    setMusic((prev) => !prev);
  };

  return (
    <main className="app">
      <audio ref={audioRef} loop src="/music.mp3" />

      <div className="stars" />
      <div className="moon" />

      <div className="arabic-pattern pattern-one" />
      <div className="arabic-pattern pattern-two" />

      <div className="floating-orb orb-one" />
      <div className="floating-orb orb-two" />

      <button className="music-btn" onClick={toggleMusic}>
        <span className={music ? "sound active" : "sound"}>♫</span>
        {music ? " MUSIQA YOQILDI" : " MUSIQANI YOQISH"}
      </button>

      {!opened ? (
        <section className="landing">
          <div className="intro">
            <span className="arabic-small">إلى دينارا</span>

            <h1>
              D<span>i</span>nara
            </h1>

            <p className="subtitle">
              Ba'zi insonlarni yillar emas,
              <br />
              yurak eslab qoladi.
            </p>

            <div className="years">
              <span>6</span>
              <i>—</i>
              <span>7</span>
              <small>YIL</small>
            </div>
          </div>

          <div
            className={`envelope-wrap ${opened ? "opening" : ""}`}
            onClick={openEnvelope}
          >
            <div className="glow" />

            <div className="envelope">
              <div className="envelope-back" />

              <div className="envelope-paper">
                <div className="paper-decoration">✦</div>

                <p>
                  Dinara,
                  <br />
                  bu xatni shunchaki
                  <br />
                  o‘qib qo‘yishing uchun emas...
                </p>
              </div>

              <div className="envelope-front" />

              <div className="flap">
                <div className="seal">
                  D
                </div>
              </div>
            </div>
          </div>

          <div className="open-hint">
            <span>✦</span>
            Konvertni ochish uchun bosing
            <span>✦</span>
          </div>

          <div className="bottom-note">
            <span>made with sincerity</span>
            <b>♡</b>
          </div>
        </section>
      ) : (
        <section className="letter-page">
          <div className="letter-glow" />

          <div className="letter-card">
            <div className="letter-top">
              <span>✦</span>
              <span>DINARA</span>
              <span>✦</span>
            </div>

            <div className="arabic-line">
              إلى الإنسان الذي لم أنسه
            </div>

            <h2>
              Senga aytilmagan
              <br />
              <em>gaplarim bor.</em>
            </h2>

            <div className="divider">
              <span>◆</span>
            </div>

            <div className="letter-text">
              <p>
                Dinara...
              </p>

              <p>
                Balki bu xatni ochganingda,
                men haqimda o‘ylashni ham
                xohlamayotgandirsan.
              </p>

              <p>
                Balki meni bloklaganing uchun
                o‘zingcha bir sababing bordir.
                Men seni buning uchun ayblamayman.
              </p>

              <p>
                Men faqat bir narsani aytmoqchiman.
              </p>

              <p className="highlight">
                Seni 6–7 yildan beri taniyman.
              </p>

              <p>
                Shu vaqt ichida hayotimizda juda
                ko‘p narsalar bo‘ldi. Kulgan kunlarimiz,
                gaplashgan paytlarimiz, oddiygina
                bir-birimizni tushungan onlarimiz...
              </p>

              <p>
                Balki men hammasini to‘g‘ri qila
                olmagandirman. Balki seni xafa qilgan
                paytlarim ham bo‘lgandir.
              </p>

              <p>
                Lekin men seni hech qachon
                oddiy inson deb ko‘rmaganman.
              </p>

              <p className="big-line">
                Sen men uchun doim alohida
                inson bo‘lib qolding.
              </p>

              <p>
                Arabcha musiqalarni yaxshi ko‘rishing,
                arabcha kiyimlar, raqsga tushishing,
                o‘zingga xosliging...
              </p>

              <p>
                Balki bularning hammasi kichik
                narsalardek tuyular. Lekin men
                seni aynan shundayliging bilan
                eslayman.
              </p>

              <p className="highlight">
                Men sendan hech narsa talab qilmayman.
              </p>

              <p>
                Faqat qachondir bu sahifaga qaytib
                qolsang, shuni bilishingni xohladim:
                seni chin dildan qadrlagan inson
                bo‘lgan.
              </p>

              <p>
                Va bu gaplarni yozishimning sababi —
                seni majburlash emas.
              </p>

              <p className="final">
                Shunchaki yuragimda qolib ketgan
                gaplarni bir marta bo‘lsa ham
                chiroyli qilib aytib qo‘yish.
              </p>
            </div>

            <div className="signature">
              <span>With all sincerity</span>
              <strong>Saidbek</strong>
              <small>♡</small>
            </div>
          </div>

          <div className="memory-strip">
            {memories.map((memory, index) => (
              <div
                className="memory"
                key={index}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {memory}
              </div>
            ))}
          </div>

          <div className="footer-message">
            <span>لا شيء يُنسى بسهولة</span>
            <p>Ba'zi xotiralar shunchaki yo‘qolib ketmaydi.</p>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;
