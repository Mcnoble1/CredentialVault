import React, { useState } from 'react';
import { GraduationCap, LogIn, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { SignInModal } from './SignInModal';

export function Header() {
  const { user, logout } = useAuthStore();
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">CredentialVault</span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user.name}</span>
                </div>
                <button 
                  onClick={() => logout()}
                  className="btn-secondary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsSignInModalOpen(true)}
                className="btn"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </header>
  );
}