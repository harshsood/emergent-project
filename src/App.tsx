import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import Institutes from "./pages/Institutes"
import Courses from "./pages/Courses"
import Compare from "./pages/Compare"
import InstituteDetail from "./pages/InstituteDetail"
import CourseDetail from "./pages/CourseDetail"
import Enquire from "./pages/Enquire"
import NotFound from "./pages/NotFound"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import { AdminProtectedRoute } from "./components/AdminProtectedRoute"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/institutes" element={<Institutes />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/institute/:slug" element={<InstituteDetail />} />
          <Route path="/course/:slug" element={<CourseDetail />} />
          <Route path="/enquire" element={<Enquire />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
