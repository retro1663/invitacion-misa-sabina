import { motion, useScroll, useTransform } from "framer-motion";
import candleImg from "@/assets/candle.jpg";
import crossImg from "@/assets/cross.png";
import sabina1 from "@/assets/sabina1.jpeg";
import sabina2 from "@/assets/sabina2.jpeg";
import { Volume2, VolumeX } from "lucide-react";
import musica from "@/assets/musica.mp3";
import { useState, useRef, useEffect } from "react";
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const staggerChildren = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const childFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const Section = ({ children, index, className = "" }: { children: React.ReactNode; index: number; className?: string }) => (
  <motion.div
    custom={index}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={fadeUp}
    className={`flex flex-col items-center text-center px-6 ${className}`}
  >
    {children}
  </motion.div>
);

const Divider = () => (
  <div className="flex items-center justify-center my-6 opacity-70">
    <div className="w-20 h-[1px] bg-gold/40"></div>
    <span className="mx-3 text-gold text-lg">✝</span>
    <div className="w-20 h-[1px] bg-gold/40"></div>
  </div>
);
const FloatingParticle = ({ delay, x, size }: { delay: number; x: string; size: number }) => (
  <motion.div
    className="absolute rounded-full bg-gold-light/20 pointer-events-none"
    style={{ left: x, width: size, height: size }}
    initial={{ y: "100vh", opacity: 0 }}
    animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
    transition={{ duration: 8, delay, repeat: Infinity, ease: "linear" }}
  />
);

