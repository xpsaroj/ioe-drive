import { useMutation } from '@tanstack/react-query';

import { adminApi, type ChangeUserRoleInput } from '@/lib/api/admin-api';

/** Promotes/demotes a user between USER and MODERATOR by email - nothing to
 * invalidate here, since no query currently reads another user's role by email. */
export function useChangeUserRole() {
    return useMutation({
        mutationFn: async (data: ChangeUserRoleInput) => {
            const response = await adminApi.changeUserRole(data);
            if (!response.success) {
                throw new Error(response.error || 'Failed to update role');
            }
            return response.data;
        },
    });
}
