import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";
import type { MulterModuleOptions } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

export const RESOURCE_FILE_FIELD = "resourceFile";
export const MAX_RESOURCE_FILES = 5;

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES =
  /^(application\/pdf|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|image\/jpeg|image\/png)$/;

// In-memory storage - files stream straight to Azure Blob Storage, never written to disk.
export const resourceFileMulterOptions: MulterModuleOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
};

// Not required - a resource can be created with zero files.
export const createResourceFileValidationPipe = (): ParseFilePipe =>
  new ParseFilePipe({
    fileIsRequired: false,
    validators: [
      new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_BYTES }),
      new FileTypeValidator({ fileType: ALLOWED_MIME_TYPES }),
    ],
  });
