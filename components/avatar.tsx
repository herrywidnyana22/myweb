import Image from "next/image";

type AvatarProps = {
    src: string 
    alt: string 
    className?: string
}

export const Avatar  = ({src, alt, className}: AvatarProps) => {
    return ( 
        <Image 
            src={src} 
            alt={alt} 
            height={240} 
            width={240} 
            className={className} 
        />
    );
}