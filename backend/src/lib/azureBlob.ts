import { BlobServiceClient } from "@azure/storage-blob";

import { env } from "../config/env.js";

const blobServiceClient = BlobServiceClient.fromConnectionString(
    env.AZURE_STORAGE_CONNECTION_STRING
);

export const containerClient = blobServiceClient.getContainerClient(
    env.AZURE_STORAGE_CONTAINER
);