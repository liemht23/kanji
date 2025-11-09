export const SUPER_ADMIN_ROLE = "super-admin";
export const ADMIN_ROLE = "admin";
export const USER_ROLE = "user";
export type UserRole =
  | typeof SUPER_ADMIN_ROLE
  | typeof ADMIN_ROLE
  | typeof USER_ROLE;