const Index = () => {
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const startMusic = async () => {
      if (!audioRef.current) return;

      try {
        await audioRef.current.play();
        setMusicPlaying(true);
      } catch (err) {
        console.log("Autoplay bloqueado hasta interacción");
      }

      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
      window.removeEventListener("wheel", startMusic);
    };

    window.addEventListener("scroll", startMusic);
    window.addEventListener("wheel", startMusic);
    window.addEventListener("click", startMusic);
    window.addEventListener("touchstart", startMusic);

    return () => {
      window.removeEventListener("scroll", startMusic);
      window.removeEventListener("wheel", startMusic);
      window.removeEventListener("click", startMusic);
      window.removeEventListener("touchstart", startMusic);
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setMusicPlaying(!musicPlaying);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden relative">
      {/* Hidden YouTube player */}
      <audio ref={audioRef} loop>
        <source src={musica} type="audio/mpeg" />
      </audio>

      {/* Music toggle button */}
      <motion.button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-md border border-gold/30 flex items-center justify-center text-gold hover:bg-secondary transition-colors shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={musicPlaying ? "Silenciar música" : "Reproducir música"}
      >
        {musicPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </motion.button>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <FloatingParticle delay={0} x="10%" size={4} />
        <FloatingParticle delay={2} x="25%" size={3} />
        <FloatingParticle delay={4} x="50%" size={5} />
        <FloatingParticle delay={1} x="70%" size={3} />
        <FloatingParticle delay={3} x="85%" size={4} />
        <FloatingParticle delay={5} x="40%" size={3} />
        <FloatingParticle delay={6} x="60%" size={4} />
      </div>

      {/* Hero - Candle */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center">
        <motion.div className="absolute inset-0 overflow-hidden" style={{ y: heroY }}>
          <img src={candleImg} alt="Vela encendida" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/20 to-background" />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 flex flex-col items-center gap-6">
          <motion.img
            src={crossImg}
            alt="Cruz"
            className="w-20 md:w-28 drop-shadow-[0_0_30px_hsl(40_65%_65%/0.3)]"
            initial={{ opacity: 0, y: -30, rotateY: 90 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.p
            className="font-display text-xl md:text-2xl text-gold-light tracking-widest uppercase text-center px-4"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.2em" }}
            transition={{ delay: 1, duration: 1.5 }}
          >
            En memoria de quien en vida fue
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-10 z-10"
        >
          <div className="w-5 h-8 border-2 border-gold/30 rounded-full flex justify-center pt-1">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-gold rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto py-16 space-y-24">
        {/* Photos & Name */}
        <Section index={0}>
          <Divider />

          {/* Photo gallery */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 my-8"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={childFade} className="relative group">
              <div className="w-44 h-56 md:w-52 md:h-64 rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_10px_40px_-10px_hsl(40_65%_65%/0.2)]">
                <img src={sabina1} alt="Sabina Mercedes Yaranga Becerra" className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
            </motion.div>
            <motion.div variants={childFade} className="relative group">
              <div className="w-44 h-56 md:w-52 md:h-64 rounded-xl overflow-hidden border-2 border-gold/30 shadow-[0_10px_40px_-10px_hsl(40_65%_65%/0.2)]">
                <img src={sabina2} alt="Sabina Mercedes Yaranga Becerra" className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
            </motion.div>
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-gold mt-4 mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Sabina Mercedes<br />Yaranga Becerra
          </motion.h1>
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-muted-foreground text-lg font-display"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span>🕊️ 24 de septiembre de 1944</span>
            <span className="hidden sm:block text-gold">—</span>
            <span>✝️ 19 de marzo de 2025</span>
          </motion.div>
          <Divider />
        </Section>

        {/* Invitation */}
        <Section index={1}>
          <p className="text-cream text-lg md:text-xl leading-relaxed max-w-lg">
            Al cumplirse el <span className="text-gold font-semibold">primer año</span> de su sensible fallecimiento,
            la familia <span className="text-gold">Vargas Yaranga</span> invita a familiares y amigos
            a acompañarnos en una
          </p>
          <motion.h2
            className="font-display text-3xl md:text-4xl text-gold font-semibold mt-6 mb-2 tracking-wide"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Santa Misa de Honras
          </motion.h2>
          <p className="text-cream text-lg">
            por el eterno descanso de su alma.
          </p>
        </Section>

        {/* Date & Location */}
        <Section index={2} className="gap-6">
          <motion.div
            className="border border-gold/20 rounded-2xl p-8 md:p-10 bg-card/60 backdrop-blur-sm w-full max-w-md shadow-[0_20px_60px_-20px_hsl(40_65%_65%/0.15)]"
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="space-y-5" variants={staggerChildren} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={childFade}>
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Fecha</p>
                <p className="font-display text-3xl text-gold font-semibold">18 de Marzo</p>
              </motion.div>
              <motion.div variants={childFade}>
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Hora</p>
                <p className="font-display text-3xl text-gold font-semibold">4:30 p.m.</p>
              </motion.div>
              <motion.div variants={childFade} className="border-t border-gold/15 pt-5">
                <p className="text-muted-foreground text-sm uppercase tracking-widest mb-1">Lugar</p>
                <p className="text-cream text-lg font-semibold">Pabellón San José II</p>
                <p className="text-muted-foreground">Adelante E-71 – Piso 1</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </Section>

        {/* After Mass */}
        <Section index={3}>
          <p className="text-cream text-lg md:text-xl leading-relaxed max-w-lg">
            Al finalizar la misa, les invitamos cordialmente a acompañarnos en su domicilio:
          </p>
          <motion.p
            className="font-display text-2xl text-gold font-semibold mt-4"
            whileInView={{ textShadow: ["0 0 0px transparent", "0 0 20px hsl(40 65% 65% / 0.3)", "0 0 0px transparent"] }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            Pasaje López – Jesús María
          </motion.p>
        </Section>

        {/* Phrases */}
        <Section index={4} className="gap-12">
          <Divider />
          <motion.blockquote
            className="text-cream text-lg md:text-xl leading-relaxed max-w-lg italic border-l-2 border-gold/30 pl-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            "El dolor de tu partida no puede remediarse, aun sabiendo que vivimos momentos únicos
            y especiales junto a ti. Pero sabemos que, más allá de este mundo, nuestro amor hacia ti
            seguirá y permanecerá eternamente intacto."
          </motion.blockquote>
          <Divider />
          <motion.blockquote
            className="text-cream text-lg md:text-xl leading-relaxed max-w-lg italic border-r-2 border-gold/30 pr-6 text-right"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            "Dios te llamó a su lado para que desde ahí seas la luz que ilumine nuestros caminos."
          </motion.blockquote>
          <Divider />
          <motion.blockquote
            className="text-cream text-lg md:text-xl leading-relaxed max-w-lg italic border-l-2 border-gold/30 pl-6 text-left"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            "Gracias por todo el cariño y alegría que nos diste.
            Te recordaremos siempre, mientras esperamos el momento
            en el que nos podamos reunir de nuevo."
          </motion.blockquote>
          <Divider />
        </Section>

        {/* Gratitude */}
        <Section index={5}>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed">
            En nombre de la familia <span className="text-gold">Vargas Yaranga</span>,
            queremos expresar nuestro más sincero agradecimiento por acompañarnos
            en esta misa en memoria de nuestra Madre.
          </p>
          <motion.img
            src={crossImg}
            alt=""
            className="w-12 opacity-30 mt-8"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <p className="font-display text-sm text-muted-foreground tracking-[0.3em] uppercase mt-4">
            Familia Vargas Yaranga
          </p>
        </Section>
      </div>

      {/* Footer spacer */}
      <div className="h-20" />
    </div>
  );
};

export default Index;
