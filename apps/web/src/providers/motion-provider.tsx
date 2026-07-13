"use client";

import { MotionConfig } from "motion/react";

/**
 * Wraps motion's MotionConfig so every animation in the app automatically respects the
 * visitor's OS-level "reduce motion" preference (reducedMotion="user") - individual
 * components don't need to check this themselves.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
    return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
