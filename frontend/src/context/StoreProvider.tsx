"use client"
import { useState } from "react";
import { Provider } from "react-redux";

import { makeStore, AppStore } from "@/lib/store/store";

export function StoreProvider({
    children,
}: {
    children: React.ReactNode
}) {
    // The initializer function only runs once on the very first render
    const [store] = useState<AppStore>(() => makeStore());

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}