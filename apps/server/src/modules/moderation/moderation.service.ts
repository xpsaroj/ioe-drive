import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { AzureBlobService } from "../../storage/azure-blob.service";
import type { ModerateResourceDto } from "../resources/dto/moderate-resource.dto";
import type { ReportResourceDto } from "../resources/dto/report-resource.dto";
import { ModerationRepository } from "./moderation.repository";

@Injectable()
export class ModerationService {
  constructor(
    private readonly moderationRepository: ModerationRepository,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  findPendingResources(pagination: { limit: number; offset: number }) {
    return this.moderationRepository.findPending(pagination);
  }

  findOpenReports(pagination: { limit: number; offset: number }) {
    return this.moderationRepository.findOpenReports(pagination);
  }

  async dismissReport(moderatorId: number, reportId: number) {
    const dismissedReport = await this.moderationRepository.resolveReport(reportId, moderatorId);

    if (!dismissedReport) {
      throw new NotFoundException("Report not found");
    }

    return dismissedReport;
  }

  async approveResource(moderatorId: number, resourceId: number) {
    const resource = await this.moderationRepository.findForModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "PENDING") {
      throw new BadRequestException("Only pending resources can be approved");
    }

    return this.moderationRepository.recordModerationAction(resourceId, "APPROVE", {
      status: "APPROVED",
      moderatedBy: moderatorId,
      moderationReason: null,
      moderationNote: null,
      moderatedAt: new Date(),
    });
  }

  async rejectResource(moderatorId: number, resourceId: number, dto: ModerateResourceDto) {
    const resource = await this.moderationRepository.findForModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "PENDING" && resource.status !== "APPROVED") {
      throw new BadRequestException("Only pending or approved resources can be rejected");
    }

    const updatedResource = await this.moderationRepository.recordModerationAction(resourceId, "REJECT", {
      status: "REJECTED",
      moderatedBy: moderatorId,
      moderationReason: dto.reason,
      moderationNote: dto.note ?? null,
      moderatedAt: new Date(),
    });

    await this.moderationRepository.resolveReportsForResource(resourceId, moderatorId);

    return updatedResource;
  }

  /** The harder moderator action - unlike reject, not resubmittable. The resource row
   * and its moderation reason/note are kept (so the uploader can see it happened and
   * why), but its files are actually purged from Azure. */
  async removeResource(moderatorId: number, resourceId: number, dto: ModerateResourceDto) {
    const resource = await this.moderationRepository.findForModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status === "REMOVED") {
      throw new BadRequestException("Resource has already been removed");
    }

    await Promise.all(resource.files.map((file) => this.azureBlobService.delete(file.blobName)));
    await this.moderationRepository.deleteResourceFiles(resourceId);

    const updatedResource = await this.moderationRepository.recordModerationAction(resourceId, "REMOVE", {
      status: "REMOVED",
      moderatedBy: moderatorId,
      moderationReason: dto.reason,
      moderationNote: dto.note ?? null,
      moderatedAt: new Date(),
    });

    await this.moderationRepository.resolveReportsForResource(resourceId, moderatorId);

    return updatedResource;
  }

  async reportResource(userId: number, resourceId: number, dto: ReportResourceDto) {
    const resource = await this.moderationRepository.findForModeration(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }

    if (resource.status !== "APPROVED") {
      throw new BadRequestException("Only approved resources can be reported");
    }

    if (resource.uploadedBy === userId) {
      throw new BadRequestException("You can't report your own resource");
    }

    const existingReport = await this.moderationRepository.findExistingReport(resourceId, userId);

    if (existingReport) {
      throw new BadRequestException("You have already reported this resource");
    }

    return this.moderationRepository.createReport({
      resourceId,
      reportedBy: userId,
      reason: dto.reason,
      note: dto.note,
    });
  }
}
