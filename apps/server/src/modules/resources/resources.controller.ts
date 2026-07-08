import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { ApiResponse } from "../../common/dto/api-response";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ClerkAuthGuard, type AuthenticatedUser } from "../../common/guards/clerk-auth.guard";
import { buildPaginationMeta, getPaginationOffset } from "../../common/utils/pagination";
import {
  createResourceFileValidationPipe,
  MAX_RESOURCE_FILES,
  RESOURCE_FILE_FIELD,
  resourceFileMulterOptions,
} from "../../storage/file-upload.config";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { GetFileDownloadUrlQueryDto } from "./dto/get-file-download-url-query.dto";
import { GetResourcesQueryDto } from "./dto/get-resources-query.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { ResourcesService } from "./resources.service";

@Controller("resources")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  /** POST /api/resources - create a new resource (requires authentication). */
  @Post()
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor(RESOURCE_FILE_FIELD, MAX_RESOURCE_FILES, resourceFileMulterOptions))
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateResourceDto,
    @UploadedFiles(createResourceFileValidationPipe()) files: Express.Multer.File[],
  ) {
    const resource = await this.resourcesService.createResource(user.id, dto, files ?? []);
    return ApiResponse.of(resource, "Resource created successfully");
  }

  /** PATCH /api/resources/:resourceId - update an existing resource (requires
   * authentication, must be the uploader). */
  @Patch(":resourceId")
  @UseGuards(ClerkAuthGuard)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Body() dto: UpdateResourceDto,
  ) {
    if (
      dto.title === undefined &&
      dto.description === undefined &&
      dto.type === undefined &&
      dto.offeringId === undefined
    ) {
      throw new BadRequestException("At least one field must be provided for update");
    }

    const resource = await this.resourcesService.updateResource(user.id, resourceId, dto);
    return ApiResponse.of(resource, "Resource updated successfully");
  }

  /** DELETE /api/resources/:resourceId - delete an existing resource (requires
   * authentication, must be the uploader). */
  @Delete(":resourceId")
  @UseGuards(ClerkAuthGuard)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param("resourceId", ParseIntPipe) resourceId: number) {
    await this.resourcesService.deleteResource(user.id, resourceId);
    return ApiResponse.of(null, "Resource deleted successfully");
  }

  /** POST /api/resources/:resourceId/files - add files to an existing resource
   * (requires authentication, must be the uploader). */
  @Post(":resourceId/files")
  @UseGuards(ClerkAuthGuard)
  @UseInterceptors(FilesInterceptor(RESOURCE_FILE_FIELD, MAX_RESOURCE_FILES, resourceFileMulterOptions))
  async addFiles(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @UploadedFiles(createResourceFileValidationPipe()) files: Express.Multer.File[],
  ) {
    await this.resourcesService.addResourceFiles(user.id, resourceId, files ?? []);
    return ApiResponse.of(null, "Files added successfully");
  }

  /** DELETE /api/resources/:resourceId/files/:fileId - remove a file from a resource
   * (requires authentication, must be the uploader). */
  @Delete(":resourceId/files/:fileId")
  @UseGuards(ClerkAuthGuard)
  async removeFile(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Param("fileId", ParseIntPipe) fileId: number,
  ) {
    await this.resourcesService.removeResourceFile(user.id, resourceId, fileId);
    return ApiResponse.of(null, "File removed successfully");
  }

  /** GET /api/resources/:resourceId/files/:fileId/download-url - a short-lived signed
   * download URL (requires authentication - any signed-in user, not just the
   * uploader). */
  @Get(":resourceId/files/:fileId/download-url")
  @UseGuards(ClerkAuthGuard)
  async getFileDownloadUrl(
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Param("fileId", ParseIntPipe) fileId: number,
    @Query() query: GetFileDownloadUrlQueryDto,
  ) {
    const url = await this.resourcesService.getFileDownloadUrl(resourceId, fileId, query.download === "true");
    return { url };
  }

  /** GET /api/resources/:resourceId - resource details by ID (public). */
  @Get(":resourceId")
  findById(@Param("resourceId", ParseIntPipe) resourceId: number) {
    return this.resourcesService.findResourceById(resourceId);
  }

  /** GET /api/resources?offeringId=&userId=&page=&limit= - resources filtered by
   * subject offering or uploader, paginated (public). */
  @Get()
  async findMany(@Query() query: GetResourcesQueryDto) {
    if (!query.offeringId && !query.userId) {
      throw new BadRequestException("Either offeringId or userId must be provided");
    }

    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.resourcesService.findResources(
      { offeringId: query.offeringId, userId: query.userId },
      { limit: query.limit, offset },
    );

    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }
}
