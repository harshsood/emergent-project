import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  city: z.string().optional(),
  institute_id: z.string().optional(),
  course_id: z.string().optional(),
  message: z.string().optional(),
});

type EnquiryForm = z.infer<typeof enquirySchema>;

const Enquire = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnquiryForm>({
    resolver: zodResolver(enquirySchema),
  });

  const selectedInstitute = watch("institute_id");

  const { data: institutes } = useQuery({
    queryKey: ["institutes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("institutes")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: courses } = useQuery({
    queryKey: ["courses-for-enquiry", selectedInstitute],
    queryFn: async () => {
      let query = supabase.from("courses").select("id, name").order("name");
      
      if (selectedInstitute) {
        query = query.eq("institute_id", selectedInstitute);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EnquiryForm) => {
      const { error } = await supabase.from("enquiries").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city || null,
        institute_id: data.institute_id || null,
        course_id: data.course_id || null,
        message: data.message || null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enquiry submitted successfully! We'll contact you soon.");
      reset();
    },
    onError: () => {
      toast.error("Failed to submit enquiry. Please try again.");
    },
  });

  const onSubmit = (data: EnquiryForm) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Get Free Counseling
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Fill out the form below and our education counselors will get in
              touch with you to help find the perfect program for your career
              goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <Card className="md:col-span-2 border-border">
              <CardHeader>
                <CardTitle>Enquiry Form</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+91 1234567890"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="Your city"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="institute">Interested University</Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("institute_id", value);
                        setValue("course_id", undefined);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a university" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutes?.map((institute) => (
                          <SelectItem key={institute.id} value={institute.id}>
                            {institute.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="course">Interested Course</Label>
                    <Select
                      onValueChange={(value) => setValue("course_id", value)}
                      disabled={!courses || courses.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses?.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Tell us about your educational goals..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit Enquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">
                        info@delhieduskills.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        +91 98765 43210
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Connaught Place, New Delhi, Delhi 110001
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <MessageSquare className="w-8 h-8 mb-3" />
                  <h3 className="font-bold mb-2">Quick Response</h3>
                  <p className="text-sm opacity-90">
                    Our counselors typically respond within 24 hours during
                    business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Enquire;
