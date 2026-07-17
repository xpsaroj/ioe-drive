import { Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { ApiResponse } from "../../common/dto/api-response";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";
import { ClerkAuthGuard, type AuthenticatedUser } from "../../common/guards/clerk-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { buildPaginationMeta, getPaginationOffset } from "../../common/utils/pagination";
import { ModerationService } from "./moderation.service";

/** Every route here is MODERATOR-or-ADMIN-only, enforced by this guard pair. */
@Controller("moderation")
@UseGuards(ClerkAuthGuard, RolesGuard)
@Roles("MODERATOR", "ADMIN")
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  // The review queue: resources awaiting a decision, oldest first.
  @Get("pending")
  async findPending(@Query() query: PaginationQueryDto) {
    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.moderationService.findPendingResources({ limit: query.limit, offset });
    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }

  // Each report includes the reporter's identity, never exposed to the uploader.
  @Get("reports")
  async findReports(@Query() query: PaginationQueryDto) {
    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.moderationService.findOpenReports({ limit: query.limit, offset });
    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }

  // The "unfounded report" case: closes the report with no change to the resource.
  @Post("reports/:reportId/dismiss")
  @HttpCode(HttpStatus.OK)
  async dismissReport(
    @CurrentUser() moderator: AuthenticatedUser,
    @Param("reportId", ParseIntPipe) reportId: number,
  ) {
    await this.moderationService.dismissReport(moderator.id, reportId);
    return ApiResponse.of(null, "Report dismissed");
  }

  // Open marketplace-listing reports, oldest first.
  @Get("marketplace/reports")
  async findMarketplaceReports(@Query() query: PaginationQueryDto) {
    const offset = getPaginationOffset(query.page, query.limit);
    const { items, total } = await this.moderationService.findOpenMarketplaceReports({ limit: query.limit, offset });
    return ApiResponse.of(items, undefined, buildPaginationMeta(query.page, query.limit, total));
  }

  // The "unfounded report" case for a listing: closes the report with no change to the listing.
  @Post("marketplace/reports/:reportId/dismiss")
  @HttpCode(HttpStatus.OK)
  async dismissMarketplaceReport(
    @CurrentUser() moderator: AuthenticatedUser,
    @Param("reportId", ParseIntPipe) reportId: number,
  ) {
    await this.moderationService.dismissMarketplaceReport(moderator.id, reportId);
    return ApiResponse.of(null, "Report dismissed");
  }
}
