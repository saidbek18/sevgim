import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";

const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const TAU = Math.PI * 2;

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a, b, amount) {
  return a + (b - a) * amount;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
}

export default function App() {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);

  const animationRef = useRef(null);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const mediaDestinationRef = useRef(null);

  const frequencyDataRef = useRef(null);
  const timeDataRef = useRef(null);

  const imageRef = useRef(null);

  const smoothBassRef = useRef(0);
  const smoothMidRef = useRef(0);
  const smoothHighRef = useRef(0);
  const previousBassRef = useRef(0);

  const watermarkRef = useRef({
    visible: false,
    alpha: 0,
    startedAt: 0,
    nextTime: 12,
  });

  const [screen, setScreen] = useState("intro");

  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioName, setAudioName] = useState("");

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // =========================================================
  // INTRO
  // =========================================================

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScreen("home");
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // =========================================================
  // IMAGE
  // =========================================================

  const handleImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const url = URL.createObjectURL(file);

    setImageFile(file);
    setImagePreview(url);

    const image = new Image();

    image.onload = () => {
      imageRef.current = image;
    };

    image.src = url;
  };

  // =========================================================
  // AUDIO FILE
  // =========================================================

  const handleAudio = (file) => {
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file.");
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const url = URL.createObjectURL(file);

    setAudioFile(file);
    setAudioName(file.name);
    setAudioUrl(url);

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);

    smoothBassRef.current = 0;
    smoothMidRef.current = 0;
    smoothHighRef.current = 0;
    previousBassRef.current = 0;
  };

  // =========================================================
  // GLOBAL AUDIO SOURCE
  // =========================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    audio.src = audioUrl;
    audio.load();

    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [audioUrl]);

  // =========================================================
  // AUDIO EVENTS
  // =========================================================

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0
      );
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    return () => {
      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );
    };
  }, []);

  // =========================================================
  // AUDIO ENGINE
  // =========================================================

  const setupAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return false;
    }

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      alert(
        "Your browser does not support Web Audio API."
      );
      return false;
    }

    // Create audio engine only once.
    if (!audioContextRef.current) {
      const context = new AudioContext();

      const analyser = context.createAnalyser();

      analyser.fftSize = 2048;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.82;

      const source =
        context.createMediaElementSource(audio);

      const mediaDestination =
        context.createMediaStreamDestination();

      source.connect(analyser);

      analyser.connect(context.destination);

      analyser.connect(mediaDestination);

      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
      mediaDestinationRef.current =
        mediaDestination;

      frequencyDataRef.current =
        new Uint8Array(
          analyser.frequencyBinCount
        );

      timeDataRef.current =
        new Uint8Array(
          analyser.fftSize
        );
    }

    if (
      audioContextRef.current.state ===
      "suspended"
    ) {
      await audioContextRef.current.resume();
    }

    return true;
  }, [audioUrl]);

  // =========================================================
  // PLAY
  // =========================================================

  const playAudio = async () => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      alert("First select an audio file.");
      return;
    }

    try {
      const ready = await setupAudio();

      if (!ready) return;

      if (audio.readyState < 2) {
        await new Promise((resolve, reject) => {
          const timeout =
            window.setTimeout(() => {
              cleanup();
              reject(
                new Error(
                  "Audio loading timeout."
                )
              );
            }, 10000);

          const onCanPlay = () => {
            cleanup();
            resolve();
          };

          const onError = () => {
            cleanup();
            reject(
              new Error(
                "Audio could not be loaded."
              )
            );
          };

          const cleanup = () => {
            window.clearTimeout(timeout);

            audio.removeEventListener(
              "canplay",
              onCanPlay
            );

            audio.removeEventListener(
              "error",
              onError
            );
          };

          audio.addEventListener(
            "canplay",
            onCanPlay
          );

          audio.addEventListener(
            "error",
            onError
          );
        });
      }

      await audio.play();

      setIsPlaying(true);
    } catch (error) {
      console.error(
        "PHANTOM AUDIO ERROR:",
        error
      );

      setIsPlaying(false);

      alert(
        "Audio playback failed. Please try another audio file."
      );
    }
  };

  // =========================================================
  // PAUSE
  // =========================================================

  const pauseAudio = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
  };

  // =========================================================
  // STOP
  // =========================================================

  const stopAudio = () => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.pause();

    try {
      audio.currentTime = 0;
    } catch (error) {
      console.error(error);
    }

    setCurrentTime(0);
    setIsPlaying(false);

    smoothBassRef.current = 0;
    smoothMidRef.current = 0;
    smoothHighRef.current = 0;
    previousBassRef.current = 0;
  };

  // =========================================================
  // SEEK
  // =========================================================

  const seekAudio = (event) => {
    const audio = audioRef.current;

    if (!audio || !duration) return;

    const value = Number(event.target.value);

    if (!Number.isFinite(value)) return;

    audio.currentTime = clamp(
      value,
      0,
      duration
    );

    setCurrentTime(audio.currentTime);
  };

  // =========================================================
  // AUDIO ANALYSIS
  // =========================================================

  const getAudioValues = () => {
    const analyser = analyserRef.current;
    const frequencyData =
      frequencyDataRef.current;

    if (!analyser || !frequencyData) {
      return {
        bass: 0,
        mid: 0,
        high: 0,
        bassHit: 0,
      };
    }

    analyser.getByteFrequencyData(
      frequencyData
    );

    const data = frequencyData;

    const bassEnd = Math.max(
      1,
      Math.floor(data.length * 0.08)
    );

    const midStart = bassEnd;

    const midEnd = Math.max(
      midStart + 1,
      Math.floor(data.length * 0.35)
    );

    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;

    for (let i = 0; i < bassEnd; i++) {
      bassSum += data[i];
    }

    for (
      let i = midStart;
      i < midEnd;
      i++
    ) {
      midSum += data[i];
    }

    for (
      let i = midEnd;
      i < data.length;
      i++
    ) {
      highSum += data[i];
    }

    const bass =
      bassSum /
      bassEnd /
      255;

    const mid =
      midSum /
      (midEnd - midStart) /
      255;

    const high =
      highSum /
      Math.max(
        1,
        data.length - midEnd
      ) /
      255;

    const previous =
      previousBassRef.current;

    const bassHit = clamp(
      (bass - previous) * 5
    );

    previousBassRef.current = bass;

    smoothBassRef.current =
      lerp(
        smoothBassRef.current,
        bass,
        0.12
      );

    smoothMidRef.current =
      lerp(
        smoothMidRef.current,
        mid,
        0.1
      );

    smoothHighRef.current =
      lerp(
        smoothHighRef.current,
        high,
        0.14
      );

    return {
      bass: smoothBassRef.current,
      mid: smoothMidRef.current,
      high: smoothHighRef.current,
      bassHit,
    };
  };

  // =========================================================
  // CANVAS: BACKGROUND
  // =========================================================

  const drawBackground = (
    ctx,
    bass,
    bassHit
  ) => {
    ctx.save();

    ctx.fillStyle = "#020202";
    ctx.fillRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    const image = imageRef.current;

    if (!image) {
      ctx.restore();
      return;
    }

    const zoom =
      1.35 +
      bass * 0.08 +
      bassHit * 0.035;

    const scale = Math.max(
      CANVAS_WIDTH / image.width,
      CANVAS_HEIGHT / image.height
    ) * zoom;

    const width = image.width * scale;
    const height = image.height * scale;

    const time =
      performance.now() * 0.001;

    const movement =
      bass * 3 +
      bassHit * 9;

    const x =
      (CANVAS_WIDTH - width) / 2 +
      Math.sin(time * 1.2) *
        movement;

    const y =
      (CANVAS_HEIGHT - height) / 2 +
      Math.cos(time * 0.9) *
        movement;

    ctx.filter = `blur(${
      42 + bass * 14
    }px) brightness(${
      0.11 + bass * 0.04
    })`;

    ctx.globalAlpha = 0.7;

    ctx.drawImage(
      image,
      x,
      y,
      width,
      height
    );

    ctx.filter = "none";
    ctx.globalAlpha = 1;

    const gradient =
      ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        100,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        950
      );

    gradient.addColorStop(
      0,
      "rgba(0,0,0,0.12)"
    );

    gradient.addColorStop(
      0.5,
      "rgba(0,0,0,0.58)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0.97)"
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
      0,
      0,
      CANVAS_WIDTH,
      CANVAS_HEIGHT
    );

    ctx.restore();
  };

  // =========================================================
  // CANVAS: GRID
  // =========================================================

  const drawGrid = (ctx) => {
    ctx.save();

    ctx.globalAlpha = 0.045;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;

    const step = 80;

    for (
      let x = 0;
      x <= CANVAS_WIDTH;
      x += step
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    for (
      let y = 0;
      y <= CANVAS_HEIGHT;
      y += step
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(
        CANVAS_WIDTH,
        y
      );
      ctx.stroke();
    }

    ctx.restore();
  };

  // =========================================================
  // CANVAS: CENTER IMAGE
  // =========================================================

  const drawCenterImage = (
    ctx,
    bass,
    bassHit,
    time
  ) => {
    const image = imageRef.current;

    if (!image) return null;

    const baseRadius = 215;

    const scale =
      1 +
      bass * 0.055 +
      bassHit * 0.045;

    const radius =
      baseRadius * scale;

    const vibration =
      bassHit * 7 +
      bass * 2;

    // IMPORTANT:
    // The artwork NEVER rotates.
    const offsetX =
      Math.sin(time * 0.045) *
      vibration;

    const offsetY =
      Math.cos(time * 0.053) *
      vibration;

    const cx =
      CANVAS_WIDTH / 2 +
      offsetX;

    const cy =
      CANVAS_HEIGHT / 2 +
      offsetY;

    // subtle outer glow
    ctx.save();

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius + 2,
      0,
      TAU
    );

    ctx.shadowColor =
      "rgba(255,255,255,0.25)";

    ctx.shadowBlur =
      30 + bass * 30;

    ctx.strokeStyle =
      "rgba(255,255,255,0.25)";

    ctx.lineWidth = 4;

    ctx.stroke();

    ctx.restore();

    // PERFECT CIRCLE
    ctx.save();

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius,
      0,
      TAU
    );

    ctx.clip();

    const imageScale =
      Math.max(
        (radius * 2) /
          image.width,
        (radius * 2) /
          image.height
      );

    const imageWidth =
      image.width *
      imageScale;

    const imageHeight =
      image.height *
      imageScale;

    ctx.drawImage(
      image,
      cx - imageWidth / 2,
      cy - imageHeight / 2,
      imageWidth,
      imageHeight
    );

    ctx.restore();

    // border
    ctx.save();

    ctx.beginPath();

    ctx.arc(
      cx,
      cy,
      radius,
      0,
      TAU
    );

    ctx.strokeStyle =
      "rgba(255,255,255,0.72)";

    ctx.lineWidth = 2;

    ctx.shadowColor =
      "rgba(255,255,255,0.18)";

    ctx.shadowBlur =
      18 + bass * 15;

    ctx.stroke();

    ctx.restore();

    return {
      cx,
      cy,
      radius,
    };
  };

  // =========================================================
  // CANVAS: DOT RING
  // =========================================================

  const drawDotRing = (
    ctx,
    center,
    bass,
    mid,
    high,
    bassHit
  ) => {
    if (!center) return;

    const frequencyData =
      frequencyDataRef.current;

    const count = 180;

    ctx.save();

    for (let i = 0; i < count; i++) {
      const angle =
        (i / count) * TAU;

      let frequency =
        bass;

      if (frequencyData) {
        const index = Math.floor(
          (i / count) *
            frequencyData.length
        );

        frequency =
          frequencyData[
            Math.min(
              index,
              frequencyData.length - 1
            )
          ] / 255;
      }

      const movement =
        frequency * 17 +
        bass * 8 +
        bassHit * 26;

      const radius =
        center.radius +
        24 +
        movement;

      const x =
        center.cx +
        Math.cos(angle) *
          radius;

      const y =
        center.cy +
        Math.sin(angle) *
          radius;

      const size =
        1.4 +
        frequency * 3 +
        high * 1.3;

      ctx.globalAlpha =
        0.2 +
        frequency * 0.7;

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        size,
        0,
        TAU
      );

      ctx.fill();
    }

    ctx.restore();
  };

  // =========================================================
  // CANVAS: RADIAL SPIKES
  // =========================================================

  const drawRadialVisualizer = (
    ctx,
    center,
    bass,
    mid,
    high,
    bassHit
  ) => {
    if (!center) return;

    const frequencyData =
      frequencyDataRef.current;

    const count = 128;

    ctx.save();

    for (let i = 0; i < count; i++) {
      const angle =
        (i / count) * TAU;

      let frequency = bass;

      if (frequencyData) {
        const index = Math.floor(
          (i / count) *
            frequencyData.length *
            0.7
        );

        frequency =
          frequencyData[
            Math.min(
              index,
              frequencyData.length - 1
            )
          ] / 255;
      }

      const low =
        frequency * 0.72 +
        bass * 0.38;

      const length =
        25 +
        low * 95 +
        bassHit * 75;

      const inner =
        center.radius + 30;

      const outer =
        inner + length;

      const x1 =
        center.cx +
        Math.cos(angle) *
          inner;

      const y1 =
        center.cy +
        Math.sin(angle) *
          inner;

      const x2 =
        center.cx +
        Math.cos(angle) *
          outer;

      const y2 =
        center.cy +
        Math.sin(angle) *
          outer;

      ctx.beginPath();

      ctx.moveTo(x1, y1);

      ctx.lineTo(x2, y2);

      ctx.strokeStyle =
        `rgba(255,255,255,${
          0.12 + low * 0.5
        })`;

      ctx.lineWidth =
        1 +
        low * 1.8;

      ctx.stroke();
    }

    ctx.restore();
  };

  // =========================================================
  // CANVAS: SIDE WAVEFORM
  // =========================================================

  const drawSideWaveform = (
    ctx,
    bass,
    mid,
    high
  ) => {
    const analyser =
      analyserRef.current;

    const timeData =
      timeDataRef.current;

    if (!analyser || !timeData) {
      return;
    }

    analyser.getByteTimeDomainData(
      timeData
    );

    const centerY =
      CANVAS_HEIGHT / 2;

    const startY = 245;
    const endY = 835;

    const samples = 120;

    ctx.save();

    for (
      let side = 0;
      side < 2;
      side++
    ) {
      ctx.beginPath();

      for (
        let i = 0;
        i < samples;
        i++
      ) {
        const t =
          i /
          (samples - 1);

        const y =
          startY +
          t *
            (endY - startY);

        const index =
          Math.floor(
            t *
              (timeData.length - 1)
          );

        const wave =
          (timeData[index] -
            128) /
          128;

        const distance =
          Math.abs(
            y - centerY
          ) /
          (CANVAS_HEIGHT / 2);

        const amplitude =
          55 +
          mid * 75 +
          high * 20;

        const xOffset =
          wave *
          amplitude *
          (0.35 + distance);

        const x =
          side === 0
            ? 300 + xOffset
            : CANVAS_WIDTH -
              300 -
              xOffset;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle =
        "rgba(255,255,255,0.3)";

      ctx.lineWidth = 2;

      ctx.stroke();

      // secondary waveform
      ctx.beginPath();

      for (
        let i = 0;
        i < samples;
        i++
      ) {
        const t =
          i /
          (samples - 1);

        const y =
          startY +
          t *
            (endY - startY);

        const index =
          Math.floor(
            t *
              (timeData.length - 1)
          );

        const wave =
          (timeData[index] -
            128) /
          128;

        const xOffset =
          wave *
          (25 + mid * 35);

        const x =
          side === 0
            ? 270 + xOffset
            : CANVAS_WIDTH -
              270 -
              xOffset;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle =
        "rgba(255,255,255,0.12)";

      ctx.lineWidth = 1;

      ctx.stroke();
    }

    ctx.restore();
  };

  // =========================================================
  // CANVAS: PARTICLES
  // =========================================================

  const drawParticles = (
    ctx,
    center,
    high,
    bassHit,
    time
  ) => {
    if (!center) return;

    ctx.save();

    for (let i = 0; i < 75; i++) {
      const angle =
        (i * 137.5 * Math.PI) /
        180;

      const distance =
        center.radius +
        130 +
        ((i * 53) % 280);

      const pulse =
        Math.sin(
          time * 0.015 + i
        ) * 4;

      const x =
        center.cx +
        Math.cos(angle) *
          (distance + pulse);

      const y =
        center.cy +
        Math.sin(angle) *
          (distance + pulse);

      ctx.globalAlpha =
        0.035 +
        high * 0.18 +
        bassHit * 0.15;

      ctx.fillStyle = "#ffffff";

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        1 + high * 1.7,
        0,
        TAU
      );

      ctx.fill();
    }

    ctx.restore();
  };

  // =========================================================
  // CANVAS: WATERMARK
  // =========================================================

  const drawWatermark = (
    ctx,
    audioTime
  ) => {
    const watermark =
      watermarkRef.current;

    if (
      !watermark.visible &&
      audioTime >= watermark.nextTime
    ) {
      watermark.visible = true;
      watermark.alpha = 0;
      watermark.startedAt = audioTime;
    }

    if (!watermark.visible) {
      return;
    }

    const elapsed =
      audioTime -
      watermark.startedAt;

    if (elapsed < 1) {
      watermark.alpha = elapsed;
    } else if (elapsed < 4) {
      watermark.alpha = 1;
    } else if (elapsed < 5) {
      watermark.alpha =
        1 - (elapsed - 4);
    } else {
      watermark.visible = false;
      watermark.alpha = 0;

      watermark.nextTime =
        audioTime +
        10 +
        Math.random() * 5;

      return;
    }

    ctx.save();

    ctx.globalAlpha =
      watermark.alpha * 0.22;

    ctx.fillStyle = "#ffffff";

    ctx.font =
      "500 15px Arial";

    ctx.fillText(
      "SAIDBEK",
      CANVAS_WIDTH - 160,
      CANVAS_HEIGHT - 55
    );

    ctx.restore();
  };

  // =========================================================
  // RENDER LOOP
  // =========================================================

  const renderFrame = useCallback(
    (timestamp) => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      const ctx =
        canvas.getContext("2d");

      const {
        bass,
        mid,
        high,
        bassHit,
      } = getAudioValues();

      const time =
        timestamp * 0.001;

      ctx.clearRect(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );

      drawBackground(
        ctx,
        bass,
        bassHit
      );

      drawGrid(ctx);

      const center =
        drawCenterImage(
          ctx,
          bass,
          bassHit,
          time
        );

      drawRadialVisualizer(
        ctx,
        center,
        bass,
        mid,
        high,
        bassHit
      );

      drawDotRing(
        ctx,
        center,
        bass,
        mid,
        high,
        bassHit
      );

      drawSideWaveform(
        ctx,
        bass,
        mid,
        high
      );

      drawParticles(
        ctx,
        center,
        high,
        bassHit,
        time
      );

      drawWatermark(
        ctx,
        audioRef.current?.currentTime ||
          0
      );

      animationRef.current =
        requestAnimationFrame(
          renderFrame
        );
    },
    []
  );

  useEffect(() => {
    if (screen !== "visualizer") {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current = null;
      }

      return;
    }

    animationRef.current =
      requestAnimationFrame(
        renderFrame
      );

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current = null;
      }
    };
  }, [screen, renderFrame]);

  // =========================================================
  // GENERATOR
  // =========================================================

  const enterGenerator = () => {
    setScreen("generator");
  };

  const generateVisualizer = async () => {
    if (!imageFile) {
      alert("Please select an image.");
      return;
    }

    if (!audioFile || !audioUrl) {
      alert("Please select an audio file.");
      return;
    }

    try {
      const ready = await setupAudio();

      if (!ready) return;

      setScreen("visualizer");
    } catch (error) {
      console.error(error);

      alert(
        "Could not initialize audio engine."
      );
    }
  };

  // =========================================================
  // EXPORT 1080P
  // =========================================================

  const exportVideo = async () => {
    if (exporting) return;

    const audio =
      audioRef.current;

    const canvas =
      canvasRef.current;

    if (
      !audio ||
      !canvas ||
      !audioUrl ||
      !imageFile
    ) {
      alert(
        "Please select image and audio first."
      );
      return;
    }

    try {
      const ready =
        await setupAudio();

      if (!ready) return;

      const mediaDestination =
        mediaDestinationRef.current;

      if (!mediaDestination) {
        alert(
          "Audio recording is not supported."
        );
        return;
      }

      setExporting(true);
      setExportProgress(0);

      audio.pause();
      audio.currentTime = 0;

      const canvasStream =
        canvas.captureStream(30);

      const audioTracks =
        mediaDestination.stream.getAudioTracks();

      const videoTracks =
        canvasStream.getVideoTracks();

      const stream =
        new MediaStream([
          ...videoTracks,
          ...audioTracks,
        ]);

      let mimeType =
        "video/webm;codecs=vp9,opus";

      if (
        !MediaRecorder.isTypeSupported(
          mimeType
        )
      ) {
        mimeType =
          "video/webm;codecs=vp8,opus";
      }

      if (
        !MediaRecorder.isTypeSupported(
          mimeType
        )
      ) {
        mimeType = "video/webm";
      }

      const recorder =
        new MediaRecorder(
          stream,
          {
            mimeType,
            videoBitsPerSecond:
              10_000_000,
            audioBitsPerSecond:
              192_000,
          }
        );

      const chunks = [];

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          chunks.push(event.data);
        }
      };

      const cleanupTracks = () => {
        videoTracks.forEach((track) =>
          track.stop()
        );
      };

      recorder.onstop = () => {
        cleanupTracks();

        const blob = new Blob(
          chunks,
          {
            type: mimeType,
          }
        );

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "phantom-visualizer-1080p.webm";

        document.body.appendChild(
          link
        );

        link.click();

        link.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);

        setExportProgress(100);
        setExporting(false);
        setIsPlaying(false);
      };

      recorder.onerror = (event) => {
        console.error(
          "MediaRecorder error:",
          event
        );

        cleanupTracks();

        setExporting(false);
        setIsPlaying(false);
      };

      const handleEnded = () => {
        audio.removeEventListener(
          "ended",
          handleEnded
        );

        setExportProgress(100);
        setIsPlaying(false);

        if (
          recorder.state !==
          "inactive"
        ) {
          recorder.stop();
        }
      };

      audio.addEventListener(
        "ended",
        handleEnded
      );

      recorder.start(250);

      await audio.play();

      setIsPlaying(true);

      const updateProgress = () => {
        if (!exporting && !audio.duration) {
          return;
        }

        if (
          audio.duration &&
          !audio.paused
        ) {
          const percent =
            (audio.currentTime /
              audio.duration) *
            100;

          setExportProgress(
            Math.min(
              99,
              Math.floor(percent)
            )
          );

          requestAnimationFrame(
            updateProgress
          );
        }
      };

      updateProgress();
    } catch (error) {
      console.error(
        "EXPORT ERROR:",
        error
      );

      setExporting(false);
      setIsPlaying(false);

      alert(
        "Could not export the video."
      );
    }
  };

  // =========================================================
  // INTRO
  // =========================================================

  const introScreen = (
    <main className="intro-screen">
      <div className="intro-noise" />

      <div className="intro-label">
        PH / 001
      </div>

      <div className="intro-center">
        <div className="intro-small">
          AUDIO EXPERIENCE
        </div>

        <h1>PHANTOM</h1>
      </div>

      <div className="intro-bottom">
        <span>2026</span>
        <span>SYSTEM READY</span>
      </div>
    </main>
  );

  // =========================================================
  // HOME
  // =========================================================

  const homeScreen = (
    <main className="home-screen">
      <div className="home-grid" />

      <div className="corner corner-left">
        PH / 001
      </div>

      <div className="corner corner-right">
        AUDIO
      </div>

      <section className="home-content">
        <div className="eyebrow">
          BASS REACTIVE
          <br />
          AUDIO VISUALIZER
        </div>

        <h1>PHANTOM</h1>

        <p>
          Turn your music into a visual
          experience.
        </p>

        <button
          className="enter-button"
          onClick={enterGenerator}
        >
          <span>
            ENTER VISUALIZER
          </span>

          <span className="arrow">
            ↗
          </span>
        </button>
      </section>

      <div className="home-footer">
        <span>2026</span>
        <span>SYSTEM READY</span>
      </div>
    </main>
  );

  // =========================================================
  // GENERATOR
  // =========================================================

  const generatorScreen = (
    <main className="generator-screen">
      <header className="generator-header">
        <button
          className="brand-button"
          onClick={() =>
            setScreen("home")
          }
        >
          PHANTOM
        </button>

        <span>
          GENERATOR / 001
        </span>
      </header>

      <section className="generator-content">
        <div className="generator-heading">
          <span>
            AUDIO VISUAL EXPERIENCE
          </span>

          <h1>
            BUILD YOUR
            <br />
            PHANTOM.
          </h1>
        </div>

        <div className="upload-grid">
          <label className="upload-box">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) =>
                handleImage(
                  event.target.files?.[0]
                )
              }
            />

            <span className="upload-index">
              01
            </span>

            <div className="upload-main">
              <strong>
                IMAGE
              </strong>

              <small>
                JPG / PNG / WEBP
              </small>
            </div>

            {imagePreview && (
              <div className="preview-wrap">
                <img
                  src={imagePreview}
                  alt="Artwork preview"
                />
              </div>
            )}
          </label>

          <label className="upload-box">
            <input
              type="file"
              accept="audio/*"
              onChange={(event) =>
                handleAudio(
                  event.target.files?.[0]
                )
              }
            />

            <span className="upload-index">
              02
            </span>

            <div className="upload-main">
              <strong>
                AUDIO
              </strong>

              <small>
                MP3 / WAV / OGG
              </small>
            </div>

            {audioName && (
              <div className="audio-file">
                {audioName}
              </div>
            )}
          </label>
        </div>

        <button
          className="generate-button"
          onClick={generateVisualizer}
          disabled={
            !imageFile ||
            !audioFile ||
            !audioUrl
          }
        >
          <span>
            GENERATE VISUALIZER
          </span>

          <span>↗</span>
        </button>
      </section>

      <footer className="generator-footer">
        <span>
          PHANTOM ENGINE
        </span>

        <span>
          1920 × 1080 / 30 FPS
        </span>
      </footer>
    </main>
  );

  // =========================================================
  // VISUALIZER
  // =========================================================

  const visualizerScreen = (
    <main className="visualizer-screen">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="visualizer-canvas"
      />

      <div className="visualizer-top">
        <button
          className="mini-brand"
          onClick={() => {
            pauseAudio();
            setScreen("generator");
          }}
        >
          PHANTOM
        </button>

        <div className="visualizer-status">
          <span
            className={`status-dot ${
              isPlaying
                ? "active"
                : ""
            }`}
          />

          {isPlaying
            ? "AUDIO ACTIVE"
            : "AUDIO PAUSED"}
        </div>
      </div>

      <div className="visualizer-info">
        <span>
          PH / 001
        </span>

        <span>
          1920 × 1080
        </span>
      </div>

      <div className="track-info">
        {audioName ||
          "NO AUDIO"}
      </div>

      <div className="control-panel">
        <button
          className="control-button"
          onClick={
            isPlaying
              ? pauseAudio
              : playAudio
          }
          disabled={!audioUrl}
        >
          {isPlaying
            ? "PAUSE"
            : "PLAY"}
        </button>

        <button
          className="control-button"
          onClick={stopAudio}
          disabled={!audioUrl}
        >
          STOP
        </button>

        <div className="timeline">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={Math.min(
              currentTime,
              duration || 0
            )}
            onChange={seekAudio}
            disabled={!duration}
            style={{
              "--progress": `${
                duration
                  ? (currentTime /
                      duration) *
                    100
                  : 0
              }%`,
            }}
          />

          <div className="time-labels">
            <span>
              {formatTime(
                currentTime
              )}
            </span>

            <span>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <button
          className="export-button"
          onClick={exportVideo}
          disabled={
            !audioUrl ||
            !imageFile ||
            exporting
          }
        >
          {exporting
            ? `EXPORTING ${exportProgress}%`
            : "DOWNLOAD 1080P"}
        </button>
      </div>

      {exporting && (
        <div className="export-overlay">
          <div className="export-box">
            <span>
              PHANTOM EXPORT
            </span>

            <strong>
              EXPORTING{" "}
              {exportProgress}%
            </strong>

            <div className="export-progress">
              <div
                style={{
                  width: `${exportProgress}%`,
                }}
              />
            </div>

            <small>
              1920 × 1080 / 30 FPS
            </small>
          </div>
        </div>
      )}
    </main>
  );

  // =========================================================
  // SELECT SCREEN
  // =========================================================

  let currentScreen = introScreen;

  if (screen === "home") {
    currentScreen = homeScreen;
  }

  if (screen === "generator") {
    currentScreen = generatorScreen;
  }

  if (screen === "visualizer") {
    currentScreen = visualizerScreen;
  }

  // =========================================================
  // FINAL APP
  // =========================================================

  return (
    <>
      {/* IMPORTANT:
          Audio element always exists.
          It is NOT conditionally rendered.
      */}
      <audio
        ref={audioRef}
        preload="auto"
        crossOrigin="anonymous"
      />

      {currentScreen}
    </>
  );
}