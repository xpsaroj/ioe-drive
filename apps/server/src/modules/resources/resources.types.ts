import type { ModerationReason, ResourceStatus, ResourceType } from "../../database/schema";

export interface CreateResourceData {
  title: string;
  description: string;
  type: ResourceType;
  offeringId: number;
  uploadedBy: number;
  status: ResourceStatus;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  type?: ResourceType;
  offeringId?: number;
  // Not client-settable via UpdateResourceDto - only ResourcesService sets these, to
  // reset a REJECTED resource back to PENDING when its owner edits it (an implicit
  // resubmission).
  status?: ResourceStatus;
  moderatedBy?: number | null;
  moderationReason?: ModerationReason | null;
  moderationNote?: string | null;
  moderatedAt?: Date | null;
}

export interface ModerateResourceData {
  status: ResourceStatus;
  moderatedBy: number;
  moderationReason: ModerationReason | null;
  moderationNote: string | null;
  moderatedAt: Date;
}
