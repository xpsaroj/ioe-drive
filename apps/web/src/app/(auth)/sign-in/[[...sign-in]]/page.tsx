import { SignIn } from '@clerk/nextjs'

import { Loader } from '@/components/ui/Loader'
import { AuthBrandPanel } from '@/components/auth'

export default function SignInPage() {
    return (
        <main className="grid lg:grid-cols-2 min-h-[calc(100vh-4.5rem)] bg-background">
            <AuthBrandPanel variant="sign-in" />

            <div className="flex justify-center items-center p-6 sm:p-10">
                <SignIn
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                    appearance={{
                        elements: {
                            card: "shadow-lg/30",
                        },
                        layout: {
                            socialButtonsPlacement: "bottom",
                        },
                    }}
                    fallback={<SignInFallback />}
                />
            </div>
        </main>
    );
}

const SignInFallback = () => {
    return (
        <div className="w-full max-w-md min-h-[calc(100vh-13rem)] flex items-center justify-center">
            <Loader />
        </div>
    );
};