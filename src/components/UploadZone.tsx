import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { PinataService } from '../services/pinata';
import { useCredentialStore } from '../store/credentialStore';
import { useAuthStore } from '../store/authStore';

export function UploadZone() {
  const { user } = useAuthStore();
  const { addCredential } = useCredentialStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const pinataService = PinataService.getInstance();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!user) {
      toast.error('Please sign in to upload credentials');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromise = (async () => {
        const hash = await pinataService.uploadFile(selectedFile);
        const credential = {
          id: crypto.randomUUID(),
          title: selectedFile.name.replace(/\.[^/.]+$/, ''),
          institution: user.role === 'institution' ? user.name : 'Pending Verification',
          issueDate: new Date().toISOString(),
          hash,
          type: 'certificate',
          status: user.role === 'institution' ? 'verified' : 'pending',
        };
        addCredential(credential);
        setSelectedFile(null);
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the file here..."
            : "Drag 'n' drop a file here, or click to select"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports PDF, JPG, PNG (up to 10MB)
        </p>
      </div>

      {selectedFile && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <File className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className={`mt-4 w-full btn ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Credential'}
          </button>
        </div>
      )}
    </div>
  );
}