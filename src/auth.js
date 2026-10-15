export const ROLE_DASHBOARD_PATHS = {
  STUDENT: "/student",
  STAFF: "/staff",
  ADMIN: "/admin",
};

export function clearAuthentication() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
}
