import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<'student' | 'institution' | 'verifier'>('student');

  const demoUsers = {
    student: {
      id: '1',
      name: 'John Student',
      email: 'john@university.edu',
      role: 'student' as const,
    },
    institution: {
      id: '2',
      name: 'University of Technology',
      email: 'admin@university.edu',
      role: 'institution' as const,
    },
    verifier: {
      id: '3',
      name: 'Employer Corp',
      email: 'verify@employer.com',
      role: 'verifier' as const,
    },
  };

  const handleSignIn = () => {
    login(demoUsers[selectedRole]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Sign In</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as typeof selectedRole)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="student">Student</option>
              <option value="institution">Educational Institution</option>
              <option value="verifier">Employer/Verifier</option>
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-sm text-gray-700 mb-2">Demo Account Details:</h3>
            <p className="text-sm text-gray-600">Name: {demoUsers[selectedRole].name}</p>
            <p className="text-sm text-gray-600">Email: {demoUsers[selectedRole].email}</p>
          </div>

          <button
            onClick={handleSignIn}
            className="w-full btn"
          >
            Sign In as {demoUsers[selectedRole].name}
          </button>
        </div>
      </div>
    </div>
  );
}