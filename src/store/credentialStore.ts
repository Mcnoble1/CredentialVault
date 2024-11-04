import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Credential } from '../types';

interface CredentialState {
  credentials: Credential[];
  isLoading: boolean;
  error: string | null;
  addCredential: (credential: Credential) => void;
  updateCredential: (id: string, updates: Partial<Credential>) => void;
  deleteCredential: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const sampleCredentials: Credential[] = [
  {
    id: '1',
    title: 'Bachelor of Computer Science',
    institution: 'University of Technology',
    issueDate: '2023-05-15',
    hash: 'QmX7b2vY8z9j4N5K1M9P2L6W3r4X5h6g7',
    type: 'diploma',
    status: 'verified',
  },
  {
    id: '2',
    title: 'Web Development Certificate',
    institution: 'Tech Academy',
    issueDate: '2023-08-20',
    hash: 'QmA1c2vB3n4M5k6L7j8P9q0R2t3Y4h5g6',
    type: 'certificate',
    status: 'verified',
  },
];

export const useCredentialStore = create<CredentialState>()(
  persist(
    (set) => ({
      credentials: sampleCredentials,
      isLoading: false,
      error: null,
      addCredential: (credential) =>
        set((state) => ({
          credentials: [...state.credentials, credential],
          error: null,
        })),
      updateCredential: (id, updates) =>
        set((state) => ({
          credentials: state.credentials.map((cred) =>
            cred.id === id ? { ...cred, ...updates } : cred
          ),
          error: null,
        })),
      deleteCredential: (id) =>
        set((state) => ({
          credentials: state.credentials.filter((cred) => cred.id !== id),
          error: null,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'credential-storage',
      skipHydration: false,
    }
  )
);