import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { UploadZone } from './UploadZone';
import { CredentialCard } from './CredentialCard';
import { useCredentialStore } from '../store/credentialStore';
import { useAuthStore } from '../store/authStore';
import { Credential } from '../types';

export function Dashboard() {
  const { credentials, isLoading } = useCredentialStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'pending'>('all');

  const filteredCredentials = credentials.filter((cred: Credential) => {
    const matchesSearch = cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || cred.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {user && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Credentials</h2>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="btn"
            >
              {showUpload ? 'Hide Upload' : <><Plus className="h-4 w-4 mr-2" /> Add Credential</>}
            </button>
          </div>
          
          {showUpload && (
            <div className="mb-8">
              <UploadZone />
            </div>
          )}
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredCredentials.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCredentials.map((credential) => (
            <CredentialCard key={credential.id} credential={credential} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No credentials found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}