/** Single source of truth for the site's public identity - reused by the root layout's
 * metadata, robots.ts, and sitemap.ts, so the domain only ever needs to change in one
 * place (the NEXT_PUBLIC_SITE_URL env var). */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ioedrive.vercel.app";
export const SITE_NAME = "IOE Drive";
export const SITE_DESCRIPTION =
    "IOE Drive is a free, student-run platform for Institute of Engineering (IOE), Tribhuvan University students to browse, share, and download notes, past questions, assessments, and other academic resources by program, semester, and subject.";
