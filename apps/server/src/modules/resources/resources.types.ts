import type { ResourceType } from "../../database/schema";

export interface CreateResourceData {
  title: string;
  description: string;
  type: ResourceType;
  offeringId: number;
  uploadedBy: number;
}

export interface UpdateResourceData {
  title?: string;
  description?: string;
  type?: ResourceType;
  offeringId?: number;
}
