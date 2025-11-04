import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Star, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Institutes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: institutes, isLoading } = useQuery({
    queryKey: ["all-institutes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutes")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const filteredInstitutes = institutes?.filter((institute) =>
    institute.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institute.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg">Loading universities...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero overflow-hidden">
          <div className="absolute inset-0 bg-primary/95"></div>
          <div className="container mx-auto max-w-6xl text-center relative z-10 py-16 px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Top UGC-Approved Universities
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto">
              Explore India's leading universities offering quality online education
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 px-4 bg-card border-b border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="max-w-md">
              <Input
                type="search"
                placeholder="Search universities by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </section>

        {/* Institutes Grid */}
        <section className="py-12 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            {filteredInstitutes && filteredInstitutes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstitutes.map((institute) => (
                  <Card
                    key={institute.id}
                    className="hover:shadow-card transition-shadow border-border"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl line-clamp-2">
                          {institute.name}
                        </CardTitle>
                        {institute.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-semibold">{institute.rating}</span>
                          </div>
                        )}
                      </div>
                      {institute.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{institute.location}</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {institute.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {institute.description}
                        </p>
                      )}

                      {institute.approvals && institute.approvals.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {institute.approvals.slice(0, 3).map((approval, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {approval}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link to={`/institute/${institute.slug}`}>
                            View Details
                          </Link>
                        </Button>
                        {institute.website_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={institute.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No universities found matching your search.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Institutes;
