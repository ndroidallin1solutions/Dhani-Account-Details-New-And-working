import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IndianRupee } from 'lucide-react';
import useStore from '../lib/store';

const loginSchema = z.object({
  userId: z.string().length(10, 'Mobile number must be 10 digits'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    if (login(data.userId, data.password)) {
      navigate(data.userId === '9899654695' ? '/admin' : '/dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <IndianRupee className="w-12 h-12 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 ml-2">Dhani-Finance</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              {...register('userId')}
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 10-digit mobile number"
            />
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => alert('Sign up functionality coming soon!')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;