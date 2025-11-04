import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Star,
  GraduationCap,
  Clock,
  IndianRupee,
  Award,
} from "lucide-react";

const InstituteDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: institute, isLoading: instituteLoading } = useQuery({
    queryKey: ["institute", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutes")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["institute-courses", institute?.id],
    queryFn: async () => {
      if (!institute?.id) return [];
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("institute_id", institute.id)
        .order("name");

      if (error) throw error;
      return data;
    },
    enabled: !!institute?.id,
  });

  if (instituteLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!institute) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Institute Not Found</h1>
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Title / Info */}
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4">
                  {institute.name}
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                  Get admission in {institute.name} and experience exponential growth in your career. The university is UGC-DEB recognised, which ensures your degree's validity. {institute.name} course admissions are seamless, industry relevant, and provide endless opportunities.
                </p>

                {/* Accreditation Badges */}
                {institute.approvals && institute.approvals.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {institute.approvals.map((approval, idx) => (
                      <div key={idx} className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Course Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {courses && courses.slice(0, 8).map((c: any) => (
                    <Badge key={c.id} variant="secondary" className="px-3 py-1">
                      <Link to={`/course/${c.slug}`}>{c.level}</Link>
                    </Badge>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-accent hover:bg-accent/90" asChild>
                    <Link to="/enquire">Download Brochure</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/enquire">Get Help</Link>
                  </Button>
                  <Button variant="default" asChild>
                    <Link to={`/compare?institute=${institute.slug}`}>Add to Compare</Link>
                  </Button>
                </div>
              </div>

              {/* Right: Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg border border-border">
                  <div className="relative">
                    {institute.rating && (
                      <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-md flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-bold">{institute.rating}</span>
                      </div>
                    )}
                    <img
                      src={institute.logo_url || "/images/placeholder-hero.jpg"}
                      alt={institute.name}
                      className="w-full h-64 object-cover"
                      onError={(e) => ((e.target as HTMLImageElement).src = "/images/placeholder-hero.jpg")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Navigation */}
        <section className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
          <div className="container mx-auto max-w-6xl px-4">
            <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-3">
              <a href="#about" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">About</a>
              <a href="#programs" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Courses</a>
              <a href="#emi" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">EMI</a>
              <a href="#benefits" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Benefits</a>
              <a href="#exam" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Exam</a>
              <a href="#approvals" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Approvals</a>
              <a href="#placement" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Placement</a>
              <a href="#degree" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Degree</a>
              <a href="#admissions" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Admission</a>
              <a href="#alternative" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">Alternative</a>
              <a href="#faqs" className="px-4 py-2 hover:bg-white/10 rounded whitespace-nowrap text-sm transition">FAQs</a>
            </nav>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto max-w-6xl px-4 py-12">
          {/* About Section */}
          <article id="about" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">About {institute.name}</h2>
            <div className="prose max-w-none text-muted-foreground leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: institute.description || `<p>${institute.name} is a top choice for online education in India. The university offers affordable fees, EMI options, and placement support. Students get live weekend classes, recorded videos, and 24/7 study resources.</p>` }} />
            </div>
          </article>

          {/* Accreditations Section */}
          <article id="approvals" className="mb-12 bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{institute.name} Accreditations, Approvals and Ranking</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {institute.name} holds several accreditations and approvals that solidify its legitimacy and the value of its degrees. These recognitions ensure that the programs offered meet high academic standards and are widely accepted by employers.
            </p>
            
            {institute.approvals && institute.approvals.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {institute.approvals.map((approval, idx) => (
                  <Card key={idx} className="border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Accreditations & Approvals</h3>
                          <p className="font-medium text-primary mb-1">{approval}</p>
                          <p className="text-sm text-muted-foreground">
                            {institute.name} is recognized, ensuring your degree is widely accepted and valued.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </article>

          {/* Courses / Programs */}
          <article id="programs" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Programs Offered</h2>

            {coursesLoading ? (
              <p>Loading courses...</p>
            ) : courses && courses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course: any) => (
                  <Card key={course.id} className="border-border hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                        <Badge variant="outline" className="text-xs">{course.mode}</Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{course.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {course.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{course.description}</p>
                      )}

                      <div className="flex flex-wrap gap-3 items-center text-sm mb-3">
                        {course.duration && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            <span>{course.duration}</span>
                          </div>
                        )}
                        {course.fee_min && (
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                            <span>
                              ₹{course.fee_min.toLocaleString("en-IN")}
                              {course.fee_max && ` - ₹${course.fee_max.toLocaleString("en-IN")}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" asChild className="flex-1">
                          <Link to={`/course/${course.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No programs listed.</p>
            )}
          </article>

          {/* Admissions & Fee Structure */}
          <article id="admissions" className="mb-12 bg-card p-6 rounded-lg border border-border">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Admissions & Fee Structure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Eligibility</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Refer to the institute for program-specific eligibility.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3">Fees</h3>
                <p className="text-muted-foreground">Fee details vary by program. Contact admissions.</p>
              </div>
            </div>
          </article>

          {/* FAQs */}
          <article id="faqs" className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <details className="p-4 bg-card rounded-lg border border-border">
                <summary className="font-medium cursor-pointer">How do I apply?</summary>
                <div className="mt-3 text-muted-foreground">Visit the institute website or contact admissions for application steps.</div>
              </details>
              <details className="p-4 bg-card rounded-lg border border-border">
                <summary className="font-medium cursor-pointer">Is the degree recognized?</summary>
                <div className="mt-3 text-muted-foreground">Recognition varies; check institute approvals listed above.</div>
              </details>
              <details className="p-4 bg-card rounded-lg border border-border">
                <summary className="font-medium cursor-pointer">What are the placement opportunities?</summary>
                <div className="mt-3 text-muted-foreground">{institute.name} provides placement support to help students connect with potential employers.</div>
              </details>
            </div>
          </article>
        </section>

        {/* CTA */}
        <section className="py-12 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-6xl text-center">
            <h3 className="text-2xl font-semibold">Ready to take the next step?</h3>
            <p className="mt-2 text-sm">Connect with admissions for detailed program guidance.</p>
            <div className="mt-4">
              <Link to="/enquire">
                <Button variant="secondary" className="px-6 py-3">Contact Admissions</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InstituteDetail;
