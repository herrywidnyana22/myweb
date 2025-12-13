'use client'

import Image from 'next/image'
import useWindowStore from '@/store/window'

import { WindowWrapper } from '@/hoc/windowWrapper'
import { WindowControls } from '@/components/windowControls'

const TextWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.txtfile?.data as LocationValue | undefined

    if(!data) return null

    const { name, image, imageUrl, icon, subtitle, description } = data

    return (
        <div className='rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden'>
            <div  className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400">
                <div className="w-24">
                    <WindowControls target={'txtfile'} />
                </div>

                <div className="flex items-center gap-1">
                    {icon && (
                        <div className="size-4 overflow-hidden rounded-md">
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

            <div className="p-6 bg-white text-black max-w-3xl min-w-md">
                { (image || imageUrl) && (
                    <Image
                        src={image || imageUrl}
                        alt={name}
                        width={180}
                        height={180}
                        className="object-cover rounded-4xl mb-4"
                    />
                ) }

                {subtitle && (
                    <p className="text-sm text-gray-600 mb-4">{subtitle}</p>
                )}

                <div className="space-y-3">
                    {Array.isArray(description) && description.map((p: string, idx: number) => (
                        <p key={idx} className="leading-7 text-gray-800">{p}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}

export const Text = WindowWrapper(TextWindow, 'txtfile')
