import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Clock,
  IndianRupee,
  BookOpen,
  Award,
  CheckCircle,
} from "lucide-react";

const CourseDetail = () => {
  const { slug } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          institutes (
            name,
            slug,
            location,
            approvals
          )
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
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

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button asChild>
              <Link to="/courses">Browse Courses</Link>
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
        {/* Hero Section with Video Embed Style */}
        <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
          <div className="container mx-auto max-w-6xl px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left: Content */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  {course.name}
                </h1>
                <p className="text-base md:text-lg text-white/90 mb-6 leading-relaxed">
                  {course.description || `Get admission in ${course.name} and experience exponential growth in your career. This program is designed to provide students with comprehensive understanding and industry-relevant skills.`}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button className="bg-accent hover:bg-accent/90 text-white" asChild>
                    <Link to="/enquire">Get 100% Free Counseling</Link>
                  </Button>
                </div>

                {/* Quick Navigation Pills */}
                <div className="flex flex-wrap gap-2">
                  <a href="#overview" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition">
                    Overview
                  </a>
                  <a href="#eligibility" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition">
                    Eligibility
                  </a>
                  <a href="#specializations" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition">
                    Specialization
                  </a>
                  <a href="#universities" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm transition">
                    Top Universities
                  </a>
                </div>
              </div>

              {/* Right: Video/Image Placeholder */}
              <div className="flex justify-center">
                <div className="w-full max-w-lg aspect-video bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center">
                  <div className="text-center text-white/70">
                    <BookOpen className="w-16 h-16 mx-auto mb-2" />
                    <p className="text-sm">Course Overview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Facts Table */}
        <section className="bg-card border-y border-border">
          <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Degree</p>
                <p className="font-semibold">{course.level}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Form</p>
                <p className="font-semibold">{course.name.split(' ').slice(0, 3).join(' ')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligibility</p>
                <p className="font-semibold">{course.eligibility || "Graduation"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Semester Fee</p>
                <p className="font-semibold">
                  {course.fee_min ? `₹${course.fee_min.toLocaleString("en-IN")}` : "Varies"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            {/* What is Course Section */}
            <article id="overview" className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What Is {course.name}?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {course.description || `An ${course.name} is a digital adaptation of the traditional program, tailored to provide core knowledge to aspiring students through online platforms. This course allows students to pursue their degrees from anywhere, accommodating professionals who may not have the time or means to attend on-campus classes.`}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Key features include asynchronous and synchronous learning, use of advanced Learning Management Systems (LMS), and cost-effectiveness compared to traditional programs. The courses are based on technology and self-paced learning, making them especially appealing for those seeking to balance education with other commitments.
              </p>
            </article>

            {/* Eligibility & Duration */}
            <article id="eligibility" className="mb-12 bg-card p-6 rounded-lg border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Eligibility & Duration</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-primary" />
                    Eligibility Criteria
                  </h3>
                  <p className="text-muted-foreground">{course.eligibility || "Graduation from a recognized university"}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Program Duration
                  </h3>
                  <p className="text-muted-foreground">{course.duration}</p>
                  <p className="text-sm text-muted-foreground mt-1">Mode: {course.mode}</p>
                </div>
              </div>
            </article>

            {/* Specializations */}
            {course.specializations && course.specializations.length > 0 && (
              <article id="specializations" className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {course.name} Specializations
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {course.specializations.map((spec, idx) => (
                    <Card key={idx} className="border-border hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start">
                          <GraduationCap className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-1" />
                          <span className="font-medium">{spec}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </article>
            )}

            {/* Top Universities Section */}
            <article id="universities" className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Top Universities Offering {course.name}</h2>
              {course.institutes && (
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{course.institutes.name}</h3>
                        {course.institutes.location && (
                          <p className="text-sm text-muted-foreground mb-3">{course.institutes.location}</p>
                        )}
                        {course.institutes.approvals && course.institutes.approvals.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {course.institutes.approvals.map((approval, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {approval}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button variant="default" asChild>
                            <Link to={`/institute/${course.institutes.slug}`}>View Details</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/enquire">Get Help</Link>
                          </Button>
                        </div>
                      </div>
                      {course.rating && (
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Award className="w-5 h-5 text-primary" />
                            <span className="text-2xl font-bold">{course.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Rating</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </article>

            {/* Career Scope */}
            <article className="mb-12 bg-primary text-primary-foreground p-8 rounded-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Career Scope After {course.name}</h2>
              <p className="text-primary-foreground/90 leading-relaxed mb-4">
                Graduates of {course.name} programs have access to diverse career opportunities across multiple industries. The comprehensive curriculum prepares students for leadership roles in their chosen fields.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <Link to="/enquire">Explore Career Options</Link>
              </Button>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
