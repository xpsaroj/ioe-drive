import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer bg-background-secondary text-foreground-secondary text-center p-8 border-t">
            <div className="flex flex-col sm:flex-row justify-around gap-6 sm:gap-0">
                <div>
                    <p>Developed by: <br /> <span className="font-bold text-foreground">SS Dev Core</span></p>
                </div>

                <div className="max-w-md text-left">
                    <p>This website is still being built. If you want to contribute in any way please leave message on discord at {" "}
                        <Link
                            href="https://discord.gg/indeed_sunil"
                            className="font-bold text-foreground"
                        >
                            indeed_sunil
                        </Link>
                        {" or "}
                        <Link
                            href="https://discord.gg/xpsaroj"
                            className="font-bold text-foreground"
                        >
                            xpsaroj
                        </Link>.
                    </p>
                </div>
            </div>

            <div className="pt-6">
                <p>© {new Date().getFullYear()} SS Dev Core. All rights reserved.</p>
            </div>
        </footer>
    );
}