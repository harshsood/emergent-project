import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale } from "lucide-react";
import { Link } from "react-router-dom";

export const ComparisonWidget = () => {
  const [selectedCourseName, setSelectedCourseName] = useState<string>("");
  const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>(["", "", ""]);

  // Get unique course names
  const { data: courseNames } = useQuery({
    queryKey: ["unique-course-names"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("name")
        .order("name");
      
      if (error) throw error;
      
      // Get unique course names
      const uniqueNames = Array.from(new Set(data.map(c => c.name)));
      return uniqueNames;
    },
  });

  // Get institutes offering the selected course
  const { data: availableInstitutes } = useQuery({
    queryKey: ["institutes-for-course", selectedCourseName],
    queryFn: async () => {
      if (!selectedCourseName) return [];
      
      const { data, error } = await supabase
        .from("courses")
        .select(`
          id,
          slug,
          institutes (
            id,
            name,
            slug
          )
        `)
        .eq("name", selectedCourseName);
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCourseName,
  });

  const handleCourseNameChange = (value: string) => {
    setSelectedCourseName(value);
    setSelectedInstitutes(["", "", ""]); // Reset institute selection
  };

  const handleInstituteSelect = (index: number, value: string) => {
    const newSelected = [...selectedInstitutes];
    newSelected[index] = value;
    setSelectedInstitutes(newSelected);
  };

  const canCompare = selectedCourseName && selectedInstitutes.filter(i => i !== "").length >= 2;

  return (
    <section className="py-16 px-4 bg-accent/30">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Scale className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl md:text-3xl">Compare Courses</CardTitle>
            <CardDescription className="text-base">
              Select a course, then choose up to 3 colleges to compare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Course Name Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Course Type *
              </label>
              <Select value={selectedCourseName} onValueChange={handleCourseNameChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course (e.g., MBA, BBA)..." />
                </SelectTrigger>
                <SelectContent>
                  {courseNames?.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Institute Selection */}
            {selectedCourseName && (
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium">
                      College {index + 1} {index < 2 && "*"}
                    </label>
                    <Select
                      value={selectedInstitutes[index]}
                      onValueChange={(value) => handleInstituteSelect(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select college..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInstitutes?.map((course) => (
                          <SelectItem 
                            key={course.id} 
                            value={course.slug}
                            disabled={selectedInstitutes.includes(course.slug) && selectedInstitutes[index] !== course.slug}
                          >
                            {course.institutes?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                to={`/compare?course=${encodeURIComponent(selectedCourseName)}&institutes=${selectedInstitutes.filter(i => i !== "").join(",")}`}
              >
                <Button
                  size="lg"
                  disabled={!canCompare}
                  className="min-w-[200px]"
                >
                  Compare Now
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              * Select a course type and at least 2 colleges to compare
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
