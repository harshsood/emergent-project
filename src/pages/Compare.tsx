import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, IndianRupee, Star, Award, Download, Lock } from "lucide-react";
import { z } from "zod";

const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100).optional(),
});

export default function Compare() {
  const [searchParams] = useSearchParams();
  const courseName = searchParams.get("course");
  const instituteSlugs = searchParams.get("institutes")?.split(",").filter(Boolean) || [];
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Fetch course data for comparison
  const { data: courses, isLoading } = useQuery({
    queryKey: ["compare-courses", courseName, instituteSlugs],
    queryFn: async () => {
      if (!courseName || instituteSlugs.length < 2) return [];
      
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          institutes (
            id,
            name,
            slug,
            location,
            approvals,
            rating,
            established_year
          )
        `)
        .eq("name", courseName)
        .in("slug", instituteSlugs);
      
      if (error) throw error;
      return data;
    },
    enabled: !!courseName && instituteSlugs.length >= 2,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const courseIds = courses?.map(c => c.id) || [];
      
      const { error } = await supabase
        .from("comparison_registrations")
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: data.city || null,
          compared_courses: courseIds,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      setIsRegistered(true);
      toast({
        title: "Registration successful!",
        description: "You can now view the comparison results below.",
      });
    },
    onError: (error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    try {
      const validated = registrationSchema.parse(formData);
      registerMutation.mutate({
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
        city: validated.city || "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Feature coming soon",
      description: "PDF download will be available shortly.",
    });
  };

  if (!courseName || instituteSlugs.length < 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Invalid Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Please select a course type and at least 2 colleges to compare.
              </p>
              <Button asChild>
                <a href="/">Return to Home</a>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-hero text-primary-foreground py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">Compare {courseName}</h1>
            <p className="text-lg text-primary-foreground/90">
              Side-by-side comparison across {instituteSlugs.length} institutions
            </p>
          </div>
        </section>

        {/* Registration Form or Comparison Results */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {!isRegistered ? (
              <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">Register to View Comparison</CardTitle>
                  <p className="text-muted-foreground">
                    Fill in your details to unlock the detailed comparison results
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="9876543210"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Your city"
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={registerMutation.isPending}>
                      {registerMutation.isPending ? "Registering..." : "Register & View Comparison"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By registering, you agree to receive educational guidance from Delhi EduSkills
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Download Button */}
                <div className="flex justify-end">
                  <Button onClick={handleDownloadPDF} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download as PDF
                  </Button>
                </div>

                {/* Comparison Table */}
                {isLoading ? (
                  <p className="text-center text-muted-foreground">Loading comparison...</p>
                ) : courses && courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-card rounded-lg overflow-hidden shadow-lg">
                      <thead>
                        <tr className="bg-primary text-primary-foreground">
                          <th className="p-4 text-left font-semibold">Criteria</th>
                          {courses.map((course) => (
                            <th key={course.id} className="p-4 text-left font-semibold">
                              {course.institutes?.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Location</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">{course.institutes?.location}</td>
                          ))}
                        </tr>
                        
                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Duration</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                {course.duration}
                              </div>
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Fee Range</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                                <span>₹{course.fee_min?.toLocaleString()} - ₹{course.fee_max?.toLocaleString()}</span>
                              </div>
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Rating</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              {course.rating && (
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 fill-primary text-primary" />
                                  <span>{course.rating}/5</span>
                                </div>
                              )}
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Approvals</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {course.institutes?.approvals?.map((approval, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    <Award className="w-3 h-3 mr-1" />
                                    {approval}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Mode</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              <Badge>{course.mode}</Badge>
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Specializations</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4">
                              <div className="flex flex-wrap gap-1">
                                {course.specializations?.slice(0, 3).map((spec, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {course.specializations && course.specializations.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{course.specializations.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>

                        <tr className="hover:bg-accent/50 transition-colors">
                          <td className="p-4 font-medium">Eligibility</td>
                          {courses.map((course) => (
                            <td key={course.id} className="p-4 text-sm text-muted-foreground">
                              {course.eligibility}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No courses found for comparison.</p>
                )}

                {/* CTA Section */}
                <Card className="bg-accent/30 border-primary/20">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Need Help Deciding?</h3>
                    <p className="text-muted-foreground mb-6">
                      Our education counselors can provide personalized guidance based on your career goals.
                    </p>
                    <Button size="lg" asChild>
                      <a href="/enquire">Talk to a Counselor</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
