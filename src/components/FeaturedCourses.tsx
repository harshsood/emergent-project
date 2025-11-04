import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturedCourses = () => {
  const { data: courses, isLoading } = useQuery({
    queryKey: ["featured-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select(`
          *,
          institutes (
            name,
            slug
          )
        `)
        .order("rating", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Online Courses
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover top-rated online programs from India's leading universities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-card transition-shadow border-border"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.mode}
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  {course.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {course.institutes?.name}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  {course.fee_min && (
                    <div className="flex items-center text-sm">
                      <IndianRupee className="w-4 h-4 mr-2 text-primary" />
                      <span>
                        ₹{course.fee_min.toLocaleString("en-IN")}
                        {course.fee_max &&
                          ` - ₹${course.fee_max.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  )}
                  {course.rating && (
                    <div className="flex items-center text-sm">
                      <GraduationCap className="w-4 h-4 mr-2 text-primary" />
                      <span>Rating: {course.rating}/5</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" asChild>
                    <Link to={`/course/${course.slug}`}>View Details</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/enquire">Enquire</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button size="lg" variant="outline" asChild>
            <Link to="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
