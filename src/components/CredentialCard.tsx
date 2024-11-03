import React from 'react';
import { CheckCircle, Clock, XCircle, Download, Eye } from 'lucide-react';
import type { Credential } from '../types';
import { PinataService } from '../services/pinata';
import toast from 'react-hot-toast';

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const statusIcons = {
    verified: <CheckCircle className="h-5 w-5 text-green-500" />,
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-500" />
  };

  const handleVerify = async () => {
    const pinataService = PinataService.getInstance();
    
    try {
      const verifyPromise = pinataService.verifyFile(credential.hash);
      const isVerified = await toast.promise(verifyPromise, {
        loading: 'Verifying credential...',
        success: 'Credential verified successfully!',
        error: 'Failed to verify credential',
      });

      if (!isVerified) {
        toast.error('Credential verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to verify credential');
    }
  };

  const handleDownload = () => {
    window.open(`https://gateway.pinata.cloud/ipfs/${credential.hash}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{credential.title}</h3>
          {statusIcons[credential.status]}
        </div>
        <div className="mt-2">
          <p className="text-sm text-gray-600">{credential.institution}</p>
          <p className="text-xs text-gray-500">Issued: {credential.issueDate}</p>
          <p className="text-xs font-mono text-gray-400 truncate mt-1">
            Hash: {credential.hash}
          </p>
        </div>
        <div className="mt-4 flex space-x-3">
          <button 
            onClick={handleDownload}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </button>
          <button 
            onClick={handleVerify}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="h-4 w-4 mr-1" />
            Verify
          </button>
        </div>
      </div>
    </div>
  );
}