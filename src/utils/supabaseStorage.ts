
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param bucket The storage bucket name
 * @param folder Optional folder path within the bucket
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  bucket: string,
  folder: string = ""
): Promise<string> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Deletes a file from Supabase storage
 * @param url The public URL of the file to delete
 * @param bucket The storage bucket name
 * @returns boolean indicating success
 */
export const deleteFile = async (
  url: string,
  bucket: string
): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const filePath = pathParts.slice(pathParts.indexOf(bucket) + 1).join("/");

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};
