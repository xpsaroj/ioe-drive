import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines tailwind classes and merges conflicts
 * (Last one defined in the arguments wins)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}