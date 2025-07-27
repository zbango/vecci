import { createSupabaseServerClient } from './supabase';
import { v4 as uuidv4 } from 'uuid';

async function getServerStorage() {
  const { storage } = await createSupabaseServerClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1);
  const path = `${folder ? folder + '/' : ''}${uuidv4()}.${fileExtension}`;

  const storage = await getServerStorage();

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    return { imageUrl: '', error: 'Image upload failed' };
  }

  const imageUrl = `${process.env
    .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${bucket}/${data?.path}`;

  return { imageUrl, error: '' };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split('/storage/v1/object/public/')[1];
  const firstSlashIndex = bucketAndPathString.indexOf('/');

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = await getServerStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};
