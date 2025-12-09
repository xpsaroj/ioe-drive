/**
 * Clerk Webhook Event Types
 * - Based on Clerk's official webhook documentation
 */

export interface WebhookEvent {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>;
    object: "event";
    type: string;
    timestamp: number;
    instance_id: string;
}

export interface UserWebhookData {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email_addresses: Array<{
        email_address: string;
        id: string;
        verification: {
            status: string;
            strategy: string;
        };
    }>;
    primary_email_address_id: string | null;
    profile_image_url: string;
    image_url: string;
    created_at: number;
    updated_at: number;
}

export interface UserCreatedEvent extends WebhookEvent {
    type: "user.created";
    data: UserWebhookData;
}

export interface UserUpdatedEvent extends WebhookEvent {
    type: "user.updated";
    data: UserWebhookData;
}

export interface UserDeletedEvent extends WebhookEvent {
    type: "user.deleted";
    data: {
        id: string;
        deleted: boolean;
    };
}

export type ClerkWebhookEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;
