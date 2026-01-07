'use client'

import Image from "next/image";
import clsx from "clsx";
import useLocationStore from "@/store/location";
import useWindowStore from "@/store/window";
import useDataStore from "@/store/data";

import { useEffect, useState } from "react";
import { WindowControls } from "@/components/windowControls";
import { WindowWrapper } from "@/hoc/windowWrapper";
import { Search, ChevronLeft } from "lucide-react";
import { Menu } from "@/components/menu";
import { getLocations } from "@/lib/constants";
import { Tooltip } from "@/components/tooltip";
import { useLocalizedText } from "@/hooks/useLocalizedText";

const ExplorerWindow = () => {
    const { getText } = useLocalizedText();
    const { activeLocation, setActiveLocation } = useLocationStore();
    const { openWindow, focusWindow } = useWindowStore();
    const [navigationHistory, setNavigationHistory] = useState<LocationValue[]>([]);
    
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
        if (activeLocation && (navigationHistory.length === 0 || navigationHistory[navigationHistory.length - 1]?.id !== activeLocation.id)) {
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

        console.log("Item:", item)

        const fileTypeLowerCase = item.fileType?.toLowerCase()
        const fileKindLowerCase = item.kind?.toLowerCase()
        const fileTypeUpperCase = item.fileType?.toUpperCase()

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
            window.open(item.href, "_blank");
            return;
        }

        if (['FIG', 'URL'].includes(fileTypeUpperCase) && item.href) {
            window.open(item.href, "_blank");
            return;
        }

        const key = `${fileTypeLowerCase}${fileKindLowerCase}`;
        openWindow(key, item);
        focusWindow(key)
    };

    return ( 
        <div className="h-[50vh] shadow-2xl drop-shadow-2xl overflow-hidden rounded-xl">
            {/* HEADER */}
            <div className="window-header relative flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400 cursor-grab active:cursor-grabbing">
  
                {/* Left */}
                <div className="flex items-center gap-2 z-10">
                    <WindowControls target={'explorer'} />
                    
                    {/* Back Button */}
                    <button
                        onClick={goBack}
                        disabled={!canGoBack}
                        className={clsx(
                            "p-1 rounded transition-colors",
                            canGoBack 
                                ? "hover:bg-gray-200 cursor-pointer text-gray-600" 
                                : "opacity-30 cursor-not-allowed text-gray-400"
                        )}
                        title="Go back"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                </div>

                {/* Center Title */}
                <div className="absolute flex items-center gap-1 left-1/2 -translate-x-1/2 font-semibold text-gray-600">
                    
                    {activeLocation?.icon && (
                        <div className="size-4 overflow-hidden rounded-md">
                            <Image
                                src={activeLocation?.icon}
                                alt="icon"
                                width={32}
                                height={32}
                                className="object-cover size-4"
                            />
                        </div>
                    )}
                    <p>
                        {(typeof activeLocation?.name === 'string' ? activeLocation.name : getText(activeLocation.name)) ?? "Explorer"}
                    </p>
                </div>

                {/* Right */}
                <div className="ml-auto z-10">
                    <Search className="p-1 hover:bg-gray-200 rounded hover:cursor-default" />
                </div>

            </div>

            {/* BODY */}         
            <div className="bg-white flex h-full">
                {/* LEFT PANEL */}         
                <div className="scrollable-panel w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-5 space-y-3 overflow-y-auto">
                    <Menu 
                        title="Favorite"
                        items={Object.values(locations)} 
                        activeLocation={activeLocation}
                        onClick={(item) => setActiveLocation(item)} 
                    />
                    <Menu 
                        title="Work"
                        items={locations.project.children} 
                        activeLocation={activeLocation}
                        onClick={(item) => setActiveLocation(item)} 
                    />
                </div>

                {/* RIGHT PANEL / CONTENT */}
                <div className="scrollable-panel w-[50vw] bg-white relative overflow-y-auto p-5">
                    <div className="flex flex-wrap items-start content-start gap-4">
                        {activeLocation?.children.map((item: LocationValue) => (
                            <Tooltip key={item.id} label={item.tooltipText ? getText(item.tooltipText) : (typeof item.name === 'string' ? item.name : getText(item.name))}>
                                <div
                                    key={item.id}
                                    onDoubleClick={() => openItem(item)}
                                    className="w-24"
                                >
                                    <div className="group flex flex-col items-center justify-start hover:cursor-default">
                                        <div className="relative">
                                            { item.icon && (
                                                <Image
                                                    src={
                                                        item.kind === 'folder' 
                                                        ? '/icons/folder.png'
                                                        : item.icon
                                                    }
                                                    alt={typeof item.name === 'string' ? item.name : getText(item.name)}
                                                    width={128}
                                                    height={128}
                                                    className="size-10 md:size-12 object-contain object-center group-hover:bg-orange-100 transition-colors rounded-t-md p-1"
                                                />
                                            )}
                                            {(item.subIcon && item.kind === 'file') && (
                                                <Image
                                                    src={item.subIcon}
                                                    alt={getText(item.name)}
                                                    width={18}
                                                    height={18}
                                                    className="
                                                        absolute bottom-0 right-0.5
                                                        p-0.5 sm:p-1 
                                                        rounded-full 
                                                        border border-white/10
                                                        size-7
                                                    "
                                                />
                                            )}
                                        </div>
                                        <p className="w-full text-xs md:text-sm text-center font-light text-gray-600 truncate group-hover:bg-orange-100 transition-colors rounded-md p-1">
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
}

export const Explorer = WindowWrapper(ExplorerWindow, "explorer");
