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