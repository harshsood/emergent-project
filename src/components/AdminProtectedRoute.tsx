import type React from "react"
import { Navigate } from "react-router-dom"
import { isAdminAuthenticated } from "@/utils/adminAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function AdminProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
