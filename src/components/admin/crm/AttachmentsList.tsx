
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Attachment } from "@/types/crm";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { File, Upload, Trash, Download, FileText, FileImage, FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AttachmentsListProps {
  contactId: string;
}

export const AttachmentsList = ({ contactId }: AttachmentsListProps) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    fetchAttachments();
  }, [contactId]);
  
  const fetchAttachments = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("crm_attachments")
        .select("*, user:user_id(full_name)")
        .eq("contact_id", contactId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Mapear para o formato esperado
      const formattedAttachments: Attachment[] = (data || []).map(attachment => ({
        id: attachment.id,
        file_name: attachment.file_name,
        file_url: attachment.file_url,
        file_type: attachment.file_type,
        created_at: attachment.created_at,
        contact_id: attachment.contact_id,
        user_id: attachment.user_id,
        user: attachment.user
      }));
      
      setAttachments(formattedAttachments);
    } catch (error) {
      console.error("Erro ao buscar anexos:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Upload do arquivo para o storage
      const fileExt = file.name.split('.').pop();
      const filePath = `crm_attachments/${contactId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('crm_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Gerar URL pública
      const { data: urlData } = supabase.storage
        .from('crm_files')
        .getPublicUrl(filePath);
        
      // Registrar no banco de dados
      const { error: dbError } = await supabase
        .from("crm_attachments")
        .insert({
          contact_id: contactId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          created_at: new Date().toISOString()
        });
        
      if (dbError) throw dbError;
      
      toast.success("Arquivo enviado com sucesso!");
      fetchAttachments();
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      toast.error("Erro ao enviar arquivo");
    } finally {
      setUploading(false);
      // Limpar input
      e.target.value = '';
    }
  };
  
  const deleteAttachment = async (id: string, url: string) => {
    if (!confirm("Tem certeza que deseja excluir este anexo?")) return;
    
    try {
      // Extrair caminho do storage da URL
      const pathMatch = url.match(/\/storage\/v1\/object\/public\/crm_files\/(.+)/);
      if (pathMatch && pathMatch[1]) {
        // Excluir arquivo do storage
        await supabase.storage
          .from('crm_files')
          .remove([pathMatch[1]]);
      }
      
      // Excluir registro do banco
      const { error } = await supabase
        .from("crm_attachments")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      setAttachments(prev => prev.filter(att => att.id !== id));
      toast.success("Anexo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir anexo:", error);
      toast.error("Erro ao excluir anexo");
    }
  };
  
  const getFileIcon = (fileType: string = '') => {
    if (fileType.includes('image')) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FilePdf className="h-5 w-5 text-red-500" />;
    } else if (fileType.includes('text') || fileType.includes('document')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Carregando anexos...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={uploadFile}
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full cursor-pointer ${
            uploading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {uploading ? (
            <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {uploading ? 'Enviando arquivo...' : 'Enviar arquivo'}
        </label>
      </div>
      
      {attachments.length === 0 && !loading ? (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">Nenhum anexo encontrado</p>
        </div>
      ) : (
        <div className="space-y-2">
          {attachments.map(attachment => (
            <div 
              key={attachment.id} 
              className="p-3 border rounded-md bg-card flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {getFileIcon(attachment.file_type)}
                <div>
                  <p className="text-sm font-medium line-clamp-1">
                    {attachment.file_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true, locale: ptBR })}
                    {attachment.user?.full_name && ` • ${attachment.user.full_name}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a href={attachment.file_url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => deleteAttachment(attachment.id, attachment.file_url)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
