import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Hls from "hls.js";
import { ArrowRight, Play } from "lucide-react";

export default function HeroSection() {
  const videoRef = useRef(null);
  const videoSrc =
    "https://stream.mux.com/T6oQJQ02cQ6N01TR6iHwZkKFkbepS34dkkIc9iukgy400g.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = videoSrc;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((e) => console.log("Auto-play prevented:", e));
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* ── Background Video ── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          poster="https://images.unsplash.com/photo-1647356191320-d7a1f80ca777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjB0ZWNobm9sb2d5JTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3Njg5NzIyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
        />
      </div>

      {/* ── Video overlay ── */}
      <div className="absolute inset-0 z-[1] bg-black/60 backdrop-blur-[2px]" />

      {/* ── Decorative gradients ── */}
      <div
        className="absolute z-[2] rounded-full mix-blend-screen pointer-events-none"
        style={{
          top: "-20%",
          left: "20%",
          width: 600,
          height: 600,
          background: "rgba(30,58,138,0.2)",
          filter: "blur(120px)",
        }}
      />
      <div
        className="absolute z-[2] rounded-full mix-blend-screen pointer-events-none"
        style={{
          bottom: "-10%",
          right: "20%",
          width: 500,
          height: 500,
          background: "rgba(49,46,129,0.2)",
          filter: "blur(120px)",
        }}
      />

      {/* ── Bottom fade for transition to next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-void to-transparent z-[3] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full flex flex-col items-center text-center mx-auto max-w-5xl px-6 space-y-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm bg-white/5">
            <span className="w-2 h-2 rounded-full bg-[#061745] animate-pulse" />
            <span
              className="text-sm text-text-slate font-medium tracking-wide"
              style={{ fontFamily: "'Instrument Sans', sans-serif" }}
            >
              Behavioral Guard v1.0
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05]"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          <span className="bg-gradient-to-b from-white via-white to-[#7a9cff] bg-clip-text text-transparent">
            Stop Guessing.
          </span>
          <br />
          <span className="bg-gradient-to-b from-white via-white to-[#7a9cff] bg-clip-text text-transparent">
            Start
          </span>
          <span
            className="italic ml-[0.3em] text-[#061745]"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Guarding.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg sm:text-xl leading-relaxed text-white max-w-2xl"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          128% of SIPs stop during market corrections. AstraGuard monitors your
          portfolio and intercepts financial panic before it destroys your future.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          {/* Primary */}
          <Link
            to="/onboard"
            className="bg-[#F5A623] text-black font-bold rounded-full px-8 py-4 flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Extract Financial DNA
            <ArrowRight className="w-5 h-5" />
          </Link>

          {/* Secondary */}
          <button className="group flex items-center gap-3 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer">
            <Play className="w-5 h-5" />
            <span style={{ fontFamily: "'Instrument Sans', sans-serif" }}>
              See Features
            </span>
          </button>
        </motion.div>
      </div>


    </section>
  );
}
