import { Eye, EyeOff, Loader, Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react';
import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignupPage = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error('Full Name is required')
    if (!formData.email.trim()) return toast.error('Email is required')
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Invalid email address')
    if (!formData.password.trim()) return toast.error('Password is required')

      return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div 
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"> 
                <MessageSquare className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Create Account</h1>
              <p className="text-base-content/60">Get stated with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className='size-5 text-base-content/40' />
                </div>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder='Full Name'
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className='size-5 text-base-content/40' />
                </div>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder='Email'
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className='size-5 text-base-content/40' />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder='Password'
                />
                <button 
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className='size-5 text-base-content/40' /> : <Eye className='size-5 text-base-content/40' />}
                </button>
              </div>
            </div>
            
            <button type='submit' className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? <Loader2 className='size-5 animate-spin' /> : 'Create Account'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account? {' '}
              <Link to={'/login'} className='link link-primary'>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with other users and get support"
      />
    </div>
  )
}

export default SignupPage;