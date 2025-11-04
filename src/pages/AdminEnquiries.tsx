"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Eye } from "lucide-react"
import type { Tables } from "@/integrations/supabase/types"

type Enquiry = Tables<"enquiries">

export { EnquiriesManagement }
export default function EnquiriesManagement() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [statusUpdate, setStatusUpdate] = useState("new")

  // Fetch enquiries
  const { data: enquiries, isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data as Enquiry[]
    },
  })

  const filteredEnquiries = useMemo(() => {
    return (
      enquiries?.filter((enquiry) => {
        const matchesSearch =
          enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          enquiry.phone.includes(searchTerm)
        const matchesStatus = filterStatus === "all" || enquiry.status === filterStatus
        return matchesSearch && matchesStatus
      }) || []
    )
  }, [enquiries, searchTerm, filterStatus])

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      const { error } = await supabase.from("enquiries").update({ status: data.status }).eq("id", data.id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] })
      toast({
        title: "Success",
        description: "Enquiry status updated",
      })
      setIsDetailOpen(false)
      setSelectedEnquiry(null)
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
      const { error } = await supabase.from("enquiries").delete().eq("id", id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-enquiries"] })
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
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

  const handleViewDetail = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry)
    setStatusUpdate(enquiry.status || "new")
    setIsDetailOpen(true)
  }

  const handleStatusUpdate = () => {
    if (selectedEnquiry) {
      updateStatusMutation.mutate({
        id: selectedEnquiry.id,
        status: statusUpdate,
      })
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-yellow-100 text-yellow-800"
      case "interested":
        return "bg-green-100 text-green-800"
      case "not-interested":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:flex-1"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="not-interested">Not Interested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enquiries ({filteredEnquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading enquiries...</p>
          ) : filteredEnquiries.length === 0 ? (
            <p className="text-muted-foreground">No enquiries found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">City</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{enquiry.name}</td>
                      <td className="py-3 px-4 truncate">{enquiry.email}</td>
                      <td className="py-3 px-4">{enquiry.phone}</td>
                      <td className="py-3 px-4">{enquiry.city || "-"}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(enquiry.status)}`}>
                          {enquiry.status || "new"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        {enquiry.created_at ? new Date(enquiry.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetail(enquiry)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(enquiry.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedEnquiry && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Enquiry Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="font-semibold">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-semibold break-all">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="font-semibold">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">City</Label>
                  <p className="font-semibold">{selectedEnquiry.city || "-"}</p>
                </div>
              </div>

              {selectedEnquiry.message && (
                <div>
                  <Label className="text-xs text-muted-foreground">Message</Label>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap break-words">
                    {selectedEnquiry.message}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <Button onClick={handleStatusUpdate} disabled={updateStatusMutation.isPending}>
                  {updateStatusMutation.isPending ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
