import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { EnvelopeSimple, Lock } from '@phosphor-icons/react';
import { Button, Input, Card } from '../components/ui';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../types/api.types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      await login(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo1.png"
            alt="Worket"
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Worket Employer</h1>
          <p className="text-gray-500">Sign in to your dashboard</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
              placeholder="you@company.com"
              leftIcon={<EnvelopeSimple weight="bold" className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
              placeholder="Enter your password"
              leftIcon={<Lock weight="bold" className="w-4 h-4" />}
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Employer accounts are created by administrators.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Contact support if you need access.
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} Worket. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
