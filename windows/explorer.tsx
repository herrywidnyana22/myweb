'use client';

import Image from 'next/image';
import clsx from 'clsx';
import useLocationStore from '@/store/location';
import useWindowStore from '@/store/window';
import useDataStore from '@/store/data';

import { useEffect, useState } from 'react';
import { WindowWrapper } from '@/hoc/windowWrapper';
import { WindowHeader } from '@/components/windowHeader';
import { Search, ChevronLeft } from 'lucide-react';
import { Menu } from '@/components/menu';
import { getLocations } from '@/lib/constants';
import { Tooltip } from '@/components/tooltip';
import { useLocalizedText } from '@/hooks/useLocalizedText';

const ExplorerWindow = () => {
  const { getText, getUIText } = useLocalizedText();
  const { activeLocation, setActiveLocation } = useLocationStore();
  const { openWindow, focusWindow } = useWindowStore();
  const [navigationHistory, setNavigationHistory] = useState<LocationValue[]>(
    []
  );

  // Get dynamic data from store
  const { projects, profiles } = useDataStore();

  // Generate dynamic locations from store data
  const locations = getLocations(projects, profiles);

  // Set default location to project when component mounts or when locations change
  useEffect(() => {
    if (!activeLocation && locations.project) {
      setActiveLocation(locations.project);
    }
  }, [locations.project, activeLocation, setActiveLocation]);

  // Track navigation history
  useEffect(() => {
    if (
      activeLocation &&
      (navigationHistory.length === 0 ||
        navigationHistory[navigationHistory.length - 1]?.id !==
          activeLocation.id)
    ) {
      setNavigationHistory(prev => [...prev, activeLocation]);
    }
  }, [activeLocation]);

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current location
      const previousLocation = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setActiveLocation(previousLocation);
    }
  };

  const canGoBack = navigationHistory.length > 1;

  const openItem = (item: LocationValue) => {
    const fileTypeLowerCase = item.fileType?.toLowerCase();
    const fileKindLowerCase = item.kind?.toLowerCase();
    const fileTypeUpperCase = item.fileType?.toUpperCase();

    // Handle folders (including projects) - navigate into them
    if (fileKindLowerCase === 'folder') {
      setActiveLocation(item);
      return;
    }

    if (fileTypeLowerCase === 'pdf') {
      openWindow('resume');
      focusWindow('resume');
      return;
    }

    if (fileTypeLowerCase === 'project_info') {
      openWindow('projectInfo', item);
      focusWindow('projectInfo');
      return;
    }

    if (fileTypeLowerCase === 'techstack') {
      openWindow('techstack', item);
      focusWindow('techstack');
      return;
    }

    if (fileTypeLowerCase === 'contact') {
      openWindow('contact', item);
      focusWindow('contact');
      return;
    }

    if (['fig', 'url'].includes(fileTypeLowerCase) && item.href) {
      window.open(item.href, '_blank');
      return;
    }

    if (['FIG', 'URL'].includes(fileTypeUpperCase) && item.href) {
      window.open(item.href, '_blank');
      return;
    }

    const key = `${fileTypeLowerCase}${fileKindLowerCase}`;
    openWindow(key, item);
    focusWindow(key);
  };

  return (
    <div className='h-[50vh] overflow-hidden rounded-xl shadow-2xl drop-shadow-2xl'>
      {/* HEADER */}
      <WindowHeader
        target='explorer'
        icon={activeLocation?.icon}
        title={
          (typeof activeLocation?.name === 'string'
            ? getUIText(activeLocation.name)
            : getText(activeLocation.name)) ?? 'Explorer'
        }
        leftContent={
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={clsx(
              'rounded p-1 transition-colors',
              canGoBack
                ? 'cursor-pointer text-gray-600 hover:bg-gray-200'
                : 'cursor-not-allowed text-gray-400 opacity-30'
            )}
            title='Go back'
          >
            <ChevronLeft className='size-4' />
          </button>
        }
        rightContent={
          <Search className='rounded p-1 hover:cursor-default hover:bg-gray-200' />
        }
      />

      {/* BODY */}
      <div className='flex h-full bg-white'>
        {/* LEFT PANEL */}
        <div className='scrollable-panel flex w-48 flex-col space-y-3 overflow-y-auto border-r border-gray-200 bg-gray-50 p-5'>
          <Menu
            title={'favorite'}
            items={Object.values(locations)}
            activeLocation={activeLocation}
            onClick={item => setActiveLocation(item)}
          />
          <Menu
            title={'project'}
            items={locations.project.children}
            activeLocation={activeLocation}
            onClick={item => setActiveLocation(item)}
          />
        </div>

        {/* RIGHT PANEL / CONTENT */}
        <div className='scrollable-panel relative w-[50vw] overflow-y-auto bg-white p-5'>
          <div className='flex flex-wrap content-start items-start gap-4'>
            {activeLocation?.children.map((item: LocationValue) => (
              <Tooltip
                key={item.id}
                label={
                  item.tooltipText
                    ? getText(item.tooltipText)
                    : typeof item.name === 'string'
                      ? item.name
                      : getText(item.name)
                }
              >
                <div
                  key={item.id}
                  onClick={() => openItem(item)}
                  className='w-24'
                >
                  <div className='group flex flex-col items-center justify-start hover:cursor-default'>
                    <div className='relative'>
                      {item.icon && (
                        <Image
                          src={
                            item.kind === 'folder'
                              ? '/icons/folder.png'
                              : item.icon
                          }
                          alt={
                            typeof item.name === 'string'
                              ? item.name
                              : getText(item.name)
                          }
                          width={128}
                          height={128}
                          className='size-10 rounded-t-md object-contain object-center p-1 transition-colors group-hover:bg-orange-100 md:size-12'
                        />
                      )}
                      {item.subIcon && item.kind === 'file' && (
                        <Image
                          src={item.subIcon}
                          alt={getText(item.name)}
                          width={18}
                          height={18}
                          className='absolute right-0.5 bottom-0 size-7 rounded-full border border-white/10 p-0.5 sm:p-1'
                        />
                      )}
                    </div>
                    <p className='w-full truncate rounded-md p-1 text-center text-xs font-light text-gray-600 transition-colors group-hover:bg-orange-100 md:text-sm'>
                      {getText(item.name)}
                    </p>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Explorer = WindowWrapper(ExplorerWindow, 'explorer');
