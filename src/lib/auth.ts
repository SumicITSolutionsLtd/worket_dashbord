/**
 * Platform admin = user.is_staff === true from API, OR email in this list.
 * The Worket API login/me responses do not currently include is_staff. Until the
 * backend exposes it (or a role field), add known staff emails here so they see
 * the Admin Panel. Replace with your actual staff account(s) from the backend team.
 */
export const PLATFORM_ADMIN_EMAILS: readonly string[] = ['admin@worket.ug'];

export function isPlatformAdmin(
  user: { email?: string; is_staff?: boolean } | null | undefined
): boolean {
  if (!user) return false;
  if (user.is_staff === true) return true;
  return PLATFORM_ADMIN_EMAILS.includes(user.email ?? '');
}
