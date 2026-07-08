import crypto from "node:crypto";
import path from "node:path";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BlobSASPermissions, BlobServiceClient, type ContainerClient } from "@azure/storage-blob";

/** Wraps Azure Blob Storage access as an injectable provider. */
@Injectable()
export class AzureBlobService {
  private readonly containerClient: ContainerClient;

  constructor(configService: ConfigService) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      configService.getOrThrow<string>("AZURE_STORAGE_CONNECTION_STRING"),
    );

    this.containerClient = blobServiceClient.getContainerClient(
      configService.getOrThrow<string>("AZURE_STORAGE_CONTAINER"),
    );
  }

  generateBlobName(originalName: string): string {
    const ext = path.extname(originalName);
    return `${crypto.randomUUID()}${ext}`;
  }

  async upload(buffer: Buffer, blobName: string, mimeType: string): Promise<string> {
    const blockBlob = this.containerClient.getBlockBlobClient(blobName);

    await blockBlob.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return blockBlob.url;
  }

  async delete(blobName: string): Promise<void> {
    const blockBlob = this.containerClient.getBlockBlobClient(blobName);
    await blockBlob.deleteIfExists();
  }

  /**
   * Generates a short-lived, read-only signed (SAS) URL for a blob in our private
   * container, so a client can fetch/download it directly from Azure without our
   * server needing to proxy the file's bytes. Since the blob lives on a different
   * origin than our app, the browser ignores the HTML `download` attribute for it -
   * whether it shows the file inline or prompts to save it (and under what filename)
   * is controlled entirely by the Content-Disposition header, overridable per-URL via
   * `contentDisposition`.
   */
  async generateSasUrl(
    blobName: string,
    options: { expiresInMinutes?: number; contentDisposition?: string } = {},
  ): Promise<string> {
    const { expiresInMinutes = 15, contentDisposition } = options;
    const blockBlob = this.containerClient.getBlockBlobClient(blobName);

    return blockBlob.generateSasUrl({
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
      ...(contentDisposition ? { contentDisposition } : {}),
    });
  }
}
