import Image from "@/components/ImageContainer";

interface LogoProps {
    size?: number;
}

export default function Logo({ size = 6 }: LogoProps) {
    return (
        <Image
            src="/images/home/logo.png"
            alt="IOE Drive Logo"
            width={size}
            height={size}
            href="/"
        />
    )
}