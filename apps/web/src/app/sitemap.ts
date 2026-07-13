import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { SERVER_API_BASE_URL } from "@/lib/server-api-url";

// Regenerate at most once a day - the curriculum this walks (programs, subjects,
// offerings) changes about as rarely as data gets, so there's no need to hit the API
// any more often than this on every crawl.
export const revalidate = 86400;

interface ProgramSummary {
    id: number;
}

interface SubjectOfferingSummary {
    id: number;
}

async function fetchJson<T>(path: string): Promise<T | null> {
    const response = await fetch(`${SERVER_API_BASE_URL}${path}`);
    if (!response.ok) return null;

    const body = await response.json();
    return body.success ? (body.data as T) : null;
}

/** Every subject offering's own detail page (`/offerings/:id`) - the one dynamic,
 * mostly-stable content type that's cheap to enumerate fully (no bulk "all resources"
 * endpoint exists yet, so individual resource pages aren't included here; they're still
 * discoverable by crawlers via normal link-following from these and the browse pages). */
async function fetchAllOfferingIds(): Promise<number[]> {
    const programs = await fetchJson<ProgramSummary[]>("/programs");
    if (!programs) return [];

    const offeringLists = await Promise.all(
        programs.map((program) => fetchJson<SubjectOfferingSummary[]>(`/subjects?programId=${program.id}`)),
    );

    return offeringLists.flatMap((offerings) => offerings?.map((offering) => offering.id) ?? []);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticEntries: MetadataRoute.Sitemap = [
        { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
        { url: `${SITE_URL}/resources`, changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/offerings`, changeFrequency: "monthly", priority: 0.5 },
    ];

    const offeringIds = await fetchAllOfferingIds();
    const offeringEntries: MetadataRoute.Sitemap = offeringIds.map((id) => ({
        url: `${SITE_URL}/offerings/${id}`,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [...staticEntries, ...offeringEntries];
}
