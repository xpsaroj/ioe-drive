import Link from "next/link";

import { features, type Feature } from "@/constants/home";
import Image from "@/components/ImageContainer";

/**
 * Features section showcasing what the site offers
 */
export default function Features() {
    return (
        <section className="bg-background py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl text-foreground font-bold mb-8 text-center">
                    What this site offers?
                </h2>
            </div>

            <div className="container max-w-4xl mx-auto px-6 flex flex-col gap-8 sm:gap-12">
                {features.map((feature, index, arr) => (
                    <FeatureCard
                        key={feature.title + index}
                        feature={feature}
                        index={index}
                        isLast={index === arr.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}

interface FeatureCardProps {
    feature: Feature;
    index: number;
    isLast: boolean;
}

const FeatureCard = ({ feature, index, isLast }: FeatureCardProps) => {
    const { title, description, href, icon: Icon } = feature;

    return (
        <div className={`flex ${index % 2 == 0 ? "flex-row" : "flex-row-reverse"} items-end gap-6`}>
            <Link
                href={href}
                className="group w-full sm:w-7/12 border rounded-lg p-6 transition-all duration-300 hover:scale-[1.05]  hover:border-accent hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <div className="size-10 rounded-md bg-accent-soft flex items-center justify-center mb-3">
                    <Icon className="size-5 text-accent" />
                </div>
                <h3 className="text-xl text-foreground font-semibold mb-2 group-hover:text-accent transition-colors">{title}</h3>
                <p className="text-sm text-foreground-secondary">{description}</p>
            </Link>

            {
                !isLast
                && <div className={`${index % 2 == 0 ? "" : "transform scale-x-[-1]"} -mb-10 hidden sm:block`}>
                    <Image
                        src="/images/home/rounded-arrow.png"
                        alt="Arrow"
                        width={8}
                        height={8}
                    />
                </div>
            }
        </div>
    );
}
