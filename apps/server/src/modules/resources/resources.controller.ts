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
import { CurrentUser, OptionalCurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ClerkAuthGuard, type AuthenticatedUser } from "../../common/guards/clerk-auth.guard";
import { OptionalClerkAuthGuard } from "../../common/guards/optional-clerk-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { buildPaginationMeta, getPaginationOffset } from "../../common/utils/pagination";
import {
  createResourceFileValidationPipe,
  MAX_RESOURCE_FILES,
  RESOURCE_FILE_FIELD,
  resourceFileMulterOptions,
} from "../../storage/file-upload.config";
import { ModerationService } from "../moderation/moderation.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { GetFileDownloadUrlQueryDto } from "./dto/get-file-download-url-query.dto";
import { GetResourcesQueryDto } from "./dto/get-resources-query.dto";
import { GetSimilarResourcesQueryDto } from "./dto/get-similar-resources-query.dto";
import { ModerateResourceDto } from "./dto/moderate-resource.dto";
import { ReportResourceDto } from "./dto/report-resource.dto";
import { SearchSuggestionsQueryDto } from "./dto/search-suggestions-query.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { ResourcesService } from "./resources.service";

@Controller("resources")
export class ResourcesController {
  constructor(
    private readonly resourcesService: ResourcesService,
    private readonly moderationService: ModerationService,
  ) {}

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

  /** POST /api/resources/:resourceId/approve - approve a pending resource, making it
   * publicly visible (moderator-only). */
  @Post(":resourceId/approve")
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async approve(@CurrentUser() moderator: AuthenticatedUser, @Param("resourceId", ParseIntPipe) resourceId: number) {
    const resource = await this.moderationService.approveResource(moderator.id, resourceId);
    return ApiResponse.of(resource, "Resource approved");
  }

  /** POST /api/resources/:resourceId/reject - reject a pending or approved resource
   * with a reason (moderator-only). Resubmittable - the uploader editing it resets it
   * back to pending. */
  @Post(":resourceId/reject")
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async reject(
    @CurrentUser() moderator: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Body() dto: ModerateResourceDto,
  ) {
    const resource = await this.moderationService.rejectResource(moderator.id, resourceId, dto);
    return ApiResponse.of(resource, "Resource rejected");
  }

  /** POST /api/resources/:resourceId/remove - the harder moderator action: purges the
   * resource's files and marks it permanently removed, with a reason the uploader can
   * see on their own uploads page (moderator-only, not resubmittable). */
  @Post(":resourceId/remove")
  @UseGuards(ClerkAuthGuard, RolesGuard)
  @Roles("MODERATOR", "ADMIN")
  @HttpCode(HttpStatus.OK)
  async removeAsModerator(
    @CurrentUser() moderator: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Body() dto: ModerateResourceDto,
  ) {
    const resource = await this.moderationService.removeResource(moderator.id, resourceId, dto);
    return ApiResponse.of(resource, "Resource removed");
  }

  /** POST /api/resources/:resourceId/report - report an approved resource (any
   * signed-in user other than its uploader). The reporter's identity is never surfaced
   * to the uploader, only to moderators reviewing the reports queue. */
  @Post(":resourceId/report")
  @UseGuards(ClerkAuthGuard)
  @HttpCode(HttpStatus.OK)
  async report(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Body() dto: ReportResourceDto,
  ) {
    await this.moderationService.reportResource(user.id, resourceId, dto);
    return ApiResponse.of(null, "Resource reported");
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
   * download URL. Any signed-in user for an APPROVED resource; only its uploader or a
   * moderator/admin otherwise (see ResourcesService.getFileDownloadUrl). */
  @Get(":resourceId/files/:fileId/download-url")
  @UseGuards(ClerkAuthGuard)
  async getFileDownloadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Param("fileId", ParseIntPipe) fileId: number,
    @Query() query: GetFileDownloadUrlQueryDto,
  ) {
    const url = await this.resourcesService.getFileDownloadUrl(resourceId, fileId, user, query.download === "true");
    return { url };
  }

  /** GET /api/resources/search-suggestions?q=&limit= - a lean, capped list of resource
   * previews matching a search query (title/description), for live-typing UI like the
   * search palette - not the full paginated browse shape `findMany` returns (public).
   * Must stay registered before `:resourceId` below so "search-suggestions" isn't
   * swallowed as a param. */
  @Get("search-suggestions")
  async searchSuggestions(@Query() query: SearchSuggestionsQueryDto) {
    const suggestions = await this.resourcesService.searchSuggestions(query.q, query.limit ?? 8);
    return ApiResponse.of(suggestions);
  }

  /** GET /api/resources/:resourceId - resource details by ID. Public for APPROVED
   * resources; a pending/rejected/removed resource is only visible to its uploader or a
   * moderator (404 for anyone else), so identity is checked when present without
   * requiring it. */
  @Get(":resourceId")
  @UseGuards(OptionalClerkAuthGuard)
  findById(
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @OptionalCurrentUser() viewer?: AuthenticatedUser,
  ) {
    return this.resourcesService.findResourceById(resourceId, viewer);
  }

  /** GET /api/resources/:resourceId/similar?limit= - other resources from the same
   * subject offering, for the detail page's "Similar Resources" panel (public). */
  @Get(":resourceId/similar")
  async findSimilar(
    @Param("resourceId", ParseIntPipe) resourceId: number,
    @Query() query: GetSimilarResourcesQueryDto,
  ) {
    const similar = await this.resourcesService.findSimilarResources(resourceId, query.limit ?? 5);
    return ApiResponse.of(similar);
  }

  /** GET /api/resources?offeringId=&userId=&q=&page=&limit= - resources filtered by
   * subject offering, uploader, or a title/description search query, paginated
   * (public). */
  @Get()
  async findMany(@Query() query: GetResourcesQueryDto) {
    if (!query.offeringId && !query.userId && !query.q) {
      throw new BadRequestException("Either offeringId, userId, or q must be provided");
    }

    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.resourcesService.findResources(
      { offeringId: query.offeringId, userId: query.userId, q: query.q },
      { limit: query.limit, offset },
    );

    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }
}
