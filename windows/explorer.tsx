'use client'

import Image from "next/image";
import useLocationStore from "@/store/location";
import useWindowStore from "@/store/window";

import { WindowControls } from "@/components/windowControls";
import { WindowWrapper } from "@/hoc/windowWrapper";
import { Search } from "lucide-react";
import { Menu } from "@/components/menu";
import { locations } from "@/lib/constants";
import { Tooltip } from "@/components/tooltip";

const ExplorerWindow = () => {
    const { activeLocation, setActiveLocation } = useLocationStore();
    const { openWindow, focusWindow } = useWindowStore()

    const openItem = (item: LocationValue) => {
        if (item.fileType === 'pdf') {
            openWindow('resume');
            focusWindow('resume');
            return;
        }

        if (item.fileType === 'projectInfo') {
            openWindow('projectInfo', item);
            focusWindow('projectInfo');
            return;
        }

        if (item.fileType === 'techstack') {
            openWindow('techstack', item);
            focusWindow('techstack');
            return;
        }

        if (item.fileType === 'contact') {
            openWindow('contact', item);
            focusWindow('contact');
            return;
        }

        if (item.kind === 'folder') {
            setActiveLocation(item);
            return;
        }

        if (['fig', 'url'].includes(item.fileType) && item.href) {
            window.open(item.href, "_blank");
            return;
        }

        const key = `${item.fileType}${item.kind}`;
        openWindow(key, item);
        focusWindow(key)
    };

    return ( 
        <div className="h-[50vh] shadow-2xl drop-shadow-2xl overflow-hidden rounded-xl">
            <div className="relative flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400">
  
                {/* Left */}
                <div className="flex items-center gap-2 z-10">
                    <WindowControls target={'explorer'} />
                </div>

                {/* Center Title */}
                <div className="absolute flex items-center gap-1 left-1/2 -translate-x-1/2 font-semibold text-gray-600">
                    
                    {activeLocation?.subIcon && (
                        <div className="size-4 overflow-hidden rounded-md">
                            <Image
                                src={activeLocation?.subIcon}
                                alt={`${name} icon`}
                                width={32}
                                height={32}
                                className="object-cover size-4"
                            />
                        </div>
                    )}
                    <p>
                        {activeLocation?.name ?? "Explorer"}
                    </p>
                </div>

                {/* Right */}
                <div className="ml-auto z-10">
                    <Search className="p-1 hover:bg-gray-200 rounded hover:cursor-default" />
                </div>

            </div>

            <div className="bg-white flex h-full">
                <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col p-5 space-y-3">
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
                <div className="w-[50vw] bg-white relative overflow-auto p-5">
                    <div className="flex flex-wrap items-start content-start gap-4">
                        {activeLocation?.children.map((item: LocationValue) => (
                            <Tooltip key={item.id} label={item.tooltipText ?? item.name}>
                                <div
                                    key={item.id}
                                    onDoubleClick={() => openItem(item)}
                                    className="w-24"
                                >
                                    <div className="group flex flex-col items-center justify-start hover:cursor-default">
                                        <div className="relative">
                                            <Image
                                                src={item.icon}
                                                alt={item.name}
                                                width={128}
                                                height={128}
                                                className="size-10 md:size-12 object-contain object-center group-hover:bg-orange-100 transition-colors rounded-t-md p-1"
                                            />
                                            {item.subIcon && (
                                                <Image
                                                    src={item.subIcon}
                                                    alt={item.name}
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
                                            {item.name}
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

function focusWindow(key: any) {
    throw new Error("Function not implemented.");
}
