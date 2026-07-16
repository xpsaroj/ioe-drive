import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";

import { AzureBlobService } from "../../storage/azure-blob.service";
import { MarketplaceListingsRepository } from "../marketplace/marketplace-listings.repository";
import { MessagingRepository } from "./messaging.repository";

@Injectable()
export class MessagingService {
  constructor(
    private readonly messagingRepository: MessagingRepository,
    private readonly marketplaceListingsRepository: MarketplaceListingsRepository,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  // The conversation list's listing preview carries the same unsigned, private blob URL as the
  // listings endpoints (see MarketplaceListingsService.signPhotoUrls) - signs it the same way.
  private async signConversationPhoto<T extends { listing: { photos: { blobName: string; photoUrl: string }[] } }>(
    conversation: T,
  ): Promise<T> {
    const photos = await Promise.all(
      conversation.listing.photos.map(async (photo) => ({
        ...photo,
        photoUrl: await this.azureBlobService.generateSasUrl(photo.blobName, { expiresInMinutes: 60 }),
      })),
    );

    return { ...conversation, listing: { ...conversation.listing, photos } };
  }

  async getConversations(userId: number, pagination: { limit: number; offset: number }) {
    const { items, total } = await this.messagingRepository.findConversationsForUser(userId, pagination);
    const signedItems = await Promise.all(items.map((item) => this.signConversationPhoto(item)));

    return { items: signedItems, total };
  }

  /** Same joined shape as the inbox list, minus lastMessage/unreadCount - just for the thread header. */
  async getConversationById(userId: number, conversationId: number) {
    await this.assertParticipant(userId, conversationId);
    const conversation = await this.messagingRepository.findConversationDetail(conversationId);

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return this.signConversationPhoto(conversation);
  }

  async getConversationMessages(userId: number, conversationId: number, pagination: { limit: number; offset: number }) {
    await this.assertParticipant(userId, conversationId);
    return this.messagingRepository.findMessages(conversationId, pagination);
  }

  /** 404s if the conversation doesn't exist or the caller isn't a participant - the two are indistinguishable. */
  async assertParticipant(userId: number, conversationId: number) {
    const conversation = await this.messagingRepository.findConversationById(conversationId);

    if (!conversation || (conversation.posterId !== userId && conversation.initiatorId !== userId)) {
      throw new NotFoundException("Conversation not found");
    }

    return conversation;
  }

  async startConversation(userId: number, listingId: number, message: string) {
    const listing = await this.marketplaceListingsRepository.findOwnership(listingId);

    if (!listing || !listing.postedBy) {
      throw new NotFoundException("Listing not found");
    }

    if (listing.postedBy === userId) {
      throw new ForbiddenException("You can't message yourself about your own listing");
    }

    if (listing.status === "REMOVED") {
      throw new BadRequestException("This listing is no longer available");
    }

    const existingConversation = await this.messagingRepository.findExistingConversation(listingId, userId);
    const conversation =
      existingConversation ?? (await this.messagingRepository.createConversation(listingId, listing.postedBy, userId));

    const createdMessage = await this.messagingRepository.createMessage(conversation.id, userId, message);

    return { conversationId: conversation.id, message: createdMessage };
  }

  async sendMessage(userId: number, conversationId: number, body: string) {
    const conversation = await this.assertParticipant(userId, conversationId);

    const listing = await this.marketplaceListingsRepository.findOwnership(conversation.listingId);

    if (!listing || listing.status === "REMOVED") {
      throw new BadRequestException("This listing is no longer available");
    }

    const message = await this.messagingRepository.createMessage(conversationId, userId, body);
    const otherParticipantId = conversation.posterId === userId ? conversation.initiatorId : conversation.posterId;

    return { message, conversationId, listingId: conversation.listingId, otherParticipantId };
  }

  async markConversationRead(userId: number, conversationId: number): Promise<void> {
    await this.assertParticipant(userId, conversationId);
    await this.messagingRepository.markRead(conversationId, userId);
  }

  getUnreadCount(userId: number) {
    return this.messagingRepository.countTotalUnread(userId);
  }
}
