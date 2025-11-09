import clsx from "clsx";
import Image from "next/image";

type PageTitleProps = {
  isWidgetOpen: boolean
  isMinimize: boolean
};

export const PageTitle = ({ isWidgetOpen, isMinimize }: PageTitleProps) => {
  return (
    <header className={isWidgetOpen ? "" : "mb-3 sm:mb-4 lg:mb-6"}>
      <div className="flex items-center justify-center gap-2 sm:gap-4 px-2 sm:px-0">
        {/* Logo */}
        <Image
          src={"/icons/logo.webp"}
          alt="logo icon"
          width={isWidgetOpen ? 60 : 40} 
          height={isWidgetOpen ? 60 : 40}
          className="sm:w-[70px] sm:h-[70px] lg:w-[90px] lg:h-[90px] transition-all duration-300"
        />

        {/* Title */}
        <h1
          className={clsx('font-bold text-white leading-tight sm:leading-snug lg:leading-[1.1] transition-all duration-300',
              !isWidgetOpen
                ? "text-xl sm:text-3xl lg:text-4xl" 
                : "text-2xl sm:text-4xl lg:text-6xl"
            )}
        >
          Herry{" "}
          <span className="relative">
            Page
          </span>
        </h1>
      </div>

      {/* Subtitle — disembunyikan di HP */}
      {!isWidgetOpen || isMinimize && (
        <p className="hidden sm:block text-center text-base sm:text-lg lg:text-xl text-white/80 max-w-xl sm:max-w-2xl mx-auto mt-2 sm:mt-3 lg:mt-4 transition-opacity duration-300">
          Just a guy who loves coding & running 🏃‍♂️💻
        </p>
      )}
    </header>
  );
};
