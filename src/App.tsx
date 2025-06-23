import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import SalesManagement from './components/SalesManagement';
import ExpenseManagement from './components/ExpenseManagement';
import EmployeeManagement from './components/EmployeeManagement';
import Reports from './components/Reports';
import { supabase } from './lib/supabase';

// Sample data generator

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
        setUserEmail(data.session.user.email ?? null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
      setIsInitialized(true);
    };
    checkSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email ?? null);
      } else {
        setIsAuthenticated(false);
        setUserEmail(null);
      }
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    if (!email || !password) {
      setAuthError('Please enter email and password.');
      setAuthLoading(false);
      return;
    }
    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setAuthError('Check your email for a confirmation link.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(error.message);
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const renderAuthForm = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleAuth} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
        {authError && <div className="mb-4 text-red-600 text-center">{authError}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input name="email" type="email" className="w-full border rounded px-3 py-2" autoComplete="email" />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input name="password" type="password" className="w-full border rounded px-3 py-2" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition" disabled={authLoading}>{authLoading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Sign Up')}</button>
        <div className="mt-4 text-center">
          {authMode === 'login' ? (
            <span>Don't have an account? <button type="button" className="text-blue-600 underline" onClick={() => { setAuthMode('signup'); setAuthError(''); }}>Sign Up</button></span>
          ) : (
            <span>Already have an account? <button type="button" className="text-blue-600 underline" onClick={() => { setAuthMode('login'); setAuthError(''); }}>Login</button></span>
          )}
        </div>
      </form>
    </div>
  );

  const renderCurrentPage = () => {
    if (!isInitialized) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Initializing Application</h2>
          <p className="text-gray-600">Setting up your financial management system...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <SalesManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'reports':
        return <Reports />;
      case 'employees':
        return <EmployeeManagement />;
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">System settings and configuration coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return renderAuthForm();
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      <div className="flex justify-end p-2">
        <span className="mr-4 text-gray-700">{userEmail}</span>
        <button onClick={handleLogout} className="text-sm text-blue-600 underline">Logout</button>
      </div>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;