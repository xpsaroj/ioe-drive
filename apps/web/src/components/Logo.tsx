import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@clerk/nextjs';

interface LogoProps {
    theme: "light" | "dark";
    size?: number;
    bg?: boolean;
}

export default function Logo({
    theme,
    size = 6,
    bg = true,
}: LogoProps) {
    const { isSignedIn } = useAuth();

    const imagePath = `/logo/logo-${theme}${bg ? "" : "-no-bg"}.svg`;

    return (
        <Link href={isSignedIn ? "/dashboard" : "/"}>
            <Image
                src={imagePath}
                alt="IOE Drive Logo"
                preload={true}
                width={size * 16}
                height={size * 16}
            />
        </Link>
    )
}