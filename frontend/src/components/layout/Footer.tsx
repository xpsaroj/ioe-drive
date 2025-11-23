import Link from "next/link";

export default function Footer() {
    return (
        <footer className="footer bg-foreground text-background text-center p-8">
            <div className="flex flex-col sm:flex-row justify-around gap-6 sm:gap-0">
                <div>
                    <p>Developed by: <br /> <span className="font-bold">SS Dev Core</span></p>
                </div>

                <div className="max-w-md text-left">
                    <p>This website is still being built. If you want to contribute in any way please leave message on discord at {" "}
                        <Link
                            href="https://discord.gg/indeed_sunil"
                            className="font-bold"
                        >
                            indeed_sunil
                        </Link>
                        {" or "}
                        <Link
                            href="https://discord.gg/xpsaroj"
                            className="font-bold"
                        >
                            xpsaroj
                        </Link>
                    </p>
                </div>
            </div>

            <div className="pt-6">
                <p>© {new Date().getFullYear()} SS Dev Core. All rights reserved.</p>
            </div>
        </footer>
    );
}