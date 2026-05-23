export const isAdminSubdomain = window.location.hostname.startsWith("admin.");
export const adminBasePath = isAdminSubdomain ? "" : "/admin";
