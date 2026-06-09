export const getInitials = (user) => {
  if (!user) return 'U';
  const first = user.first_name?.[0] ?? '';
  const last = user.last_name?.[0] ?? '';
  return `${first}${last}`.toUpperCase() || 'U';
};

export const getBreadcrumbRoleLabel = (roleName) => {
  return roleName === 'super_admin'
    ? 'Super Admin'
    : roleName === 'school_admin'
      ? 'School Admin'
      : 'Staff';
};
