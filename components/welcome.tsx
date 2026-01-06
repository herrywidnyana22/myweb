import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";
import { FONT_WEIGHTS } from "@/lib/constants";
import { useLocalizedText } from "@/hooks/useLocalizedText";

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


export const setHoverText: SetHoverText = (container, type) => {
    if (!container) return;

    const letters = container.querySelectorAll('span');
    const { min, max, base } = FONT_WEIGHTS[type];    

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

  return () =>{
    container.removeEventListener("mousemove", onMouseMove)
    container.removeEventListener("mouseleave", onMouseLeave)
  }
};

export const Welcome = () => {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const subTitleRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { getUIText } = useLocalizedText();

  const welcomeText = getUIText('welcomeText');
  const welcomeTitle = getUIText('welcomeTitle');
  
  useGSAP(
    () => {
      const cleanTitle = setHoverText(titleRef.current, "title");
      const cleanSub = setHoverText(subTitleRef.current, "subtitle");

      return () => {
        cleanTitle?.();
        cleanSub?.();
      };
    },
    [welcomeText, welcomeTitle]
  );

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

  return (
    <section
      ref={sectionRef}
      className="fixed inset-0 flex items-center justify-center select-none overflow-auto px-4 sm:px-6 py-8"
    >
      <div className="w-full max-w-5xl text-center text-gray-200 flex flex-col justify-center gap-2 sm:gap-3 md:gap-4">
        <p
          ref={subTitleRef}
          className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 leading-relaxed"
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
            className="inline-block text-xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-georama italic leading-tight"
          />
        </h1>
      </div>
    </section>
  );
};