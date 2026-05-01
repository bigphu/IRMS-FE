import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (currentUser) navigate(currentUser.role === 'CHEF' ? '/kds' : '/menu'); }, [currentUser, navigate]);

  const handleMockLogin = (role: 'SERVER' | 'CHEF') => {
    login({ user: { id: role === 'CHEF' ? 'chef1' : 'cust1', email: 'test@diner.com', name: 'Demo', role }, accessToken: 'jwt_mock', refreshToken: 'jwt_mock_refresh' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-screen">
      <div className="bg-surface p-10 rounded-card shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-8 text-dark">Diner Login</h2>
        <div className="space-y-4">
          <Button variant="primary" className="w-full" onClick={() => handleMockLogin('SERVER')}>LOGIN AS SERVER</Button>
          <Button variant="outline" className="w-full" onClick={() => handleMockLogin('CHEF')}>LOGIN AS CHEF</Button>
        </div>
      </div>
    </div>
  );
}