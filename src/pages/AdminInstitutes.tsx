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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast" // Updated import here
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Tables } from "@/integrations/supabase/types"

type Institute = Tables<"institutes">

export { InstitutesManagement }
export default function InstitutesManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInstitute, setEditingInstitute] = useState<Institute | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    location: "",
    logo_url: "",
    website_url: "",
    established_year: "",
    rating: "",
    approvals: "",
  })

  // Fetch institutes
  const { data: institutes, isLoading } = useQuery({
    queryKey: ["admin-institutes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("institutes").select("*").order("name")
      if (error) throw error
      return data as Institute[]
    },
  })

  // Filter institutes
  const filteredInstitutes = useMemo(() => {
    return (
      institutes?.filter(
        (inst) =>
          inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inst.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    )
  }, [institutes, searchTerm])

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (editingInstitute) {
        const { error } = await supabase.from("institutes").update(data).eq("id", editingInstitute.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("institutes").insert([data])
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-institutes"] })
      toast({
        title: "Success",
        description: editingInstitute ? "Institute updated successfully" : "Institute created successfully",
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("institutes").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-institutes"] })
      toast({
        title: "Success",
        description: "Institute deleted successfully",
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
      description: "",
      location: "",
      logo_url: "",
      website_url: "",
      established_year: "",
      rating: "",
      approvals: "",
    })
    setEditingInstitute(null)
  }

  const handleEdit = (institute: Institute) => {
    setEditingInstitute(institute)
    setFormData({
      name: institute.name,
      slug: institute.slug || institute.name.toLowerCase().replace(/\s+/g, "-"),
      description: institute.description || "",
      location: institute.location || "",
      logo_url: institute.logo_url || "",
      website_url: institute.website_url || "",
      established_year: institute.established_year?.toString() || "",
      rating: institute.rating?.toString() || "",
      approvals: institute.approvals?.join(", ") || "",
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, "-"),
      description: formData.description,
      location: formData.location,
      logo_url: formData.logo_url,
      website_url: formData.website_url,
      established_year: formData.established_year ? Number.parseInt(formData.established_year) : null,
      rating: formData.rating ? Number.parseFloat(formData.rating) : null,
      approvals: formData.approvals ? formData.approvals.split(",").map((a) => a.trim()) : [],
    }
    mutation.mutate(submitData)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Search institutes..."
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
              Add Institute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingInstitute ? "Edit Institute" : "Add New Institute"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Institute Name *</Label>
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="established_year">Established Year</Label>
                  <Input
                    id="established_year"
                    type="number"
                    value={formData.established_year}
                    onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="approvals">Approvals (comma-separated)</Label>
                <Input
                  id="approvals"
                  value={formData.approvals}
                  onChange={(e) => setFormData({ ...formData, approvals: e.target.value })}
                  placeholder="e.g., AICTE, UGC, NAAC"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save Institute"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Institutes List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading institutes...</p>
          ) : filteredInstitutes.length === 0 ? (
            <p className="text-muted-foreground">No institutes found</p>
          ) : (
            <div className="space-y-2 overflow-x-auto">
              {filteredInstitutes.map((institute) => (
                <div
                  key={institute.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{institute.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{institute.location}</p>
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(institute)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(institute.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
