import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during server rendering and the initial client render (so hydration
 * output matches exactly), then `true` from the next render onward.
 *
 * Used to defer rendering anything that depends on client-only state we can't know
 * during SSR - most commonly the resolved theme from `next-themes`, which is only
 * known once we're running in the browser (see localStorage / system preference).
 *
 * Implemented with `useSyncExternalStore` (client/server snapshots differ) rather than
 * a `useState` + `useEffect` pair, since setting state synchronously inside an effect
 * body is discouraged (see the `react-hooks/set-state-in-effect` lint rule) - there is
 * no external store to actually subscribe to here, so `subscribe` is a no-op.
 */
export function useMounted(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
}
