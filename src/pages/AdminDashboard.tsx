"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, Building2, BookOpen, MessageSquare, LogOut } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logout } from "@/utils/adminAuth"
import AdminInstitutes from "./AdminInstitutes"
import AdminCourses from "./AdminCourses"
import AdminEnquiries from "./AdminEnquiries"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"overview" | "institutes" | "courses" | "enquiries">("overview")

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  const stats = [
    { label: "Total Institutes", value: "10+", icon: Building2 },
    { label: "Total Courses", value: "40+", icon: BookOpen },
    { label: "Total Enquiries", value: "100+", icon: MessageSquare },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage your education hub content</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
            { id: "institutes" as const, label: "Institutes", icon: Building2 },
            { id: "courses" as const, label: "Courses", icon: BookOpen },
            { id: "enquiries" as const, label: "Enquiries", icon: MessageSquare },
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "outline"}
              onClick={() => setActiveTab(id)}
              className="flex gap-2 whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div>
            <h2 className="text-xl font-bold mb-4">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "institutes" && <AdminInstitutes />}
        {activeTab === "courses" && <AdminCourses />}
        {activeTab === "enquiries" && <AdminEnquiries />}
      </div>
    </div>
  )
}
