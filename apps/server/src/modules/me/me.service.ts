import { Injectable, NotFoundException } from "@nestjs/common";

import { ResourcesRepository } from "../resources/resources.repository";
import { ResourcesService } from "../resources/resources.service";
import { UsersRepository } from "../users/users.repository";
import type { UpdateProfileDto } from "./dto/update-profile.dto";
import { MeRepository } from "./me.repository";

@Injectable()
export class MeService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly resourcesService: ResourcesService,
    private readonly resourcesRepository: ResourcesRepository,
    private readonly meRepository: MeRepository,
  ) {}

  async getProfile(userId: number) {
    const profile = await this.usersRepository.findOwnProfileById(userId);

    if (!profile) {
      throw new NotFoundException("User not found");
    }

    return profile;
  }

  async updateProfile(userId: number, data: UpdateProfileDto): Promise<void> {
    const existingProfile = await this.usersRepository.findProfileByUserId(userId);

    if (!existingProfile) {
      throw new NotFoundException("User profile not found");
    }

    await this.usersRepository.updateProfile(userId, {
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.programId !== undefined ? { programId: data.programId } : {}),
      ...(data.semester !== undefined ? { semester: data.semester } : {}),
      ...(data.college !== undefined ? { college: data.college } : {}),
    });
  }

  /** Delegates to ResourcesService.findResources - the exact same query as
   * GET /api/resources?userId=, just with the filter fixed to the caller. */
  getUploadedResources(userId: number, pagination: { limit: number; offset: number }) {
    return this.resourcesService.findResources({ userId }, pagination);
  }

  getRecentlyAccessedResources(userId: number, pagination: { limit: number; offset: number }) {
    return this.meRepository.findRecentResources(userId, pagination);
  }

  getBookmarkedResources(userId: number, pagination: { limit: number; offset: number }) {
    return this.meRepository.findBookmarkedResources(userId, pagination);
  }

  getBookmarkedResourceIds(userId: number) {
    return this.meRepository.findBookmarkedResourceIds(userId);
  }

  private async assertResourceExists(resourceId: number): Promise<void> {
    const resource = await this.resourcesRepository.findOwnership(resourceId);

    if (!resource) {
      throw new NotFoundException("Resource not found");
    }
  }

  async markResourceAsRecentlyAccessed(userId: number, resourceId: number): Promise<void> {
    await this.assertResourceExists(resourceId);
    await this.meRepository.markRecentlyAccessed(userId, resourceId);
  }

  async markResourceAsBookmarked(userId: number, resourceId: number): Promise<void> {
    await this.assertResourceExists(resourceId);
    await this.meRepository.markBookmarked(userId, resourceId);
  }

  async unmarkResourceAsBookmarked(userId: number, resourceId: number): Promise<void> {
    await this.meRepository.unmarkBookmarked(userId, resourceId);
  }
}
