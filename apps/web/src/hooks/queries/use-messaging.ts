import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { messagingApi } from '@/lib/api/messaging-api';

export const messagingKeys = {
    all: ['messaging-conversations'] as const,
    byId: (conversationId: number) => ['messaging-conversations', conversationId] as const,
    // Called with no `page` to get a stable prefix for invalidating every page at once.
    conversations: (page?: number) => page === undefined
        ? ['messaging-conversations', 'list'] as const
        : ['messaging-conversations', 'list', page] as const,
    messages: (conversationId: number, page?: number) => page === undefined
        ? ['messaging-conversations', conversationId, 'messages'] as const
        : ['messaging-conversations', conversationId, 'messages', page] as const,
    unreadCount: ['messaging-conversations', 'unread-count'] as const,
};

/** Thread header detail (listing + both participants) - the inbox list's shape, minus preview-only fields. */
export function useConversation(conversationId: number) {
    return useQuery({
        queryKey: messagingKeys.byId(conversationId),
        queryFn: async () => {
            const response = await messagingApi.getConversation(conversationId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch conversation');
            }
            return response.data;
        },
        enabled: !!conversationId,
    });
}

/** This user's inbox, paginated, most recently active thread first. */
export function useConversations(page: number = 1) {
    return useQuery({
        queryKey: messagingKeys.conversations(page),
        queryFn: async () => {
            const response = await messagingApi.getConversations({ page });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch conversations');
            }
            return { items: response.data, meta: response.meta };
        },
        placeholderData: keepPreviousData,
    });
}

// Matches the backend's PaginationQueryDto MAX_LIMIT - a single fetch of the most recent 100
// messages, no "load older" pagination. Fine for a peer-to-peer negotiation thread; a very long
// conversation would need real pagination, which is out of scope for v1.
const MESSAGE_HISTORY_LIMIT = 100;

/** Newest-first from the API - reverse before rendering as a chat thread. */
export function useConversationMessages(conversationId: number) {
    return useQuery({
        queryKey: messagingKeys.messages(conversationId),
        queryFn: async () => {
            const response = await messagingApi.getMessages(conversationId, { limit: MESSAGE_HISTORY_LIMIT });
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch messages');
            }
            return { items: response.data, meta: response.meta };
        },
        enabled: !!conversationId,
    });
}

/** Starts (or reuses) a thread with a listing's poster and sends the first message. */
export function useStartConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ listingId, message }: { listingId: number; message: string }) => {
            const response = await messagingApi.startConversation(listingId, message);
            if (!response.success) {
                throw new Error(response.error || 'Failed to send message');
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messagingKeys.all });
        },
    });
}

export function useMarkConversationRead(conversationId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const response = await messagingApi.markConversationRead(conversationId);
            if (!response.success) {
                throw new Error(response.error || 'Failed to mark conversation as read');
            }
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: messagingKeys.all });
        },
    });
}

/** Cold-start value for the nav badge, before the socket's live conversation_updated events take over. */
export function useUnreadCount() {
    return useQuery({
        queryKey: messagingKeys.unreadCount,
        queryFn: async () => {
            const response = await messagingApi.getUnreadCount();
            if (!response.success) {
                throw new Error(response.error || 'Failed to fetch unread count');
            }
            return response.data;
        },
    });
}
