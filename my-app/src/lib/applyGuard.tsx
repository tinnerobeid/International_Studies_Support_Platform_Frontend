import { getRole, isLoggedIn } from "./auth";

/**
 * Returns where the user should be sent when clicking Apply
 */
export function getApplyTargetForScholarship(scholarshipId?: string) {
  // Not logged in → go to login as student
  if (!isLoggedIn()) {
    const next = scholarshipId
      ? `/applications/new?scholarship=${scholarshipId}`
      : "/applications/new";

    return `/login?as=student&next=${encodeURIComponent(next)}`;
  }

  // Logged in but wrong role
  if (getRole() !== "student") {
    return "/profile";
  }

  // Student logged in → go to application creation
  return scholarshipId
    ? `/applications/new?scholarship=${scholarshipId}`
    : "/applications/new";
}

/**
 * Simple helper
 */
export function isStudentLoggedIn() {
  return isLoggedIn() && getRole() === "student";
}

export function requireStudentLoginUrl(next: string) {
  return `/login?as=student&next=${encodeURIComponent(next)}`;
}
