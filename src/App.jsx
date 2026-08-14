import React, { useEffect, useState } from "react";
import "./App.css";

import saidbek from "./saidbek.jpg";

const skills = [
  "React",
  "JavaScript",
  "HTML / CSS",
  "UI / UX",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMenuOpen(false);
  };

  return (
    <main className="site">

      {/* BACKGROUND */}
      <div className="grain" />
      <div className="background-glow" />

      {/* NAVBAR */}
      <header className="navbar">

        <button className="brand" onClick={() => scrollTo("home")}>
          <span className="brand-symbol">P</span>
          <span>PHANTOM</span>
        </button>

        <nav className={menuOpen ? "nav-open" : ""}>
          <button onClick={() => scrollTo("home")}>
            Bosh sahifa
          </button>

          <button onClick={() => scrollTo("about")}>
            Men haqimda
          </button>

          <button onClick={() => scrollTo("skills")}>
            Ko‘nikmalar
          </button>

          <button onClick={() => scrollTo("contact")}>
            Bog‘lanish
          </button>
        </nav>

        <div className="nav-right">
          <span className="status-dot" />
          <span>{time}</span>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>

      </header>

      {/* HERO */}
      <section id="home" className="hero">

        <div className="hero-left">

          <div className="eyebrow">
            <span />
            FRONTEND DASTURCHI
          </div>

          <h1>
            SAIDBEK
            <br />
            <span>KAMOLOV</span>
          </h1>

          <div className="hero-description">
            <p>
              Men zamonaviy va o‘ziga xos
              <br />
              raqamli interfeyslar yaratishga
              <br />
              qiziqadigan dasturchiman.
            </p>
          </div>

          <button
            className="discover"
            onClick={() => scrollTo("about")}
          >
            <span>MEN HAQIMDA</span>
            <b>↓</b>
          </button>

        </div>

        <div className="hero-photo">

          <div className="photo-frame">
            <img
              src={saidbek}
              alt="Saidbek Kamolov"
            />

            <div className="photo-overlay" />

            <span className="photo-number">
              01
            </span>

            <span className="photo-label">
              SAIDBEK / 2009
            </span>
          </div>

          <div className="photo-side-text">
            PHANTOM — PERSONAL IDENTITY
          </div>

        </div>

        <div className="hero-bottom">

          <span>O‘ZBEKISTON</span>

          <div className="bottom-line">
            <span />
          </div>

          <span>SCROLL TO EXPLORE ↓</span>

        </div>

      </section>

      {/* ABOUT */}
      <section id="about" className="about">

        <div className="section-meta">
          <span>01</span>
          <span>MEN HAQIMDA</span>
        </div>

        <div className="about-content">

          <div className="about-heading">
            <h2>
              MEN
              <br />
              <i>KIMMAN?</i>
            </h2>
          </div>

          <div className="about-text">

            <p className="large-text">
              Men — Saidbek. Dasturlash, dizayn va
              yangi g‘oyalarni birlashtirishni
              yaxshi ko‘raman.
            </p>

            <p>
              Asosan frontend dasturlash bilan
              shug‘ullanaman. React, JavaScript,
              HTML va CSS orqali zamonaviy
              interfeyslar yaratishni o‘rganib
              boryapman.
            </p>

            <p>
              Menga oddiy sayt yaratishdan ko‘ra,
              uning o‘ziga xos ko‘rinishi,
              harakati va kayfiyatini yaratish
              qiziqroq.
            </p>

            <div className="quote">
              <span>“</span>

              <div>
                <p>Kod ishlaydi.</p>
                <p>Dizayn esa his qildiradi.</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* SKILLS */}
      <section id="skills" className="skills">

        <div className="section-meta">
          <span>02</span>
          <span>KO‘NIKMALAR</span>
        </div>

        <div className="skills-heading">
          <h2>
            MENING
            <br />
            <i>VOSITALARIM.</i>
          </h2>

          <p>
            Hozirda o‘rganayotgan va ishlatayotgan
            asosiy texnologiyalarim.
          </p>
        </div>

        <div className="skills-list">

          {skills.map((skill, index) => (
            <div className="skill" key={skill}>

              <span>0{index + 1}</span>

              <h3>{skill}</h3>

              <b>↗</b>

            </div>
          ))}

        </div>

      </section>

      {/* CURRENT */}
      <section className="current">

        <div className="current-card">

          <div className="current-top">
            <span>HOZIRDA</span>

            <span>
              <i />
              FAOL
            </span>
          </div>

          <div className="current-content">

            <h2>
              O‘RGANISH.
              <br />
              <span>YARATISH.</span>
              <br />
              RIVOJLANISH.
            </h2>

            <p>
              Har kuni yangi narsalarni o‘rganish,
              tajriba qilish va o‘zimga xos
              interfeyslar yaratish ustida
              ishlayapman.
            </p>

          </div>

        </div>

      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">

        <div className="section-meta">
          <span>03</span>
          <span>BOG‘LANISH</span>
        </div>

        <div className="contact-content">

          <span className="contact-small">
            MEN BILAN ALOQA
          </span>

          <h2>
            KELING,
            <br />
            <i>GAPLASAMIZ.</i>
          </h2>

          <a
            href="https://t.me/kamolovsaidbek"
            target="_blank"
            rel="noreferrer"
            className="telegram"
          >
            <span>@kamolovsaidbek</span>
            <b>↗</b>
          </a>

        </div>

        <footer>

          <div>
            <strong>PHANTOM</strong>
            <small>PERSONAL PORTFOLIO</small>
          </div>

          <span>
            © 2026 SAIDBEK KAMOLOV
          </span>

          <a
            href="https://t.me/kamolovsaidbek"
            target="_blank"
            rel="noreferrer"
          >
            TELEGRAM
          </a>

        </footer>

      </section>

    </main>
  );
}

export default App;