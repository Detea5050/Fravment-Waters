import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { 
  ChevronRight, 
  Menu, 
  X,
  ArrowRight,
  Download,
  Share2,
  Heart,
  Instagram,
  Linkedin,
  Music2
} from 'lucide-react';
import { ASSETS } from './constants';


// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const words = ["Purity", "Primordial", "Luxury"];
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev < words.length - 1) return prev + 1;
        clearInterval(wordInterval);
        return prev;
      });
    }, 900);

    let start: number | null = null;
    const duration = 2700;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(nextProgress);

      if (nextProgress < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    };

    requestAnimationFrame(animate);

    return () => clearInterval(wordInterval);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Element 1: Label */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm text-muted uppercase tracking-[0.3em]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        Fravment
      </motion.div>

      {/* Element 2: Rotating Words */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Element 3: Counter */}
      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 text-6xl md:text-8xl lg:text-9xl font-display text-text tabular-nums"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {Math.round(progress).toString().padStart(3, '0')}
      </motion.div>

      {/* Element 4: Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <motion.div
          className="h-full origin-left bg-linear-to-r from-[#89AACC] to-[#4E85BF]"
          style={{ 
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
            scaleX: progress / 100 
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/80 backdrop-blur-lg border-b border-black/5 text-black py-2" 
        : "bg-black/20 backdrop-blur-md border-b border-white/10 text-white py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-display italic font-bold tracking-tighter uppercase">Fravment</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-[10px] font-medium uppercase tracking-widest">
          <a href="#standard" className="hover:opacity-50 transition-opacity">The Standard</a>
          <a href="#commitment" className="hover:opacity-50 transition-opacity">Commitment</a>
          <a href="#origin" className="hover:opacity-50 transition-opacity">The Origin</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`md:hidden absolute top-full left-0 w-full backdrop-blur-lg border-b p-6 flex flex-col gap-4 uppercase tracking-widest text-sm ${
              scrolled 
                ? "bg-white/95 border-black/5 text-black" 
                : "bg-black/90 border-white/10 text-white"
            }`}
          >
            <a href="#standard" onClick={() => setIsOpen(false)}>The Standard</a>
            <a href="#commitment" onClick={() => setIsOpen(false)}>Commitment</a>
            <a href="#origin" onClick={() => setIsOpen(false)}>The Origin</a>
            <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      factor: (Math.random() - 0.5) * 2.2,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      id="essence" 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center pt-14 overflow-hidden"
    >
      {/* Water Droplets */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center text-left">
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-semibold text-white">The Essence</span>
          </div>
          
          <h2 className="text-3xl md:text-6xl font-display italic font-bold tracking-tighter leading-[0.9] mb-4 text-white">
            FRAVMENT <br />
            MINERAL <br />
            WATER
          </h2>
          
          <p className="text-base text-white/70 max-w-md mb-6">
            750ml Non-Carbonated Water. Glass. <br />
            Capturing the purity and enduring quality of Fravment's timeless elegance.
          </p>

          <button 
            onClick={() => document.getElementById('standard')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-all"
          >
            <span className="uppercase tracking-widest text-xs font-bold">Discover More</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Discover = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      factor: (Math.random() - 0.5) * 2.2,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Water Droplets */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-end text-right">
        <div className="flex flex-col items-end">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-white/20">
            <span className="text-xs uppercase tracking-widest font-semibold text-white">The Source</span>
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </div>
          
          <h2 className="text-3xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-4 text-white">
            UNTOUCHED <br />
            BY TIME <br />
            AND MAN
          </h2>
          
          <p className="text-base text-white/70 max-w-md mb-6">
            Deep within the subterranean aquifers of the Al Hajar mountains, Fravment is naturally filtered through volcanic strata for over a millennium. This ancient process results in a mineral profile of unparalleled balance, preserved in its primordial state until the moment of bottling.
          </p>

          <button 
            onClick={() => document.getElementById('origin')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-4 bg-white text-black px-6 py-3 rounded-full hover:bg-white/90 transition-all"
          >
            <span className="uppercase tracking-widest text-xs font-bold">Our Story</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-black rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
};

const Bubble = ({ bubble, mouseX, mouseY }: any) => {
  const moveX = useTransform(mouseX, [-500, 500], [bubble.factor * -150, bubble.factor * 150]);
  const moveY = useTransform(mouseY, [-500, 500], [bubble.factor * -150, bubble.factor * 150]);
  const springX = useSpring(moveX, { damping: 30, stiffness: 60 });
  const springY = useSpring(moveY, { damping: 30, stiffness: 60 });

  return (
    <motion.div
      className="absolute rounded-full bg-black/20 border border-black/30 backdrop-blur-[12px] pointer-events-none z-0 shadow-[0_10px_20px_rgba(0,0,0,0.1),inset_0_2px_6px_rgba(0,0,0,0.2)]"
      style={{
        width: bubble.size,
        height: bubble.size,
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        x: springX,
        y: springY,
      }}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 5 + Math.random() * 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

const FutureOfWater = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 35 + 8,
      factor: (Math.random() - 0.5) * 2.8,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-zinc-100 text-black overflow-hidden flex items-center justify-center py-20"
    >
      {/* Water Droplets */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl md:text-5xl font-display italic font-bold tracking-tighter mb-8 leading-tight">
            The Vanguard of <br />
            Hydration
          </h2>
          <p className="text-base text-gray-600 max-w-md mb-8">
            Fravment is more than water; it is a digital-first lifestyle brand. By joining our inner circle, you gain access to a proprietary ecosystem where physical purity meets digital innovation. We are redefining the relationship between the consumer and the source through blockchain-verified transparency and exclusive member benefits.
          </p>
        </div>

        {/* Right Content - Tilted Phone */}
        <div className="flex justify-center items-center w-full" style={{ perspective: '1200px' }}>
          <div
            className="relative w-full max-w-[300px] md:w-[260px] h-[600px] md:h-[540px] bg-white rounded-[2.5rem] shadow-2xl border-[6px] border-gray-900 overflow-hidden"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <img 
                src={ASSETS.IMAGES.DIGITAL_EXPERIENCE_MOCKUP} 
                alt="Digital Experience" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Subtle glow behind the phone content */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-50/30 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

const PuritySection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      factor: (Math.random() - 0.5) * 2.5,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      id="standard"
      onMouseMove={handleMouseMove}
      className="relative bg-zinc-100 text-black overflow-hidden flex items-center justify-center py-24"
    >
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
        <div className="order-2 md:order-1">
          <img
            src={ASSETS.IMAGES.IMAGE_2}
            alt="Pure Water"
            className="w-full aspect-[4/5] object-cover rounded-3xl shadow-xl"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="order-1 md:order-2">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 block">The Standard</span>
          <h2 className="text-2xl md:text-4xl font-display italic font-bold tracking-tighter mb-6 leading-tight">
            Molecular <br />
            Perfection
          </h2>
          <p className="text-sm text-gray-600 max-w-md mb-8">
            Our water is characterized by a naturally high pH and a rich concentration of essential electrolytes, including Magnesium, Calcium, and Potassium. Every batch undergoes rigorous 12-stage analytical testing to ensure it meets the Fravment Gold Standard—the highest benchmark for mineral water globally.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">8.2</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">pH Level</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">Low</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Sodium</span>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">Rich</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400">Silica</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SustainabilitySection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 10,
      factor: (Math.random() - 0.5) * 2,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      id="commitment"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-zinc-200 text-black overflow-hidden flex items-center justify-center py-20"
    >
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center relative z-10">
        <div className="max-w-3xl">
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 block">Our Commitment</span>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">
            Circular Luxury
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Sustainability is not a feature; it is our foundation. Fravment operates on a closed-loop philosophy, utilizing bespoke flint glass vessels designed for infinite recyclability. Our production facilities are powered by 100% renewable geothermal energy, ensuring that our footprint on the earth is as light as the water we serve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 w-full mt-12">
          {[
            { title: "Infinite", desc: "100% Recyclable Glass" },
            { title: "Zero", desc: "Plastic Waste Policy" },
            { title: "Carbon", desc: "Neutral Production" }
          ].map((item, i) => (
            <div
              key={i}
              className="bg-zinc-50 p-10 rounded-[2rem] shadow-sm border border-black/5"
            >
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WaterCollection = () => {
  const [isToggled, setIsToggled] = useState(false);

  const waterTypes = [
    {
      title: "Still",
      subtitle: "The Purest Form",
      description: "Naturally filtered through volcanic strata, our still water offers a crisp, clean taste that honors its ancient origin.",
      video: "/videos/animate-this-image.mp4",
      image: "",
      height: "h-[350px]"
    },
    {
      title: "Sparkling",
      subtitle: "Refined Effervescence",
      description: "Delicate, fine bubbles that dance on the palate, enhancing the natural mineral profile with a sophisticated lift.",
      video: "/videos/Desertwater.mp4",
      image: "",
      height: "h-[450px]"
    },
    {
      title: "Alkaline",
      subtitle: "Enhanced Balance",
      description: "Ionized to a pH of 9.5+, our alkaline water is designed to support hydration and restore your body's natural equilibrium.",
      video: "/videos/Water animate.mp4",
      image: "",
      height: "h-[400px]"
    },
    {
      title: "Infused",
      subtitle: "Botanical Essence",
      description: "A subtle hint of organic botanicals, cold-pressed to preserve the delicate aromas of nature's finest ingredients.",
      video: "/videos/Watercup.mp4",
      image: "",
      height: "h-[300px]"
    }
  ];

  return (
    <section className={`py-20 transition-colors duration-700 overflow-hidden ${isToggled ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Toggle */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className={`text-[10px] uppercase tracking-[0.3em] font-bold transition-colors ${isToggled ? 'text-zinc-500' : 'text-gray-400'}`}>
              {isToggled ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button 
              onClick={() => setIsToggled(!isToggled)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isToggled ? 'bg-zinc-800 border border-white/10' : 'bg-gray-200'}`}
            >
              <motion.div 
                animate={{ x: isToggled ? 28 : 4 }}
                className={`absolute top-1 w-4 h-4 rounded-full shadow-sm transition-colors ${isToggled ? 'bg-white' : 'bg-white'}`}
              />
            </button>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold tracking-tighter mb-4 max-w-3xl leading-[1.1]">
            There may not be a single switch, <br />
            <span className={isToggled ? 'text-zinc-500' : 'text-gray-400'}>but there are clear steps forward.</span>
          </h2>
          
          <p className={`max-w-xl text-[9px] uppercase tracking-widest font-medium transition-colors ${isToggled ? 'text-zinc-500' : 'text-gray-500'}`}>
            Every path is different. These are the ways we help you <br />
            move forward with confidence.
          </p>
        </div>

        {/* Staggered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          {waterTypes.map((water, i) => (
            <div
              key={i}
              className={`relative ${water.height} group cursor-pointer overflow-hidden rounded-2xl`}
            >
              {/* Background Media */}
              {water.video ? (
                <video
                  src={water.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <img 
                  src={water.image} 
                  alt={water.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{water.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-white/60 font-medium">{water.subtitle}</p>
                </div>
                
                <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <p className="text-xs text-white/80 leading-relaxed">
                    {water.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HeritageSection = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 55 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 5,
      factor: (Math.random() - 0.5) * 3.2,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      id="origin"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-zinc-100 text-black overflow-hidden flex items-center justify-center py-20"
    >
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 block">The Origin</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight">
            The Fravment <br />
            Story
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mb-6 whitespace-pre-line leading-relaxed">
            Every drop tells a story.
            {"\n\n"}
            Fravment Waters was born from a simple belief that pure water should do more than quench thirst; it should refresh the body, restore the mind, and inspire every moment of the day.
            {"\n\n"}
            From carefully selected sources to our commitment to quality and safety, every bottle of Fravment Waters carries freshness, purity, and trust. Whether you’re starting your morning, working through the day, or celebrating life’s moments, Fravment Waters is there clear, crisp, and reliable.
            {"\n\n"}
            Because hydration is not just a need; it’s a lifestyle.
            {"\n\n"}
            <span className="font-bold text-black italic">Fravment Waters Refreshment in every fragment of life.</span>
          </p>
        </div>
        <div className="relative">
          <motion.img
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            src={ASSETS.IMAGES.HERITAGE_SECTION}
            alt="Production factory"
            className="w-full aspect-square object-cover rounded-full shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 rounded-full border-[20px] border-white/20 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Yoga Instructor",
      quote: "I've tried many mineral waters, but Fravment has a unique crispness that really helps me stay hydrated during my long sessions. The glass bottle is a huge plus for me.",
      avatar: "https://picsum.photos/seed/sarah/200"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      quote: "The purity of this water is noticeable. I keep a bottle at my desk all day. It's refreshing and I love the minimalist design of the brand.",
      avatar: "https://picsum.photos/seed/michael/200"
    },
    {
      name: "Elena Rodriguez",
      role: "Interior Designer",
      quote: "As someone who appreciates aesthetics, the Fravment bottle is a work of art. But more importantly, the water tastes incredibly clean and fresh.",
      avatar: "https://picsum.photos/seed/elena/200"
    },
    {
      name: "David Thompson",
      role: "Fitness Coach",
      quote: "Hydration is key to my performance. Fravment provides the perfect mineral balance I need after a tough workout. Highly recommended.",
      avatar: "https://picsum.photos/seed/david/200"
    },
    {
      name: "Sophie Martin",
      role: "Wellness Blogger",
      quote: "I've been sharing Fravment with my community because it aligns perfectly with a clean, sustainable lifestyle. It's the only water I drink now.",
      avatar: "https://picsum.photos/seed/sophie/200"
    },
    {
      name: "James Wilson",
      role: "Architect",
      quote: "The attention to detail in the sourcing and packaging of Fravment is impressive. It's a premium product that actually delivers on its promise.",
      avatar: "https://picsum.photos/seed/james/200"
    },
    {
      name: "Olivia Brown",
      role: "Nutritionist",
      quote: "I always recommend Fravment to my clients. The natural mineral profile is excellent for daily hydration and overall well-being.",
      avatar: "https://picsum.photos/seed/olivia/200"
    },
    {
      name: "Robert Garcia",
      role: "Small Business Owner",
      quote: "We started serving Fravment at our boutique, and our customers love it. It's a small detail that adds a lot of value to their experience.",
      avatar: "https://picsum.photos/seed/robert/200"
    },
    {
      name: "Emily White",
      role: "Graduate Student",
      quote: "It's hard to find a brand that cares about sustainability as much as Fravment. The water is great, and I feel good about the environmental impact.",
      avatar: "https://picsum.photos/seed/emily/200"
    },
    {
      name: "Daniel Lee",
      role: "Photographer",
      quote: "I'm often on the go, and having a reliable, high-quality water like Fravment makes a big difference. It's refreshing and tastes amazing.",
      avatar: "https://picsum.photos/seed/daniel/200"
    }
  ];

  const totalPages = Math.ceil(testimonials.length / 2);

  return (
    <section className="py-24 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Customers Say</h2>
        </div>

        <div className="border-t border-gray-100 pt-16 relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            <AnimatePresence mode="wait">
              {[0, 1].map((offset) => {
                const index = (activeIndex * 2 + offset) % testimonials.length;
                const testimonial = testimonials[index];
                return (
                  <motion.div
                    key={`${activeIndex}-${offset}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex gap-6 md:gap-8"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-md"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                        "{testimonial.quote}"
                      </p>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-black">{testimonial.name}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-16">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "bg-black scale-110" : "bg-gray-200 hover:bg-gray-300"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DigitalExperience = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 8,
      factor: (Math.random() - 0.5) * 3, // Even more movement range
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-zinc-200 text-black overflow-hidden flex items-center justify-center py-20"
    >
      {/* Floating Bubbles with Cursor Reactivity */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 block">Our Water</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight">
            The Digital <br />
            Concierge
          </h2>
          <p className="text-base text-gray-600 max-w-md mb-8">
            Every Fravment bottle is a key. Through our integrated NFC technology, owners gain access to a curated world of high-performance lifestyle events, from Formula 1 Paddock access to private art exhibitions and wellness retreats.
          </p>
          
          <div className="flex flex-col gap-4">
            <div className="h-px w-full bg-gray-200" />
            <div 
              className="flex justify-between items-center py-2 cursor-pointer group"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="font-medium group-hover:text-gray-500 transition-colors">Water Characteristics</span>
              <motion.div animate={{ rotate: isDropdownOpen ? 90 : 0 }}>
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </div>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 space-y-3 text-sm text-gray-500">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold">pH Level</span>
                      <span className="font-bold text-black">8.2</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold">TDS</span>
                      <span className="font-bold text-black">120 mg/l</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Calcium</span>
                      <span className="font-bold text-black">40 mg/l</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Magnesium</span>
                      <span className="font-bold text-black">15 mg/l</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Sodium</span>
                      <span className="font-bold text-black">2.4 mg/l</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="h-px w-full bg-gray-200" />
          </div>
        </div>

        {/* Right Content - 3D Phone */}
        <div className="flex justify-center items-center" style={{ perspective: '1000px' }}>
          <motion.div
            style={{ rotateX, rotateY }}
            className="relative w-[280px] h-[580px] bg-zinc-50 rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden"
          >
            {/* Phone Screen Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white p-8 flex flex-col items-center text-center">
              <div className="w-20 h-1 bg-gray-200 rounded-full mb-12" />
              
              <h3 className="text-2xl font-bold mb-4">Exclusive Access</h3>
              <p className="text-sm text-gray-500 mb-8">
                You have been granted priority allocation for the upcoming Fravment Gold Reserve release. Secure your bottle before the public launch.
              </p>

              <div className="flex flex-col items-center gap-1 mb-8">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Digital experience by</span>
                <span className="text-xs font-bold tracking-[0.2em] uppercase">Fravment</span>
              </div>

              <div className="mt-auto w-full">
                <button 
                  onClick={() => {
                    const el = document.getElementById('contact');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-black text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest mb-6 hover:bg-gray-800 transition-colors"
                >
                  Claim your allocation
                </button>
                
                <div className="flex justify-around items-center text-gray-400">
                  <Heart className="w-5 h-5" />
                  <Download className="w-5 h-5" />
                  <Share2 className="w-5 h-5" />
                  <div className="w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white">
                    <X className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Car "Popping Out" */}
            <motion.img
              src={ASSETS.IMAGES.FORMULA_CAR}
              alt="Formula 1 Car"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] max-w-none z-20 drop-shadow-2xl pointer-events-none"
              style={{
                transform: "translate(-50%, -50%) translateZ(100px) rotate(-15deg)",
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [-15, -13, -15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const BackgroundTransition = ({ scrollYProgress }: { scrollYProgress: any }) => {
  // Subtle zoom effect as you scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-black">
      <motion.div 
        style={{ scale }}
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
      >
        {/* Main overlay for text contrast */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {ASSETS.VIDEOS.WATER_ANIMATION ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover relative z-0"
          >
            <source src={ASSETS.VIDEOS.WATER_ANIMATION} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={ASSETS.IMAGES.BACKGROUND_MAIN} 
            alt="Fravment Background" 
            className="w-full h-full object-cover relative z-0"
            referrerPolicy="no-referrer"
          />
        )}
      </motion.div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, title, message }: { isOpen: boolean; onClose: () => void; title: string; message: string }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-zinc-50 text-black p-8 md:p-12 rounded-[2.5rem] max-w-lg w-full shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <ChevronRight className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tighter mb-4 uppercase">{title}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
            <button
              onClick={onClose}
              className="w-full bg-black text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TeamSection = () => {
  const team = [
    {
      name: "Marvin McKinney",
      role: "Senior Advisor",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Savannah Nguyen",
      role: "Senior Advisor",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "James Wilson",
      role: "Chief Advisor",
      image: "https://plus.unsplash.com/premium_photo-1661766386981-1140b7b37193?w=600&auto=format&fit=crop&q=60"
    },
    {
      name: "Kathryn Murphy",
      role: "Junior Advisor",
      image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <section className="py-32 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <span className="text-xs font-bold text-gray-400 mb-4 block uppercase tracking-wider">The Vanguard</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            The minds behind <br />
            <span className="text-gray-400">the fragment.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
          {team.map((member, i) => (
            <div key={i} className="relative group">
              {/* Card Background */}
              <div className="absolute inset-x-0 bottom-0 h-[70%] bg-white border border-gray-100 rounded-[2rem] shadow-sm group-hover:shadow-md transition-shadow duration-500" />
              
              {/* Content Container */}
              <div className="relative z-10 flex flex-col items-center text-center pb-10">
                {/* Circular Image */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-[6px] border-white shadow-xl mb-6 transform group-hover:scale-105 transition-transform duration-500">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Text */}
                <div className="px-4">
                  <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Subscribe = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [formData, setFormData] = useState({ name: '', email: '', terms: false });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number; factor: number }[]>([]);

  useEffect(() => {
    const newBubbles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      factor: (Math.random() - 0.5) * 2.2,
    }));
    setBubbles(newBubbles);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!formData.terms) {
      setError('Please accept the terms and conditions.');
      return;
    }

    // Success
    setShowModal(true);
    setFormData({ name: '', email: '', terms: false });
  };

  return (
    <section 
      id="contact"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-zinc-200 text-black overflow-hidden flex items-center justify-center py-20"
    >
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        title="Welcome to the Circle" 
        message="Thank you for joining Fravment's inner circle. You will be the first to receive priority allocation for our limited edition releases."
      />

      {/* Water Droplets */}
      {bubbles.map((bubble) => (
        <Bubble key={bubble.id} bubble={bubble} mouseX={mouseX} mouseY={mouseY} />
      ))}

      <div className="max-w-3xl mx-auto px-6 w-full relative z-10 text-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">
            Join the <span className="text-gray-400">Inner Circle.</span>
          </h2>
          <p className="text-base text-gray-600 mb-12">
            Subscribe to receive priority allocation for limited edition releases and invitations to our global digital concierge events.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-8 text-left max-w-xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Your name*</label>
                <input 
                  type="text" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Add your email*</label>
                <input 
                  type="email" 
                  placeholder="Email@youremail.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-300 py-3 focus:border-black outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1.5" 
                checked={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I accept the <span className="underline cursor-pointer">terms</span> and agree to receive their newsletters.
              </label>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full md:w-auto bg-black text-white px-12 py-5 rounded-xl text-sm font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors mt-4 self-center"
            >
              Start your journey
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="relative z-10 bg-zinc-300 text-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Navigation */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-12 text-[11px] font-bold uppercase tracking-[0.2em]">
          <a href="#standard" className="hover:opacity-50 transition-opacity">The Standard</a>
          <a href="#commitment" className="hover:opacity-50 transition-opacity">Commitment</a>
          <a href="#origin" className="hover:opacity-50 transition-opacity">The Origin</a>
          <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-10 mb-12">
          <a href="#" className="hover:scale-110 transition-transform"><Instagram className="w-5 h-5" /></a>
          <a href="#" className="hover:scale-110 transition-transform"><Music2 className="w-5 h-5" /></a>
          <a href="#" className="hover:scale-110 transition-transform"><Linkedin className="w-5 h-5" /></a>
        </div>

        {/* Bottom Grid */}
        <div className="grid md:grid-cols-2 items-end gap-12 border-t border-black/5 pt-12 mb-16">
          {/* Left: Award & Logo */}
          <div className="flex flex-col gap-8">
            <div className="w-20 h-28 border border-black/10 rounded-sm p-3 flex flex-col items-center justify-center text-center gap-0.5 bg-white/50 backdrop-blur-sm shadow-sm">
              <span className="text-[6px] uppercase font-black tracking-tighter">Luxury</span>
              <span className="text-[9px] font-serif italic leading-none">Lifestyle</span>
              <span className="text-[6px] uppercase font-black tracking-tighter">Awards</span>
              <div className="w-full h-[0.5px] bg-black/20 my-1.5" />
              <span className="text-[8px] font-bold tracking-[0.2em]">WINNER</span>
              <span className="text-[8px] font-bold">2011</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tighter uppercase">Fravment</span>
                <span className="text-[8px] uppercase font-bold text-gray-400">®</span>
              </div>
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-500 whitespace-nowrap pt-1">Your next step in water</span>
            </div>
          </div>

          {/* Right: Legal & Credits */}
          <div className="flex flex-col items-end gap-10">
            <div className="flex flex-col items-end gap-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Cookie Preferences</a>
              <a href="#" className="hover:text-black transition-colors">Return Policy</a>
            </div>
          </div>
        </div>

        {/* Copyright - Moved to bottom center */}
        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 text-center leading-relaxed">
          © 2011 Fravment Bottled Water Trading LLC. All rights reserved.
        </div>
        <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-black-400 text-center leading-relaxed">
          This project was Coded by Fronent Developer: AITUAGBOGHIOMWAN DESTINY
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <div 
        ref={containerRef} 
        className="font-sans text-white selection:bg-white selection:text-black bg-black"
        style={{ 
          opacity: isLoading ? 0 : 1, 
          transition: "opacity 0.5s ease-out" 
        }}
      >
        <CustomCursor />
        <Navbar />
        
        {/* Background container that spans Hero and Discover */}
        <div className="relative">
          <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
            <BackgroundTransition scrollYProgress={scrollYProgress} />
          </div>
          
          {/* Content sections that scroll over the sticky background */}
          <div className="relative z-10 -mt-[100vh]">
            <Hero />
            <Discover />
          </div>
        </div>

        <FutureOfWater />
        <PuritySection />
        <SustainabilitySection />
        <WaterCollection />
        <HeritageSection />
        <TestimonialsSection />
        <TeamSection />
        <DigitalExperience />
        <Subscribe />
        <Footer />
      </div>
    </>
  );
}
