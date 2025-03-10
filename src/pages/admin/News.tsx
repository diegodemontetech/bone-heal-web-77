
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewsAIGenerator } from "@/components/admin/NewsAIGenerator";
import { NewsForm } from "@/components/admin/news/NewsForm";
import { NewsTable } from "@/components/admin/news/NewsTable";

const AdminNews = () => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    featured_image: "",
    category: "",
    tags: "",
  });

  const handleEdit = (news: any) => {
    setEditingId(news.id);
    setFormData({
      title: news.title,
      slug: news.slug,
      summary: news.summary || "",
      content: news.content || "",
      featured_image: news.featured_image || "",
      category: news.category || "",
      tags: news.tags || "",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      summary: "",
      content: "",
      featured_image: "",
      category: "",
      tags: "",
    });
  };

  const refetchNews = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-news"] });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notícias</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Notícia
        </Button>
      </div>

      <NewsAIGenerator onNewsGenerated={refetchNews} />

      <div className="bg-white rounded-lg shadow">
        <NewsTable onEdit={handleEdit} onDelete={refetchNews} />
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Editar Notícia" : "Nova Notícia"}
            </DialogTitle>
          </DialogHeader>
          <NewsForm 
            editingId={editingId}
            formData={formData}
            setFormData={setFormData}
            handleCloseForm={handleCloseForm}
            refetch={refetchNews}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNews;
