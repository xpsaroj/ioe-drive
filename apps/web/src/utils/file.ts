export const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes <= 0) return "0 B";

    const units = ["B", "KB", "MB", "GB"];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
};

// Mirrors apps/server/src/storage/file-upload.config.ts - kept in sync manually, the two apps don't share a package.
export const MAX_UPLOAD_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const MAX_FILES_PER_UPLOAD = 5;
export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
]);
export const ACCEPTED_UPLOAD_FILE_EXTENSIONS = ".pdf,.docx,.jpg,.jpeg,.png";

// Splits candidates into ones passing the same rules the backend enforces, and human-readable reasons for the rest.
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
