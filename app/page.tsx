'use client';

import useDataStore from '@/store/data';
import { useEffect } from 'react';
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
  const { loadAllData } = useDataStore();

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return (
    <main className='relative min-h-screen w-full overflow-x-hidden overflow-y-auto'>
      <TopBar />
      <Welcome />

      <div className='px-4 py-4 pb-24 sm:px-8 sm:py-10 sm:pb-32 md:px-16 lg:px-32 xl:px-64'>
        <Contact />
        <Resume />
        <ProjectInfo />
        <TechStack />
        <Text />
        <Img />
        <Explorer />
        <BackgroundHome />
        <Overlay />
        <Home />
      </div>
    </main>
  );
}
