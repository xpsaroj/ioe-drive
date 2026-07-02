import { SignUp } from '@clerk/nextjs'

import { Loader } from '@/components/ui/Loader'

export default function SignUpPage() {
    return (
        <main className="flex justify-center items-center p-10 bg-background">
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