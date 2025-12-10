'use client'

import Image from 'next/image'
import useWindowStore from '@/store/window'

import { WindowWrapper } from '@/hoc/windowWrapper'
import { WindowControls } from '@/components/windowControls'

const ImageWindow = () => {
    const { windows } = useWindowStore()
    const data = windows.imgfile?.data as LocationValue | undefined

    if(!data) return null

    const { name, imageUrl, icon } = data

    return (
        <div className='rounded-xl shadow-2xl drop-shadow-2xl overflow-hidden'>
            <div  className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 select-none text-sm text-gray-400">
                <div className="controls-area w-24">
                    <WindowControls target={'imgfile'} />
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

            <div className="p-4 bg-white text-black flex justify-center">
                {imageUrl ? (
                    <div className="max-h-[70vh] overflow-hidden rounded-md">
                        <Image
                            src={imageUrl}
                            alt={name}
                            width={900}
                            height={600}
                            className="object-contain rounded-md"
                        />
                    </div>
                ) : (
                    <p className="text-gray-600">No image available</p>
                )}
            </div>
        </div>
    )
}

export const Img = WindowWrapper(ImageWindow, 'imgfile')
