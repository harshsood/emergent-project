import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, Settings } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { isAdminAuthenticated } from "@/utils/adminAuth"

export const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Universities", path: "/institutes" },
    { name: "Courses", path: "/courses" },
    { name: "Compare", path: "/compare" },
  ]

  const isAdmin = isAdminAuthenticated()

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <GraduationCap className="w-8 h-8" />
            <span>Delhi EduSkills</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Button asChild>
              <Link to="/enquire">Enquire Now</Link>
            </Button>
            {isAdmin && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/dashboard" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}
            {!isAdmin && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/login">Admin</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg"
                  >
                    {link.name}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link to="/enquire">Enquire Now</Link>
                </Button>
                <div className="border-t pt-4 mt-4">
                  {isAdmin ? (
                    <Button variant="outline" asChild className="w-full justify-start bg-transparent">
                      <Link to="/admin/dashboard" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link to="/admin/login">Admin Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
