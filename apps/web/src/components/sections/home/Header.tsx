import Logo from "@/components/Logo";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Header with logo and primary actions for home page
 */
export default function Header() {
    return (
        <header>
            <div className="container mx-auto flex items-center justify-between py-4 px-6 border-b border-border">
                <Logo size={3} bg={false} />
                <div className="flex items-center space-x-6">
                    <ThemeToggle />

                    <Button
                        variant="secondary"
                        size="md"
                        className="text-xl sm:text-base"
                        href="https://github.com/xpsaroj/ioe-drive/"
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