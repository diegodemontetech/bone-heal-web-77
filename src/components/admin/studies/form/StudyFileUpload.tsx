
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";

interface StudyFileUploadProps {
  fileUrl: string;
  isUploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingStudy: any;
}

export const StudyFileUpload = ({
  fileUrl,
  isUploading,
  handleFileChange,
  editingStudy
}: StudyFileUploadProps) => {
  return (
    <div className="col-span-2">
      <Label htmlFor="file">Arquivo PDF</Label>
      <div className="flex items-center gap-2">
        <Input
          id="file"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="flex-1"
          required={!editingStudy || !fileUrl}
        />
        {isUploading && (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        )}
      </div>
      {fileUrl && (
        <div className="mt-2">
          <a 
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm text-primary hover:text-primary-dark"
          >
            Arquivo atual
          </a>
        </div>
      )}
    </div>
  );
};
