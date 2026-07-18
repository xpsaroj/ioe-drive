import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { AzureBlobService } from "../../storage/azure-blob.service";
import type { ModerateResourceDto } from "../resources/dto/moderate-resource.dto";
import type { ReportResourceDto } from "../resources/dto/report-resource.dto";
import type { ModerateListingDto } from "../marketplace/dto/moderate-listing.dto";
import type { ReportListingDto } from "../marketplace/dto/report-listing.dto";
import { NotificationsService } from "../notifications/notifications.service";
import { ModerationRepository } from "./moderation.repository";

@Injectable()
export class ModerationService {
  constructor(
    private readonly moderationRepository: ModerationRepository,
    private readonly azureBlobService: AzureBlobService,
    private readonly notificationsService: NotificationsService,
  ) {}

  findPendingResources(pagination: { limit: number; offset: number }) {
    return this.moderationRepository.findPending(pagination);
  }

  findOpenResourceReports(pagination: { limit: number; offset: number }) {
    return this.moderationRepository.findOpenResourceReports(pagination);
  }

  async dismissResourceReport(moderatorId: number, reportId: number) {
    const dismissedReport = await this.moderationRepository.resolveResourceReport(reportId, moderatorId);

    if (!dismissedReport) {
      throw new NotFoundException("Report not found");
    }

    return dismissedReport;
  }

  async approveResource(moderatorId: number, resourceId: number) {
    const resource = await this.moderationRepository.findForResourceModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "PENDING") {
      throw new BadRequestException("Only pending resources can be approved");
    }

    const updatedResource = await this.moderationRepository.recordResourceModerationAction(resourceId, "APPROVE", {
      status: "APPROVED",
      moderatedBy: moderatorId,
      moderationReason: null,
      moderationNote: null,
      moderatedAt: new Date(),
    });

    if (resource.uploadedBy) {
      await this.notificationsService.create(
        resource.uploadedBy,
        "RESOURCE_APPROVED",
        `Your resource "${resource.title}" was approved.`,
        `/resources/r/${resourceId}`,
      );
    }

    return updatedResource;
  }

  async rejectResource(moderatorId: number, resourceId: number, dto: ModerateResourceDto) {
    const resource = await this.moderationRepository.findForResourceModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "PENDING" && resource.status !== "APPROVED") {
      throw new BadRequestException("Only pending or approved resources can be rejected");
    }

    const updatedResource = await this.moderationRepository.recordResourceModerationAction(resourceId, "REJECT", {
      status: "REJECTED",
      moderatedBy: moderatorId,
      moderationReason: dto.reason,
      moderationNote: dto.note ?? null,
      moderatedAt: new Date(),
    });

    await this.moderationRepository.resolveReportsForResource(resourceId, moderatorId);

    if (resource.uploadedBy) {
      await this.notificationsService.create(
        resource.uploadedBy,
        "RESOURCE_REJECTED",
        `Your resource "${resource.title}" was rejected.`,
        `/resources/r/${resourceId}`,
      );
    }

    return updatedResource;
  }

  // Unlike reject, not resubmittable - the row is kept, but its files are purged from Azure.
  async removeResource(moderatorId: number, resourceId: number, dto: ModerateResourceDto) {
    const resource = await this.moderationRepository.findForResourceModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status === "REMOVED") {
      throw new BadRequestException("Resource has already been removed");
    }

    await Promise.all(resource.files.map((file) => this.azureBlobService.delete(file.blobName)));
    await this.moderationRepository.deleteResourceFiles(resourceId);

    const updatedResource = await this.moderationRepository.recordResourceModerationAction(resourceId, "REMOVE", {
      status: "REMOVED",
      moderatedBy: moderatorId,
      moderationReason: dto.reason,
      moderationNote: dto.note ?? null,
      moderatedAt: new Date(),
    });

    await this.moderationRepository.resolveReportsForResource(resourceId, moderatorId);

    if (resource.uploadedBy) {
      await this.notificationsService.create(
        resource.uploadedBy,
        "RESOURCE_REMOVED",
        `Your resource "${resource.title}" was removed.`,
        `/resources/r/${resourceId}`,
      );
    }

    return updatedResource;
  }

  async reportResource(userId: number, resourceId: number, dto: ReportResourceDto) {
    const resource = await this.moderationRepository.findForResourceModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "APPROVED") {
      throw new BadRequestException("Only approved resources can be reported");
    }

    if (resource.uploadedBy === userId) {
      throw new BadRequestException("You can't report your own resource");
    }

    const existingReport = await this.moderationRepository.findExistingResourceReport(resourceId, userId);

    if (existingReport) {
      throw new BadRequestException("You have already reported this resource");
    }

    return this.moderationRepository.createResourceReport({
      resourceId,
      reportedBy: userId,
      reason: dto.reason,
      note: dto.note,
    });
  }

  findOpenMarketplaceReports(pagination: { limit: number; offset: number }) {
    return this.moderationRepository.findOpenMarketplaceReports(pagination);
  }

  async dismissMarketplaceReport(moderatorId: number, reportId: number) {
    const dismissedReport = await this.moderationRepository.resolveMarketplaceReport(reportId, moderatorId);

    if (!dismissedReport) {
      throw new NotFoundException("Report not found");
    }

    return dismissedReport;
  }

  // Unlike resources, there's no reject/resubmit cycle - REMOVE is the only moderator action a listing can receive.
  async removeListing(moderatorId: number, listingId: number, dto: ModerateListingDto) {
    const listing = await this.moderationRepository.findForListingModeration(listingId);

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    if (listing.status === "REMOVED") {
      throw new BadRequestException("Listing has already been removed");
    }

    await Promise.all(listing.photos.map((photo) => this.azureBlobService.delete(photo.blobName)));
    await this.moderationRepository.deleteListingPhotos(listingId);

    const updatedListing = await this.moderationRepository.recordMarketplaceModerationAction(listingId, {
      status: "REMOVED",
      moderatedBy: moderatorId,
      moderationReason: dto.reason,
      moderationNote: dto.note ?? null,
      moderatedAt: new Date(),
    });

    await this.moderationRepository.resolveMarketplaceReportsForListing(listingId, moderatorId);

    if (listing.postedBy) {
      await this.notificationsService.create(
        listing.postedBy,
        "LISTING_REMOVED",
        `Your listing "${listing.title}" was removed.`,
        `/market/${listingId}`,
      );
    }

    return updatedListing;
  }

  async reportListing(userId: number, listingId: number, dto: ReportListingDto) {
    const listing = await this.moderationRepository.findForListingModeration(listingId);

    if (!listing) {
      throw new NotFoundException("Listing not found");
    }

    if (listing.status === "REMOVED") {
      throw new BadRequestException("This listing has already been removed");
    }

    if (listing.postedBy === userId) {
      throw new BadRequestException("You can't report your own listing");
    }

    const existingReport = await this.moderationRepository.findExistingMarketplaceReport(listingId, userId);

    if (existingReport) {
      throw new BadRequestException("You have already reported this listing");
    }

    return this.moderationRepository.createMarketplaceReport({
      listingId,
      reportedBy: userId,
      reason: dto.reason,
      note: dto.note,
    });
  }
}
