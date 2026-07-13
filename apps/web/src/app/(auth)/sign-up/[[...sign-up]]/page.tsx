import { SignUp } from '@clerk/nextjs'

import { Loader } from '@/components/ui/Loader'
import { AuthBrandPanel } from '@/components/auth'

export default function SignUpPage() {
    return (
        <main className="grid lg:grid-cols-2 min-h-[calc(100vh-4.5rem)] bg-background">
            <AuthBrandPanel variant="sign-up" />

            <div className="flex justify-center items-center p-6 sm:p-10">
                <SignUp
                    path="/sign-up"
                    routing="path"
                    signInUrl="/sign-in"
                    appearance={{
                        elements: {
                            card: "shadow-lg/30",
                        },
                        layout: {
                            socialButtonsPlacement: "bottom",
                        },
                    }}
                    fallback={<SignUpFallback />}
                />
            </div>
        </main>
    );
}

const SignUpFallback = () => {
    return (
        <div className="w-full max-w-md min-h-[calc(100vh-13rem)] flex items-center justify-center">
            <Loader />
        </div>
    );
};