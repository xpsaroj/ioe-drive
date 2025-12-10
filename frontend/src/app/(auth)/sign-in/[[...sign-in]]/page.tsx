import { SignIn } from '@clerk/nextjs'

import { Loader } from '@/components/ui/Loader'

export default function SignInPage() {
    return (
        <main className="flex justify-center items-center p-10 bg-background">
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