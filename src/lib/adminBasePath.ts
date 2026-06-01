export const isAdminSubdomain = /^admin[.-]/.test(window.location.hostname);
export const adminBasePath = isAdminSubdomain ? "" : "/admin";
