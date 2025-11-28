import Link from "next/link";
import Image from "next/image";
import { useAuth } from '@clerk/nextjs';

interface LogoProps {
    size?: number;
}

export default function Logo({ size = 6 }: LogoProps) {
    const { isSignedIn } = useAuth();

    return (
        <Link href={isSignedIn ? "/dashboard" : "/"}>
            <Image
                src="/images/home/logo.png"
                alt="IOE Drive Logo"
                preload={true}
                width={size * 16}
                height={size * 16}
            />
        </Link>
    )
}