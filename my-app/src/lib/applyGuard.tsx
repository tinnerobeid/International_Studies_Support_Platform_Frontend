import { getSession, isLoggedIn } from "./auth";

export function getApplyTargetForScholarship(id: string) {
  return `/applications/new?type=scholarship&scholarshipId=${encodeURIComponent(id)}`;
}

export function canApplyAsStudent() {
  const role = getSession()?.role;
  return isLoggedIn() && role === "student";
}

export function requireStudentLoginUrl(nextUrl: string) {
  return `/login?as=student&next=${encodeURIComponent(nextUrl)}`;
}
