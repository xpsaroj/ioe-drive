import Button from "@/components/ui/Button";

/**
 * Hero section with primary call-to-actions for home page
 */
export default function HeroSection() {
    return (
        <section className="bg-gray-100 py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl text-primary font-bold mb-4">A unified digital space for IOE students</h1>
                <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
                    Upload notes, explore study materials, connect with seniors, and trade engineering items with ease.
                </p>
                <p className="text-lg text-secondary/70 mb-8">
                    Powered by students, built for the campus.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Login with Google
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Use without login
                    </Button>
                </div>
            </div>
        </section>
    );
}