import { create } from 'zustand'
import { apiCall } from '../lib/axios'
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await apiCall.get('/auth/check');
            set({ user: res.data.data })
        } catch (err) {
            set({ user: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res =await apiCall.post('/auth/register', data);
            toast.success('Account created successfully')
            set({ user: res.data.data })
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await apiCall.post('/auth/logout');
            set({ user: null })
            toast.success('Logged out successfully')
        } catch (err) {
            toast.error(err.response.data.message)
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res =await apiCall.post('/auth/login', data);
            set({ user: res.data.data })
            toast.success('Logged in successfully')
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const res = await apiCall.put('/auth/update-profile', data)
            set({ user: res.data.data})
            toast.success('Profile picture update successfully')
        } catch (err) {
            toast.error(err.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
    
}))