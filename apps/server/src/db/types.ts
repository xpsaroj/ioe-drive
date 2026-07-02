import * as schemas from './schema.js';

export type User = typeof schemas.usersTable.$inferSelect;
export type UserInsertSchema = typeof schemas.usersTable.$inferInsert;
export type UserUpdateSchema = Partial<UserInsertSchema>;

export type Profile = typeof schemas.profilesTable.$inferSelect;
export type ProfileInsertSchema = typeof schemas.profilesTable.$inferInsert;
export type ProfileUpdateSchema = Partial<ProfileInsertSchema>;