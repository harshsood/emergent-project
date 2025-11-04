import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <GraduationCap className="w-8 h-8" />
              <span>Delhi EduSkills</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect online education program from India's top universities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/institutes" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Universities
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Compare Courses
                </Link>
              </li>
              <li>
                <Link to="/enquire" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Enquire Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Programs */}
          <div>
            <h3 className="font-semibold mb-4">Popular Programs</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">MBA Online</li>
              <li className="text-sm text-muted-foreground">BBA Online</li>
              <li className="text-sm text-muted-foreground">MCA Online</li>
              <li className="text-sm text-muted-foreground">BCA Online</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                info@delhieduskills.com
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Delhi EduSkills. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
