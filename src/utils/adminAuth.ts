export const isAdminAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("adminToken") === "authenticated"
}

export const logout = (): void => {
  localStorage.removeItem("adminToken")
  localStorage.removeItem("adminEmail")
}

export const getAdminEmail = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("adminEmail")
}
