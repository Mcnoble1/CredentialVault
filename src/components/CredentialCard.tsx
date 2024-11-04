import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Download, Eye, Trash2, Share2 } from 'lucide-react';
import type { Credential } from '../types';
import { PinataService } from '../services/pinata';
import { useCredentialStore } from '../store/credentialStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const { user } = useAuthStore();
  const { deleteCredential, updateCredential } = useCredentialStore();
  const [isVerifying, setIsVerifying] = useState(false);

  const statusIcons = {
    verified: <CheckCircle className="h-5 w-5 text-green-500" />,
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    
    const pinataService = PinataService.getInstance();
    setIsVerifying(true);
    
    try {
      const verifyPromise = pinataService.verifyFile(credential.hash);
      const isVerified = await toast.promise(verifyPromise, {
        loading: 'Verifying credential...',
        success: 'Credential verified successfully!',
        error: 'Failed to verify credential',
      });

      if (isVerified) {
        updateCredential(credential.id, { status: 'verified' });
      } else {
        updateCredential(credential.id, { status: 'rejected' });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify credential');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this credential?')) {
      deleteCredential(credential.id);
      toast.success('Credential deleted successfully');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/verify/${credential.hash}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Verification link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = () => {
    window.open(`https://gateway.pinata.cloud/ipfs/${credential.hash}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {statusIcons[credential.status]}
            <span className={`text-sm font-medium capitalize
              ${credential.status === 'verified' ? 'text-green-700' : 
                credential.status === 'pending' ? 'text-yellow-700' : 'text-red-700'}`}>
              {credential.status}
            </span>
          </div>
          {user && (
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete credential"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{credential.title}</h3>
        
        <div className="space-y-1 mb-4">
          <p className="text-sm text-gray-600">{credential.institution}</p>
          <p className="text-xs text-gray-500">
            Issued: {new Date(credential.issueDate).toLocaleDateString()}
          </p>
          <p className="text-xs font-mono text-gray-400 truncate">
            Hash: {credential.hash}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleDownload}
            className="flex-1 btn-secondary"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
          
          <button 
            onClick={handleVerify}
            disabled={isVerifying}
            className={`flex-1 btn ${isVerifying ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>

          <button
            onClick={handleShare}
            className="flex-1 btn-secondary"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}