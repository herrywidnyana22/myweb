'use client'

import Image from 'next/image'
import useWindowStore from '@/store/window'

import { WindowWrapper } from '@/hoc/windowWrapper'
import { WindowControls } from '@/components/windowControls'
import { Icon } from '@/components/icon'
import { ProgressCircle } from '@/components/charts/circleProgress'
import { BarProgressChart } from '@/components/charts/barProgress'

const ProjectInfoWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.projectInfo?.data as LocationValue | undefined

    if(!data) return null

    const { projectName, name, techStack, projectIcon, icon, description, progressValue } = data

    return (
        <div className='rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden'>
            <div  className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400">
                <div className="w-24">
                    <WindowControls target={'projectInfo'} />
                </div>

                <div className="flex items-center gap-1">
                    {icon && (
                        <div className="size-4 overflow-hidden">
                            <Image
                                src={icon}
                                alt={`${name} icon`}
                                width={32}
                                height={32}
                                className="object-cover size-4"
                            />
                        </div>
                    )}

                    <h2 className="text-center">{name}</h2>
                </div>

                <div className="w-24" />
            </div>

            <div className="space-y-4 p-6 bg-white text-black max-w-3xl min-w-md">
                <div className="absolute right-12 top-16 sm:float-right sm:ml-3">
                    <ProgressCircle 
                        value={progressValue} 
                        label="Progress" 
                    />
                </div>
                <div className="flex items-center gap-3 mb-4">
                    { projectIcon && (
                        <Image
                            src={projectIcon}
                            alt={`${projectName} icon`}
                            width={128}
                            height={128}
                            className="size-20"
                        />
                    )}

                    <p className='font-semibold'>{projectName}</p>
                </div>


                <div className="space-y-3">
                    {Array.isArray(description) && description.map((p: string, idx: number) => (
                        <p key={idx} className="leading-7 text-gray-800">{p}</p>
                    ))}
                </div>
                <div className='flex flex-wrap gap-2 sm:gap-3'>
                    {techStack.map((icon: IconCategoryProps, idx: number) => (
                        <Icon
                            key={idx}
                            tooltipLabel={icon.label}
                            src={icon.src}
                            size={18}
                            className="
                                bg-gray-900/10 sm:bg-gray-900/20 
                                p-0.5 sm:p-1 
                                rounded-full 
                                border border-white/10
                            "
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ProjectInfo = WindowWrapper(ProjectInfoWindow, 'projectInfo')
