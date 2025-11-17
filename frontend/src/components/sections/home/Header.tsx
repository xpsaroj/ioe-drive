import Logo from "@/components/Logo";
import Button from "@/components/Button";

/**
 * Header with logo and primary actions for home page
 */
export default function Header() {
    return (
        <header>
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <Logo size={6} />
                <div className="flex space-x-6">
                    <Button
                        variant="secondary"
                        size="md"
                        className="text-xl sm:text-base"
                    >
                        Contribute
                    </Button>

                    <Button
                        variant="primary"
                        size="md"
                        className="text-xl sm:text-base"
                    >
                        Donate
                    </Button>
                </div>
            </div>
        </header>
    );
}