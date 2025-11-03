import Image from "next/image";

type PageTitleProps = {
  isWidgetOpen: boolean;
}

export const PageTitle = ({isWidgetOpen}: PageTitleProps) => {
  return (
    <header className={isWidgetOpen ? "" : "mb-3 sm:mb-4 lg:mb-6"}>
      
      <div className='flex items-center justify-center gap-4 px-2 sm:px-0'>
        <Image
          src={'/icons/logo.webp'}
          alt="logo icon"
          width={isWidgetOpen ? 80 : 50}
          height={isWidgetOpen ? 80 : 50}
        />
        <h1
          className={`font-bold text-white leading-tight sm:leading-snug lg:leading-[1.1] transition-all duration-300
            ${
              !isWidgetOpen
                ? 'text-2xl sm:text-3xl lg:text-4xl' 
                : 'text-3xl sm:text-4xl lg:text-6xl'
            }`}
        >
          Herry{' '}
          <span className='relative'>
            Page
          </span>
        </h1>

      </div>
      {/* Subtitle */}
      {isWidgetOpen && (
        
        <p className='text-center text-sm sm:text-lg lg:text-xl text-white/80 max-w-xl sm:max-w-2xl mx-auto mt-1 sm:mt-2 lg:mt-3'>
          Just a guy who loves coding & running 🏃‍♂️💻
        </p>
      )}
    </header>
  );
};


