import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect, useState } from "react";
import { FONT_WEIGHTS } from "@/lib/constants";
import { useLocalizedText } from "@/hooks/useLocalizedText";
import { useLanguage } from "@/contexts/LanguageContext";

const TextRender = ({ text = "", className, weight = 400 }: TextRenderProps) => {
    return text.split("").map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `"wght" ${weight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
 };


// Helper to detect CJK characters (Chinese, Japanese, Korean)
const hasCJKCharacters = (text: string) => {
    return /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/.test(text);
};

export const setHoverText: SetHoverText = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll('span');
    const { min, max, base } = FONT_WEIGHTS[type];
    
    // Check if text contains CJK characters - skip effect if true
    // because Georama font doesn't support CJK and fallback fonts aren't variable
    const textContent = container.textContent || '';
    if (hasCJKCharacters(textContent)) {
        return; // Skip GSAP effect for CJK text
    }    

    const animateLetter = (
        letter: HTMLSpanElement,
        weight: number,
        duration = 0.25
    ) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `"wght" ${weight}`
        });
    };

    const onMouseMove = (e: MouseEvent) => {
        const { left: containerLeft } = container.getBoundingClientRect();
        const mouseX = e.clientX - containerLeft;

        letters.forEach((letter) => {
            const { left: letterLeft, width } = letter.getBoundingClientRect();

            const distance = Math.abs(mouseX - (letterLeft - containerLeft + width / 2));
            const intensity = Math.exp(-(distance ** 2) / 2000);
            const weight = min + (max - min) * intensity
            
            animateLetter(letter, weight);
        });
    };

  const onMouseLeave = () => {
    letters.forEach((letter) => animateLetter(letter, base, 0.3))
  }
  

  container.addEventListener("mousemove", onMouseMove);
  container.addEventListener("mouseleave", onMouseLeave);

  return () => {
    // Kill all GSAP animations on these letters
    letters.forEach((letter) => {
      gsap.killTweensOf(letter);
    });
    
    // Remove event listeners
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("mouseleave", onMouseLeave);
  }
};

export const Welcome = () => {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subTitleRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const { getUIText } = useLocalizedText();

  const welcomeText = getUIText('welcomeText');
  const welcomeTitle = getUIText('welcomeTitle');

  // Prevent hydration mismatch - only render text after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useGSAP(
    () => {
      // Only setup GSAP after component is mounted
      if (!isMounted) return;

      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const cleanTitle = setHoverText(titleRef.current, "title");
        const cleanSub = setHoverText(subTitleRef.current, "subtitle");

        // Store cleanup functions
        return () => {
          clearTimeout(timer);
          cleanTitle?.();
          cleanSub?.();
        };
      }, 100);

      return () => clearTimeout(timer);
    }, [welcomeText, welcomeTitle, isMounted]);

  // Auto-center scroll when content overflows
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const center = () => {
      const visible = el.clientHeight;
      const total = el.scrollHeight;
      if (total > visible) {
        el.scrollTop = Math.round((total - visible) / 2);
      } else {
        el.scrollTop = 0;
      }
    };

    requestAnimationFrame(center);
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, [welcomeText, welcomeTitle]);

  // Prevent hydration mismatch - render placeholder during SSR
  if (!isMounted) {
    return (
      <section
        ref={sectionRef}
        className="fixed inset-0 flex items-center justify-center select-none overflow-auto px-4 sm:px-6 py-8"
      >
        <div className="w-full max-w-5xl text-center text-gray-200 flex flex-col justify-center gap-2 sm:gap-3 md:gap-4">
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed">
            <span className="inline-block text-xs sm:text-sm md:text-base lg:text-lg font-georama opacity-0">
              Loading...
            </span>
          </p>
          <h1>
            <span className="inline-block text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-georama italic leading-tight opacity-0">
              Loading...
            </span>
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 flex items-center justify-center select-none overflow-auto px-4 sm:px-6 py-8"
    >
      <div className="w-full max-w-5xl text-center text-gray-200 flex flex-col justify-center gap-2 sm:gap-3 md:gap-4">
        <p
          ref={subTitleRef}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed"
        >
          <TextRender
            text={welcomeText}
            weight={100}
            className="inline-block text-xs sm:text-sm md:text-base lg:text-lg font-georama"
          />
        </p>

        <h1 ref={titleRef}>
          <TextRender
            text={welcomeTitle}
            className="inline-block text-xl sm:text-3xl md:text-5xl font-georama italic leading-tight"
          />
        </h1>
      </div>
    </section>
  );
};