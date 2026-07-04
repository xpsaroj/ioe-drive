import crypto from "node:crypto";
import path from "node:path";

import { BlobSASPermissions } from "@azure/storage-blob";

import { containerClient } from "../lib/azureBlob.js";

export async function uploadToAzure(
    buffer: Buffer,
    filename: string,
    mimeType: string
) {
    const blockBlob = containerClient.getBlockBlobClient(filename);

    await blockBlob.uploadData(buffer, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
        },
    });

    return blockBlob.url;
}

export async function generateBlobName(originalName: string) {
    const ext = path.extname(originalName);
    const random = crypto.randomUUID();
    return `${random}${ext}`;
}

export async function deleteFromAzure(blobName: string) {
    const blockBlob = containerClient.getBlockBlobClient(blobName);
    await blockBlob.deleteIfExists();
}

/**
 * Generates a short-lived, read-only signed (SAS) URL for a blob in our private
 * container, so a client can fetch/download it directly from Azure without our
 * server needing to proxy the file's bytes.
 *
 * Since the blob lives on a different origin than our app, the browser ignores the
 * HTML `download` attribute for it - whether the browser shows the file inline or
 * prompts to save it (and under what filename) is controlled entirely by the
 * Content-Disposition header, which we can override per-URL via `contentDisposition`.
 *
 * @param blobName - Name of the blob to generate a URL for.
 * @param options.expiresInMinutes - How long the URL stays valid (default 15 minutes).
 * @param options.contentDisposition - Overrides the response's Content-Disposition
 *   header, e.g. `inline; filename="notes.pdf"` or `attachment; filename="notes.pdf"`.
 */
export async function generateSasUrl(
    blobName: string,
    options: { expiresInMinutes?: number; contentDisposition?: string } = {}
) {
    const { expiresInMinutes = 15, contentDisposition } = options;
    const blockBlob = containerClient.getBlockBlobClient(blobName);

    return await blockBlob.generateSasUrl({
        permissions: BlobSASPermissions.parse("r"),
        expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
        ...(contentDisposition ? { contentDisposition } : {}),
    });
}