import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    size?: number;
}

export default function Logo({ size = 6 }: LogoProps) {
    return (
        <Link href="/">
            <Image
                src="/images/home/logo.png"
                alt="IOE Drive Logo"
                width={size * 16}
                height={size * 16}
            />
        </Link>
    )
}