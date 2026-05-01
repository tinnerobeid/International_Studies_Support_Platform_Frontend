import { isLoggedIn, getRole } from "./auth";

export function goToLoginAsStudent(nextPath: string) {
  return `/login?as=student&next=${encodeURIComponent(nextPath)}`;
}

export function canStudentAccess(): boolean {
  return isLoggedIn() && getRole() === "student";
}
