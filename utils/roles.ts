import type { Role } from '@/types';

// Each branch is cast `as const` so the return type stays a string literal —
// expo-router's typed routes (see app.json) reject a widened `string` here.
export function roleHomePath(role: Role) {
  switch (role) {
    case 'admin':
      return '/admin/catalog' as const;
    case 'chef':
      return '/chef/prep' as const;
    case 'employee':
      return '/employee/menu' as const;
  }
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  chef: 'Chef',
  employee: 'Employee',
};
