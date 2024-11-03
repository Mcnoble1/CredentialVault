import React from 'react';
import { UploadZone } from './UploadZone';
import { CredentialCard } from './CredentialCard';
import { useCredentialStore } from '../store/credentialStore';
import { useAuthStore } from '../store/authStore';

export function Dashboard() {
  const { credentials } = useCredentialStore();
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upload New Credential</h2>
          <p className="mt-1 text-sm text-gray-600">
            Upload your academic credentials for verification and secure storage
          </p>
          <div className="mt-4">
            <UploadZone />
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {user ? 'Your Credentials' : 'Sample Credentials'}
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {credentials.map((credential) => (
            <CredentialCard key={credential.id} credential={credential} />
          ))}
        </div>
      </div>
    </div>
  );
}