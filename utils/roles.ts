import type { Role } from '@/types';

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
