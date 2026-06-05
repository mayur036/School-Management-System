/** Canonical role names (must match the server's `roles` table). */
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  STAFF: 'staff',
};

/**
 * The landing route for each role after login / on a guard redirect.
 * Falls back to /login for an unknown or missing role.
 */
export const roleHome = (role) => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return '/super/dashboard';
    case ROLES.SCHOOL_ADMIN:
      return '/school/dashboard';
    case ROLES.STAFF:
      return '/staff/profile';
    default:
      return '/login';
  }
};
