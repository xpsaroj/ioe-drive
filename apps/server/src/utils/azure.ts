import crypto from "node:crypto";
import path from "node:path";

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