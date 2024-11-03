import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { PinataService } from '../services/pinata';
import { useCredentialStore } from '../store/credentialStore';
import { useAuthStore } from '../store/authStore';

export function UploadZone() {
  const { user } = useAuthStore();
  const { addCredential } = useCredentialStore();
  const pinataService = PinataService.getInstance();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) {
      toast.error('Please sign in to upload credentials');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const uploadPromise = (async () => {
        const hash = await pinataService.uploadFile(file);
        const credential = {
          id: crypto.randomUUID(),
          title: file.name,
          institution: user.role === 'institution' ? user.name : 'Pending Verification',
          issueDate: new Date().toISOString(),
          hash,
          type: 'certificate',
          status: user.role === 'institution' ? 'verified' : 'pending',
        };
        addCredential(credential);
        return credential;
      })();

      await toast.promise(uploadPromise, {
        loading: 'Uploading credential...',
        success: 'Credential uploaded successfully!',
        error: 'Failed to upload credential',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload credential');
    }
  }, [user, addCredential]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? "Drop the files here..."
          : "Drag 'n' drop files here, or click to select files"}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports PDF, JPG, PNG (up to 10MB)
      </p>
    </div>
  );
}