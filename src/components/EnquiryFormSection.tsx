import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  degree: z.string().min(1, "Please select a degree"),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const EnquiryFormSection = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("enquiries").insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferred_course: data.degree,
          message: data.message || "",
        },
      ]);

      if (error) throw error;

      toast.success("Thank you! We'll get back to you soon.");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-16 px-4 bg-card">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Excited to Explore Your Career Pathways?
          </h2>
          <p className="text-muted-foreground">
            Get Counselor Advice Today For Choosing The Right Career Path!
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Discover the possibilities with our expert guidance. Our experienced counselors are ready to help you navigate your career journey and achieve your goals.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name*</Label>
              <Input
                id="name"
                placeholder="Name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number*</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 0000000000"
                {...register("phone")}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                type="email"
                placeholder="abc@example.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Select an Option *</Label>
              <Select onValueChange={(value) => setValue("degree", value)}>
                <SelectTrigger className={errors.degree ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select from here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mba">MBA</SelectItem>
                  <SelectItem value="bba">BBA</SelectItem>
                  <SelectItem value="bca">BCA</SelectItem>
                  <SelectItem value="mca">MCA</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.degree && (
                <p className="text-sm text-destructive">{errors.degree.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">Choose Your Preferred University *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select from here" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amity">Amity University</SelectItem>
                <SelectItem value="nmims">NMIMS</SelectItem>
                <SelectItem value="lpu">LPU</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">How May We Help You?</Label>
            <Textarea
              id="message"
              placeholder="Enter Text"
              {...register("message")}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
