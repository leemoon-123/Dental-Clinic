"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Database, 
  FileText,
  MessageSquare,
  BookOpen
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

interface KnowledgeItem {
  _id: string
  title: string
  content: string
  category: string
  keywords: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

const categories = [
  { value: "general", label: "Thông tin chung" },
  { value: "services", label: "Dịch vụ" },
  { value: "procedures", label: "Quy trình điều trị" },
  { value: "aftercare", label: "Chăm sóc sau điều trị" },
  { value: "faq", label: "Câu hỏi thường gặp" },
  { value: "pricing", label: "Bảng giá" },
]

export default function AdminKnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
    keywords: "",
  })

  useEffect(() => {
    fetchKnowledge()
  }, [categoryFilter])

  const fetchKnowledge = async () => {
    try {
      const params = new URLSearchParams()
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      const res = await axios.get(`/api/knowledge?${params.toString()}`)
      setItems(res.data.items || [])
    } catch (error) {
      console.error("Error fetching knowledge:", error)
      toast.error("Lỗi khi tải dữ liệu")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async () => {
    try {
      await axios.post("/api/knowledge", {
        ...formData,
        keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      })
      toast.success("Đã thêm mục kiến thức mới")
      setShowAddDialog(false)
      resetForm()
      fetchKnowledge()
    } catch (error) {
      console.error("Error adding item:", error)
      toast.error("Lỗi khi thêm mục kiến thức")
    }
  }

  const handleEditItem = async () => {
    if (!selectedItem) return
    try {
      await axios.put("/api/knowledge", {
        id: selectedItem._id,
        ...formData,
        keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      })
      toast.success("Đã cập nhật mục kiến thức")
      setShowEditDialog(false)
      resetForm()
      fetchKnowledge()
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error("Lỗi khi cập nhật")
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mục kiến thức này?")) return
    try {
      await axios.delete(`/api/knowledge?id=${id}`)
      toast.success("Đã xóa mục kiến thức")
      fetchKnowledge()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Lỗi khi xóa")
    }
  }

  const toggleItemStatus = async (item: KnowledgeItem) => {
    try {
      await axios.put("/api/knowledge", {
        id: item._id,
        isActive: !item.isActive,
      })
      toast.success(`Đã ${item.isActive ? "tắt" : "bật"} mục kiến thức`)
      fetchKnowledge()
    } catch (error) {
      console.error("Error toggling status:", error)
      toast.error("Lỗi khi cập nhật trạng thái")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "general",
      keywords: "",
    })
    setSelectedItem(null)
  }

  const openEditDialog = (item: KnowledgeItem) => {
    setSelectedItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category,
      keywords: item.keywords.join(", "),
    })
    setShowEditDialog(true)
  }

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value
  }

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.keywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Quản lý cơ sở kiến thức cho chatbot RAG
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mục mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm mục kiến thức</DialogTitle>
              <DialogDescription>
                Thêm nội dung mới vào cơ sở kiến thức cho chatbot
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Quy trình niềng răng"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung chi tiết về kiến thức nha khoa..."
                  rows={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keywords">Từ khóa (phân cách bằng dấu phẩy)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="niềng răng, chỉnh nha, invisalign"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddItem}>Thêm mục</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Tổng mục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-green-500" />
            <CardTitle className="text-base">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {items.filter((i) => i.isActive).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-base">FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {items.filter((i) => i.category === "faq").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <BookOpen className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-base">Quy trình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {items.filter((i) => i.category === "procedures").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Danh sách kiến thức
          </CardTitle>
          <CardDescription>
            Dữ liệu sẽ được sử dụng bởi chatbot RAG để trả lời câu hỏi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, nội dung, từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Lọc danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Từ khóa</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy mục kiến thức nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {item.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.keywords.slice(0, 3).map((keyword, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {item.keywords.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.keywords.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={item.isActive ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => toggleItemStatus(item)}
                        >
                          {item.isActive ? "Hoạt động" : "Tạm tắt"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteItem(item._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mục kiến thức</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung kiến thức
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Nội dung</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-keywords">Từ khóa</Label>
              <Input
                id="edit-keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditItem}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
