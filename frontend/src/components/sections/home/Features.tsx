import { features } from "@/constants/home";
import Image from "@/components/ImageContainer";

/**
 * Features section showcasing what the site offers
 */
export default function Features() {
    return (
        <section className="bg-background py-20">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl text-primary font-bold mb-8 text-center">
                    What this site offers?
                </h2>
            </div>

            <div className="container max-w-4xl mx-auto px-6 flex flex-col gap-8 sm:gap-12">
                {features.map((feature, index, arr) => (
                    <FeatureCard
                        key={feature.title + index}
                        title={feature.title}
                        description={feature.description}
                        index={index}
                        isLast={index === arr.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}

interface FeatureCardProps {
    title: string;
    description: string;
    index: number;
    isLast: boolean;
}

const FeatureCard = ({ title, description, index, isLast }: FeatureCardProps) => {
    return (
        <div className={`flex ${index % 2 == 0 ? "flex-row" : "flex-row-reverse"} items-end gap-6`}>
            <div className={`w-full sm:w-7/12 border border-accent rounded-lg p-6 hover:scale-[1.05] hover:shadow-lg transition-all duration-300 cursor-pointer`}>
                <h3 className="text-xl text-golden font-semibold mb-4">{title}</h3>
                <p className="text-secondary">{description}</p>
            </div>

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