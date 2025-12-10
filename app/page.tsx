'use client';

import { useEffect } from 'react';
import { preloadPortfolio } from '@/lib/preloadPortfolio';
import { Resume } from '@/windows/resume';
import { Overlay } from '@/components/home/overlay';
import { BackgroundHome } from '@/components/home/homeBackground';
import { Home } from '@/components/home/Home';
import { Explorer } from '@/windows/explorer';
import { Text } from '@/windows/text';
import { Img } from '@/windows/img';
import { TopBar } from '@/components/topBar';
import { Welcome } from '@/components/welcome';
import { TechStack } from '@/windows/techstack';
import { ProjectInfo } from '@/windows/projectInfo';
import { Contact } from '@/windows/contact';

export default function Page() {
  useEffect(() => {
    preloadPortfolio();
  }, []);


  return (
    <main className='relative min-h-screen w-full overflow-x-hidden overflow-y-auto'>
      <TopBar/>
      <Welcome/>
      <div className="
        px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64 
        py-4 sm:py-10
        pb-24 sm:pb-32
      ">        
        <Contact/>
        <Resume/>
        <ProjectInfo/>
        <TechStack/>
        <Text/>
        <Img/>
        <Explorer/>
        <BackgroundHome/>
        <Overlay/>
        {/* <PageTitle/> */}
        <Home/>
      </div>
    </main>
  );
}
