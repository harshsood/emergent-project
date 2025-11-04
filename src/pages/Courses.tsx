import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Clock, IndianRupee, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<string>("all");

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          institutes (
            name,
            slug,
            location
          )
        `)
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.institutes?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesMode = modeFilter === "all" || course.mode === modeFilter;
    
    return matchesSearch && matchesLevel && matchesMode;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="relative bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-primary/95"></div>
          <div className="container mx-auto max-w-6xl relative z-10 py-16 px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Explore Online Courses</h1>
            <p className="text-lg md:text-xl text-white/95 max-w-2xl">
              Browse through our extensive catalog of online programs
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 px-4 bg-card border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search courses or universities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Course Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="UG">Undergraduate</SelectItem>
                  <SelectItem value="PG">Postgraduate</SelectItem>
                  <SelectItem value="Diploma">Diploma</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modeFilter} onValueChange={setModeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            ) : filteredCourses && filteredCourses.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-all duration-300 shadow-card">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
                          {course.rating && (
                            <Badge variant="secondary" className="flex items-center gap-1 ml-2 shrink-0">
                              <Star className="w-3 h-3 fill-primary text-primary" />
                              {course.rating}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {course.institutes?.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{course.level}</Badge>
                          <Badge variant="outline">{course.mode}</Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                          {course.fee_min && course.fee_max && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <IndianRupee className="w-4 h-4" />
                              <span>₹{course.fee_min.toLocaleString()} - ₹{course.fee_max.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        <Link to={`/course/${course.slug}`}>
                          <Button className="w-full mt-4">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No courses found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
