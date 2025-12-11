'use client';

import gsap from "gsap";
import useWindowStore from "@/store/window";

import { ComponentType, useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(Draggable)

export const WindowWrapper = <P extends object>(
  Component: ComponentType<P>,
  windowKey: WindowKey
) => {

  const Wrapper = (props: P) => {

    const { focusWindow, windows } = useWindowStore()
    const { isOpen, zIndex } = windows[windowKey];

    const ref = useRef<HTMLElement | null>(null);

    useGSAP(() => {
        const el = ref.current

        if(!el || !isOpen) return

        el.style.display = 'block'

        gsap.fromTo(
            el, 
            {scale: 0.8, opacity: 0, y: 40},
            {scale: 1, opacity: 1, y:0, duration: 0.2, ease: 'power3.out'}
        )
    }, [isOpen])

    useGSAP(() => {
        const el = ref.current

        if(!el) return

        const [instance] = Draggable.create(
          el,
          {onPress: () => focusWindow(windowKey)}
        )

        return () => instance.kill()
    }, [])

    useLayoutEffect(() => {
        const el = ref.current

        if(!el) return

        el.style.display = isOpen ? 'block' : 'none'
    }, [isOpen])

    return (
      <section
        id={String(windowKey)}
        ref={ref}
        style={{ zIndex }}
        className="absolute"
        onMouseDown={(e) => {
          // Jika mouseDown terjadi bukan di dalam window itu sendiri → block
          if (!isOpen) return; // window belum muncul
          if (e.detail > 1) return; // block double-click event
          focusWindow(windowKey);
        }}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapper.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapper;
};
