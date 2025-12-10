import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { FONT_WEIGHTS } from "@/lib/constants";
import { useAppStore } from "@/store/app";
import { baseUIText } from "@/lib/constants/baseUIText";

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

  const { ui, language } = useAppStore();

  const welcomeText = ui?.welcomeText ?? baseUIText.welcomeText;
  const welcomeTitle = ui?.welcomeTitle ?? baseUIText.welcomeTitle;

  useGSAP(() => {
    const cleanTitle = setHoverText(titleRef.current, "title");
    const cleanSub = setHoverText(subTitleRef.current, "subtitle");

    return () => {
      cleanTitle?.();
      cleanSub?.();
    };
  }, [welcomeText, welcomeTitle, language])

  return (
    <section className="text-gray-200 flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none max-sm:h-screen max-sm:w-full max-sm:px-10">
      <p
        ref={subTitleRef}
        className="flex-1 text-[16px] text-center font-roboto text-gray-400"
      >
        <TextRender
          text={welcomeText}
          weight={100}
          className="text-xl font-georama"
        />
      </p>

      <h1 ref={titleRef} className="mt-7">
        <TextRender
          text={welcomeTitle}
          className="text-7xl font-georama italic"
        />
      </h1>
    </section>
  );
};