"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast" // Updated import statement
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Tables } from "@/integrations/supabase/types"

type Course = Tables<"courses">
type Institute = Tables<"institutes">

export { CoursesManagement }
export default function CoursesManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    institute_id: "",
    description: "",
    duration: "",
    level: "",
    mode: "",
    fee_min: "",
    fee_max: "",
    eligibility: "",
    specializations: "",
    accreditation: "",
    rating: "",
  })

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("name")
      if (error) throw error
      return data as Course[]
    },
  })

  // Fetch institutes for dropdown
  const { data: institutes } = useQuery({
    queryKey: ["institutes-for-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutes").select("id, name").order("name")
      if (error) throw error
      return data as Institute[]
    },
  })

  const filteredCourses = useMemo(() => {
    return courses?.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase())) || []
  }, [courses, searchTerm])

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingCourse) {
        const { error } = await supabase.from("courses").update(data).eq("id", editingCourse.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("courses").insert([data])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
      toast({
        title: "Success",
        description: editingCourse ? "Course updated successfully" : "Course created successfully",
      })
      setIsDialogOpen(false)
      resetForm()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] })
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    },
  })

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      institute_id: "",
      description: "",
      duration: "",
      level: "",
      mode: "",
      fee_min: "",
      fee_max: "",
      eligibility: "",
      specializations: "",
      accreditation: "",
      rating: "",
    })
    setEditingCourse(null)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      slug: course.slug,
      institute_id: course.institute_id,
      description: course.description || "",
      duration: course.duration,
      level: course.level,
      mode: course.mode,
      fee_min: course.fee_min?.toString() || "",
      fee_max: course.fee_max?.toString() || "",
      eligibility: course.eligibility || "",
      specializations: course.specializations?.join(", ") || "",
      accreditation: course.accreditation?.join(", ") || "",
      rating: course.rating?.toString() || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      institute_id: formData.institute_id,
      description: formData.description,
      duration: formData.duration,
      level: formData.level,
      mode: formData.mode,
      fee_min: formData.fee_min ? Number.parseFloat(formData.fee_min) : null,
      fee_max: formData.fee_max ? Number.parseFloat(formData.fee_max) : null,
      eligibility: formData.eligibility,
      specializations: formData.specializations ? formData.specializations.split(",").map((s) => s.trim()) : [],
      accreditation: formData.accreditation ? formData.accreditation.split(",").map((a) => a.trim()) : [],
      rating: formData.rating ? Number.parseFloat(formData.rating) : null,
    }
    mutation.mutate(submitData)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsDialogOpen(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Course Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated from name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="institute_id">Institute *</Label>
                <Select
                  value={formData.institute_id}
                  onValueChange={(value) => setFormData({ ...formData, institute_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes?.map((inst) => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UG">Undergraduate</SelectItem>
                      <SelectItem value="PG">Postgraduate</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="mode">Mode *</Label>
                  <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 years"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fee_min">Min Fee (₹)</Label>
                  <Input
                    id="fee_min"
                    type="number"
                    value={formData.fee_min}
                    onChange={(e) => setFormData({ ...formData, fee_min: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fee_max">Max Fee (₹)</Label>
                  <Input
                    id="fee_max"
                    type="number"
                    value={formData.fee_max}
                    onChange={(e) => setFormData({ ...formData, fee_max: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="eligibility">Eligibility</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  rows={2}
                  placeholder="e.g., Bachelor's degree from recognized university"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                  <Input
                    id="specializations"
                    value={formData.specializations}
                    onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                    placeholder="e.g., AI, Data Science, Cloud Computing"
                  />
                </div>
                <div>
                  <Label htmlFor="accreditation">Accreditation (comma-separated)</Label>
                  <Input
                    id="accreditation"
                    value={formData.accreditation}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                    placeholder="e.g., AICTE, NAAC"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading courses...</p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-muted-foreground">No courses found</p>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              {filteredCourses.map((course) => {
                const institute = institutes?.find((i) => i.id === course.institute_id)
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{course.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {institute?.name} • {course.level} • {course.mode}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(course.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
