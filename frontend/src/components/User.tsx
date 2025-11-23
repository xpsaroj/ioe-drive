import Image from "next/image";
import { User2, ChevronDown } from "lucide-react";

export const User = () => {
    const imageSrc = "/images/home/logo.png";

    return (
        <div className="flex flex-row justify-center items-center gap-2 p-1.5 border border-muted rounded-full">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-muted">
                {
                    imageSrc
                        ? <Image
                            src={imageSrc}
                            alt="User Avatar"
                            fill
                            className="object-cover"
                        />
                        : <User2 className="h-full w-full p-3" />
                }
            </div>

            <div className="flex flex-col">
                <h2 className="text-primary">John Doe</h2>
                <p className="text-secondary text-xs">5th, BCT, Pulchowk</p>
            </div>

            <ChevronDown className="size-5 text-accent" />
        </div>
    );
}