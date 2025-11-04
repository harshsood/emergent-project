import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const FeaturedUniversities = () => {
  const { data: institutes, isLoading } = useQuery({
    queryKey: ["institutes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutes")
        .select("*")
        .order("rating", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Loading...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Universities</h2>
          <p className="text-muted-foreground text-lg">
            Explore online programs from India's most prestigious institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {institutes?.map((institute) => (
            <Card key={institute.id} className="hover:shadow-lg transition-all duration-300 border-border shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{institute.name}</CardTitle>
                  {institute.rating && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      {institute.rating}
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {institute.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground line-clamp-3">
                  {institute.description}
                </p>
                
                {institute.approvals && institute.approvals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {institute.approvals.slice(0, 3).map((approval, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {approval}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Link to={`/institute/${institute.slug}`} className="flex-1">
                    <Button className="w-full" variant="default">
                      View Details
                    </Button>
                  </Link>
                  {institute.website_url && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={institute.website_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/institutes">
            <Button variant="outline" size="lg">
              View All Universities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
