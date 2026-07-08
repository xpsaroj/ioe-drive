export const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
};

// Mirrors apps/server/src/middlewares/upload.ts - kept in sync manually since the two
// apps don't share a package. Used to reject bad files client-side before they ever hit
// the network, in both the resource upload form and the edit page's file manager.
export const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 5;
export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
]);
export const ACCEPTED_UPLOAD_FILE_EXTENSIONS = ".pdf,.doc,.docx,.jpg,.jpeg,.png";

/** Splits a batch of candidate files into ones that pass the same rules the backend
 * enforces (type, size, and how many more the target already has room for) and a list
 * of human-readable reasons for the ones that don't. */
export const partitionUploadableFiles = (
    incoming: File[],
    alreadyQueued: number,
) => {
    const accepted: File[] = [];
    const rejected: string[] = [];
    let remaining = MAX_FILES_PER_UPLOAD - alreadyQueued;

    for (const file of incoming) {
        if (remaining <= 0) {
            rejected.push(`${file.name} (max ${MAX_FILES_PER_UPLOAD} files)`);
            continue;
        }
        if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type)) {
            rejected.push(`${file.name} (unsupported file type)`);
            continue;
        }
        if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
            rejected.push(`${file.name} (over 10 MB)`);
            continue;
        }
        accepted.push(file);
        remaining -= 1;
    }

    return { accepted, rejected };
};
